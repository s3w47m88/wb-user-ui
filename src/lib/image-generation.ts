import { AiImageProvider } from "@/lib/ai-image-provider";
import { OpenAiImageSize } from "@/lib/openai-image-generation";

export type ImageGenerationParams = {
  height?: number;
  pageId?: string | null;
  prompt: string;
  provider?: AiImageProvider;
  siteId?: string | null;
  size?: OpenAiImageSize;
  width?: number;
};

type GenerateImageResponse = {
  imageUrl?: string;
  message?: string;
  error?: string;
};

export async function generateImage(
  params: ImageGenerationParams,
): Promise<string> {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = (await response.json().catch(() => null)) as
    | GenerateImageResponse
    | null;

  if (!response.ok || !data?.imageUrl) {
    throw new Error(
      data?.message || data?.error || "Failed to generate image.",
    );
  }

  return data.imageUrl;
}
