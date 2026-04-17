import { NextRequest, NextResponse } from "next/server";
import {
  AiImageProvider,
  getConfiguredXAiApiKey,
  resolveXAiAspectRatio,
  resolveXAiResolution,
} from "@/lib/ai-image-provider";
import {
  buildGeneratedImageFileName,
  extractGeneratedImageBase64,
  getConfiguredOpenAiApiKey,
  OPENAI_IMAGE_MODELS,
  resolveOpenAiImageSize,
} from "@/lib/openai-image-generation";
import { uploadImageBuffer } from "@/lib/server-image-storage";

type GenerateImageRequest = {
  height?: number;
  pageId?: string | null;
  prompt?: string;
  provider?: AiImageProvider;
  siteId?: string | null;
  size?: string;
  width?: number;
};

const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";
const XAI_IMAGE_API_URL = "https://api.x.ai/v1/images/generations";
const XAI_IMAGE_MODEL = "grok-imagine-image";

const getErrorMessage = (payload: unknown) => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return "Failed to generate image.";
};

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      provider = "openai",
      width,
      height,
      size,
      siteId,
      pageId,
    } = (await request.json()) as GenerateImageRequest;

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    if (provider === "xai") {
      const xAiApiKey = getConfiguredXAiApiKey({
        XAI_API_KEY: process.env.XAI_API_KEY,
      });

      if (!xAiApiKey) {
        return NextResponse.json(
          {
            error:
              "XAI_API_KEY is not configured. Add it to wb-user-ui/.env and restart npm run dev.",
          },
          { status: 500 },
        );
      }

      const aspectRatio = resolveXAiAspectRatio({ width, height });
      const resolution = resolveXAiResolution({ width, height });
      const response = await fetch(XAI_IMAGE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${xAiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aspect_ratio: aspectRatio,
          model: XAI_IMAGE_MODEL,
          prompt: prompt.trim(),
          resolution,
          response_format: "b64_json",
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | Record<string, unknown>
        | null;

      if (!response.ok) {
        return NextResponse.json(
          { error: getErrorMessage(payload) },
          { status: response.status },
        );
      }

      const imageBase64 = extractGeneratedImageBase64(payload);

      if (!imageBase64) {
        return NextResponse.json(
          { error: "Grok did not return an image." },
          { status: 502 },
        );
      }

      const storedImage = await uploadImageBuffer({
        bytes: Buffer.from(imageBase64, "base64"),
        contentType: "image/jpeg",
        originalName: `${buildGeneratedImageFileName(prompt).replace(/\.webp$/, "")}.jpg`,
        pageId,
        siteId,
      });

      return NextResponse.json({
        aspectRatio,
        bucket: storedImage.bucket,
        imageUrl: storedImage.url,
        model: XAI_IMAGE_MODEL,
        path: storedImage.path,
        provider,
        resolution,
      });
    }

    const openAiApiKey = getConfiguredOpenAiApiKey({
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    });

    if (!openAiApiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is not configured. Add it to wb-user-ui/.env and restart npm run dev.",
        },
        { status: 500 },
      );
    }

    const resolvedSize = resolveOpenAiImageSize({ width, height, size });
    let lastErrorMessage = "Failed to generate image.";

    for (const model of OPENAI_IMAGE_MODELS) {
      const response = await fetch(OPENAI_IMAGE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt: prompt.trim(),
          n: 1,
          output_compression: 90,
          output_format: "webp",
          quality: "medium",
          size: resolvedSize,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | Record<string, unknown>
        | null;

      if (!response.ok) {
        lastErrorMessage = getErrorMessage(payload);

        const shouldTryFallbackModel =
          model !== OPENAI_IMAGE_MODELS[OPENAI_IMAGE_MODELS.length - 1] &&
          response.status >= 400 &&
          response.status < 500;

        if (shouldTryFallbackModel) {
          continue;
        }

        return NextResponse.json(
          { error: lastErrorMessage },
          { status: response.status },
        );
      }

      const imageBase64 = extractGeneratedImageBase64(payload);

      if (!imageBase64) {
        return NextResponse.json(
          { error: "OpenAI did not return an image." },
          { status: 502 },
        );
      }

      const storedImage = await uploadImageBuffer({
        bytes: Buffer.from(imageBase64, "base64"),
        contentType: "image/webp",
        originalName: buildGeneratedImageFileName(prompt),
        pageId,
        siteId,
      });

      return NextResponse.json({
        bucket: storedImage.bucket,
        imageUrl: storedImage.url,
        model,
        path: storedImage.path,
        provider,
        size: resolvedSize,
      });
    }

    return NextResponse.json(
      { error: lastErrorMessage },
      { status: 500 },
    );
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
