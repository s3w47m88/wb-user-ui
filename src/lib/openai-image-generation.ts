import { sanitizeImageFileName } from "@/lib/image-upload";

export const OPENAI_IMAGE_MODELS = ["gpt-image-1.5", "gpt-image-1"] as const;
export const OPENAI_IMAGE_SIZES = [
  "1024x1024",
  "1024x1536",
  "1536x1024",
] as const;

export type OpenAiImageSize = (typeof OPENAI_IMAGE_SIZES)[number];

type OpenAiKeyEnv = {
  OPENAI_API_KEY?: string;
  REPLICATE_API_TOKEN?: string;
};

type ResolveImageSizeOptions = {
  height?: number;
  size?: string;
  width?: number;
};

const isSupportedImageSize = (value: string): value is OpenAiImageSize =>
  OPENAI_IMAGE_SIZES.includes(value as OpenAiImageSize);

export const resolveOpenAiImageSize = ({
  height,
  size,
  width,
}: ResolveImageSizeOptions): OpenAiImageSize => {
  if (size && isSupportedImageSize(size)) {
    return size;
  }

  if (typeof width === "number" && typeof height === "number") {
    if (width > height) {
      return "1536x1024";
    }

    if (height > width) {
      return "1024x1536";
    }
  }

  return "1024x1024";
};

export const extractGeneratedImageBase64 = (payload: unknown) => {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("data" in payload) ||
    !Array.isArray(payload.data)
  ) {
    return null;
  }

  const firstImage = payload.data[0];

  if (
    typeof firstImage !== "object" ||
    firstImage === null ||
    !("b64_json" in firstImage) ||
    typeof firstImage.b64_json !== "string" ||
    !firstImage.b64_json
  ) {
    return null;
  }

  return firstImage.b64_json;
};

export const buildGeneratedImageFileName = (prompt: string) =>
  `${sanitizeImageFileName(prompt, "generated-image")}.webp`;

export const getConfiguredOpenAiApiKey = (env: OpenAiKeyEnv) => {
  const openAiApiKey = env.OPENAI_API_KEY?.trim();

  if (openAiApiKey) {
    return openAiApiKey;
  }

  const legacyReplicateToken = env.REPLICATE_API_TOKEN?.trim();
  return legacyReplicateToken || null;
};
