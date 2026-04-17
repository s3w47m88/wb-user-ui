import { NextResponse } from "next/server";
import {
  validateImageFile,
} from "@/lib/image-upload";
import { uploadImageBuffer } from "@/lib/server-image-storage";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

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
    const uploadedImage = await uploadImageBuffer({
      bytes: await uploadFile.arrayBuffer(),
      contentType: uploadFile.type,
      originalName: uploadFile.name,
      pageId: typeof pageId === "string" ? pageId : null,
      siteId: typeof siteId === "string" ? siteId : null,
    });

    return NextResponse.json({
      bucket: uploadedImage.bucket,
      path: uploadedImage.path,
      url: uploadedImage.url,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
