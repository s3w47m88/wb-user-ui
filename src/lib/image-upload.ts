export const IMAGE_UPLOAD_BUCKET = "builder-images";
export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;
export const OPTIMIZED_IMAGE_MAX_WIDTH = 1920;
export const OPTIMIZED_IMAGE_MAX_HEIGHT = 1080;
export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;
export const ACCEPTED_IMAGE_UPLOAD_INPUT = ACCEPTED_IMAGE_MIME_TYPES.join(",");

type UploadContext = {
  pageId?: string | null;
  siteId?: string | null;
};

type BuildImageUploadPathOptions = UploadContext & {
  extension?: string;
  now?: Date;
  originalName?: string;
  uuid?: string;
};

export type ImageUploadResult = {
  bucket: string;
  path: string;
  url: string;
};

const FALLBACK_FILE_BASENAME = "image";

const sanitizeSegment = (
  value: string | null | undefined,
  fallback: string,
) => {
  if (!value) {
    return fallback;
  }

  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || fallback;
};

export const sanitizeImageFileName = (
  originalName: string | null | undefined,
  fallback = FALLBACK_FILE_BASENAME,
) => {
  if (!originalName) {
    return fallback;
  }

  const withoutExtension = originalName.replace(/\.[^.]+$/, "");
  return sanitizeSegment(withoutExtension, fallback);
};

export const replaceImageFileExtension = (
  fileName: string,
  extension: string,
) => {
  const normalizedExtension = extension.replace(/^\./, "").toLowerCase();
  const baseName = sanitizeImageFileName(fileName);
  return `${baseName}.${normalizedExtension}`;
};

export const validateImageFile = (file: { size: number; type: string }) => {
  if (
    !file.type ||
    !ACCEPTED_IMAGE_MIME_TYPES.some((mimeType) => mimeType === file.type)
  ) {
    return "Use PNG, JPG, WEBP, GIF, or AVIF image file.";
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return "Image must be 10MB or smaller.";
  }

  return null;
};

export const buildImageUploadPath = ({
  extension = "webp",
  now = new Date(),
  originalName,
  pageId,
  siteId,
  uuid = crypto.randomUUID(),
}: BuildImageUploadPathOptions = {}) => {
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const siteSegment = sanitizeSegment(siteId, "draft-site");
  const pageSegment = sanitizeSegment(pageId, "draft-page");
  const fileName = sanitizeImageFileName(originalName);
  const safeExtension = extension.replace(/^\./, "").toLowerCase() || "webp";

  return `${siteSegment}/${pageSegment}/${year}/${month}/${uuid}-${fileName}.${safeExtension}`;
};

const loadImageElement = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image file."));
    };

    image.src = objectUrl;
  });

const canvasToWebpBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not optimize image."));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      0.85,
    );
  });

export const optimizeImageFile = async (file: File) => {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const image = await loadImageElement(file);
  const scale = Math.min(
    1,
    OPTIMIZED_IMAGE_MAX_WIDTH / image.width,
    OPTIMIZED_IMAGE_MAX_HEIGHT / image.height,
  );
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not open image processor.");
  }

  context.drawImage(image, 0, 0, width, height);
  const blob = await canvasToWebpBlob(canvas);

  return new File([blob], replaceImageFileExtension(file.name, "webp"), {
    type: "image/webp",
    lastModified: Date.now(),
  });
};

export const uploadImageFile = async (
  file: File,
  { pageId, siteId }: UploadContext = {},
) => {
  const formData = new FormData();
  formData.append("file", file);

  if (pageId) {
    formData.append("page_id", pageId);
  }

  if (siteId) {
    formData.append("site_id", siteId);
  }

  const response = await fetch("/api/uploads/images", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as {
    message?: string;
    bucket?: string;
    path?: string;
    url?: string;
  } | null;

  if (!response.ok || !payload?.url || !payload.path || !payload.bucket) {
    throw new Error(payload?.message || "Image upload failed.");
  }

  return {
    bucket: payload.bucket,
    path: payload.path,
    url: payload.url,
  } satisfies ImageUploadResult;
};

export const prepareAndUploadImage = async (
  file: File,
  context?: UploadContext,
) => {
  const optimizedFile = await optimizeImageFile(file);
  return uploadImageFile(optimizedFile, context);
};
