import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  buildImageUploadPath,
  IMAGE_UPLOAD_BUCKET,
  MAX_IMAGE_UPLOAD_BYTES,
  validateImageFile,
} from "@/lib/image-upload";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTENT_URL;
const supabaseServiceKey = process.env.SUPABASE_CONTENT_SECRET_KEY;
const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";
const getStatusCode = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "statusCode" in error &&
  (typeof error.statusCode === "string" || typeof error.statusCode === "number")
    ? String(error.statusCode)
    : "";

const getAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase content environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

const ensureUploadBucket = async (
  adminClient: ReturnType<typeof getAdminClient>,
) => {
  const { data: existingBucket, error: existingBucketError } =
    await adminClient.storage.getBucket(IMAGE_UPLOAD_BUCKET);

  if (existingBucket) {
    if (
      !existingBucket.public ||
      existingBucket.file_size_limit !== MAX_IMAGE_UPLOAD_BYTES ||
      JSON.stringify(existingBucket.allowed_mime_types ?? []) !==
        JSON.stringify([...ACCEPTED_IMAGE_MIME_TYPES])
    ) {
      const { error: updateBucketError } =
        await adminClient.storage.updateBucket(IMAGE_UPLOAD_BUCKET, {
          public: true,
          fileSizeLimit: MAX_IMAGE_UPLOAD_BYTES,
          allowedMimeTypes: [...ACCEPTED_IMAGE_MIME_TYPES],
        });

      if (updateBucketError) {
        throw new Error(updateBucketError.message);
      }
    }

    return;
  }

  if (existingBucketError && getStatusCode(existingBucketError) !== "404") {
    throw new Error(existingBucketError.message);
  }

  const { error: createBucketError } = await adminClient.storage.createBucket(
    IMAGE_UPLOAD_BUCKET,
    {
      public: true,
      fileSizeLimit: MAX_IMAGE_UPLOAD_BYTES,
      allowedMimeTypes: [...ACCEPTED_IMAGE_MIME_TYPES],
    },
  );

  if (createBucketError && getStatusCode(createBucketError) !== "409") {
    throw new Error(createBucketError.message);
  }
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploadFile = formData.get("file");

    if (!(uploadFile instanceof File)) {
      return NextResponse.json(
        { message: "Missing image file." },
        { status: 400 },
      );
    }

    const validationError = validateImageFile({
      size: uploadFile.size,
      type: uploadFile.type,
    });

    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const siteId = formData.get("site_id");
    const pageId = formData.get("page_id");
    const objectPath = buildImageUploadPath({
      extension: uploadFile.name.split(".").pop() || "webp",
      originalName: uploadFile.name,
      pageId: typeof pageId === "string" ? pageId : null,
      siteId: typeof siteId === "string" ? siteId : null,
    });

    const fileBytes = await uploadFile.arrayBuffer();
    const adminClient = getAdminClient();
    await ensureUploadBucket(adminClient);

    const { error: uploadError } = await adminClient.storage
      .from(IMAGE_UPLOAD_BUCKET)
      .upload(objectPath, fileBytes, {
        cacheControl: "31536000",
        contentType: uploadFile.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { message: uploadError.message },
        { status: 400 },
      );
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from(IMAGE_UPLOAD_BUCKET).getPublicUrl(objectPath);

    return NextResponse.json({
      bucket: IMAGE_UPLOAD_BUCKET,
      path: objectPath,
      url: publicUrl,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
