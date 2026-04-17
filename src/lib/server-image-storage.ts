import { createClient } from "@supabase/supabase-js";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  buildImageUploadPath,
  IMAGE_UPLOAD_BUCKET,
  MAX_IMAGE_UPLOAD_BYTES,
} from "@/lib/image-upload";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTENT_URL;
const supabaseServiceKey = process.env.SUPABASE_CONTENT_SECRET_KEY;

const getStatusCode = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "statusCode" in error &&
  (typeof error.statusCode === "string" || typeof error.statusCode === "number")
    ? String(error.statusCode)
    : "";

type UploadContext = {
  pageId?: string | null;
  siteId?: string | null;
};

type UploadImageBufferOptions = UploadContext & {
  bytes: ArrayBuffer | Uint8Array;
  contentType: string;
  originalName: string;
};

export type StoredImageAsset = {
  bucket: string;
  path: string;
  url: string;
};

const getAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase content environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

export const ensureImageUploadBucket = async () => {
  const adminClient = getAdminClient();
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

    return adminClient;
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

  return adminClient;
};

export const uploadImageBuffer = async ({
  bytes,
  contentType,
  originalName,
  pageId,
  siteId,
}: UploadImageBufferOptions): Promise<StoredImageAsset> => {
  if (!ACCEPTED_IMAGE_MIME_TYPES.includes(contentType as (typeof ACCEPTED_IMAGE_MIME_TYPES)[number])) {
    throw new Error("Unsupported image format.");
  }

  const normalizedBytes =
    bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);

  if (normalizedBytes.byteLength > MAX_IMAGE_UPLOAD_BYTES) {
    throw new Error("Image must be 10MB or smaller.");
  }

  const objectPath = buildImageUploadPath({
    extension: originalName.split(".").pop() || "webp",
    originalName,
    pageId,
    siteId,
  });
  const adminClient = await ensureImageUploadBucket();

  const { error: uploadError } = await adminClient.storage
    .from(IMAGE_UPLOAD_BUCKET)
    .upload(objectPath, normalizedBytes, {
      cacheControl: "31536000",
      contentType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = adminClient.storage.from(IMAGE_UPLOAD_BUCKET).getPublicUrl(objectPath);

  return {
    bucket: IMAGE_UPLOAD_BUCKET,
    path: objectPath,
    url: publicUrl,
  };
};
