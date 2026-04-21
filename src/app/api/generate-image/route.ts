import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
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
import { SiteConfig, ThemeConfig } from "@/lib/supabase-content";
import {
  buildImageGenerationPrompt,
  getSiteBrandSettings,
} from "@/lib/site-branding";

type GenerateImageRequest = {
  height?: number;
  pageId?: string | null;
  prompt?: string;
  provider?: AiImageProvider;
  referenceImageIds?: string[] | null;
  siteId?: string | null;
  size?: string;
  theme?: ThemeConfig | null;
  width?: number;
};

const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";
const OPENAI_IMAGE_EDIT_API_URL = "https://api.openai.com/v1/images/edits";
const XAI_IMAGE_API_URL = "https://api.x.ai/v1/images/generations";
const XAI_IMAGE_EDIT_API_URL = "https://api.x.ai/v1/images/edits";
const XAI_IMAGE_MODEL = "grok-imagine-image";
const CONTENT_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_CONTENT_URL;
const CONTENT_SUPABASE_SERVICE_KEY = process.env.SUPABASE_CONTENT_SECRET_KEY;

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

const loadSiteConfig = async (siteId?: string | null) => {
  if (!siteId || !CONTENT_SUPABASE_URL || !CONTENT_SUPABASE_SERVICE_KEY) {
    return null;
  }

  const adminClient = createClient(
    CONTENT_SUPABASE_URL,
    CONTENT_SUPABASE_SERVICE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );

  const { data } = await adminClient
    .from("sites")
    .select("id, name, logo_url, brand_settings")
    .eq("id", siteId)
    .maybeSingle();

  return (data as SiteConfig | null) ?? null;
};

const resolveReferenceImageUrls = (
  site: SiteConfig | null,
  selectedIds?: string[] | null,
) => {
  const references = getSiteBrandSettings(site).reference_images;

  if (selectedIds === undefined || selectedIds === null) {
    return references.map((image) => image.url);
  }

  const selectedIdSet = new Set(
    selectedIds.map((id) => id.trim()).filter(Boolean),
  );

  return references
    .filter((image) => selectedIdSet.has(image.id))
    .map((image) => image.url);
};

async function callImageApi(input: {
  url: string;
  apiKey: string;
  body: Record<string, unknown>;
}) {
  const response = await fetch(input.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input.body),
  });

  const payload = (await response.json().catch(() => null)) as
    | Record<string, unknown>
    | null;

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      payload,
    };
  }

  return {
    ok: true as const,
    status: response.status,
    payload,
  };
}

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
      referenceImageIds,
      theme,
    } = (await request.json()) as GenerateImageRequest;

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const site = await loadSiteConfig(siteId);
    const selectedReferenceImages = resolveReferenceImageUrls(
      site,
      referenceImageIds,
    );
    const enrichedPrompt = buildImageGenerationPrompt({
      prompt,
      site,
      theme: theme ?? null,
    });

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
      const xAiBody: Record<string, unknown> = {
        model: XAI_IMAGE_MODEL,
        prompt: enrichedPrompt,
        resolution,
        response_format: "b64_json",
      };

      if (selectedReferenceImages.length) {
        if (selectedReferenceImages.length === 1) {
          xAiBody.image = {
            type: "image_url",
            url: selectedReferenceImages[0],
          };
        } else {
          xAiBody.images = selectedReferenceImages.map((url) => ({
            type: "image_url",
            url,
          }));
          xAiBody.aspect_ratio = aspectRatio;
        }
      } else {
        xAiBody.aspect_ratio = aspectRatio;
      }

      const xAiResponse = await callImageApi({
        url: selectedReferenceImages.length
          ? XAI_IMAGE_EDIT_API_URL
          : XAI_IMAGE_API_URL,
        apiKey: xAiApiKey,
        body: xAiBody,
      });

      if (!xAiResponse.ok) {
        return NextResponse.json(
          { error: getErrorMessage(xAiResponse.payload) },
          { status: xAiResponse.status },
        );
      }

      const imageBase64 = extractGeneratedImageBase64(xAiResponse.payload);

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
        referenceImagesUsed: selectedReferenceImages.length,
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
      const response = await callImageApi({
        url: selectedReferenceImages.length
          ? OPENAI_IMAGE_EDIT_API_URL
          : OPENAI_IMAGE_API_URL,
        apiKey: openAiApiKey,
        body: selectedReferenceImages.length
          ? {
              model,
              prompt: enrichedPrompt,
              images: selectedReferenceImages.map((url) => ({
                image_url: url,
              })),
              input_fidelity: "high",
              n: 1,
              output_compression: 90,
              output_format: "webp",
              quality: "medium",
              size: resolvedSize,
            }
          : {
              model,
              prompt: enrichedPrompt,
              n: 1,
              output_compression: 90,
              output_format: "webp",
              quality: "medium",
              size: resolvedSize,
            },
      });

      if (!response.ok) {
        lastErrorMessage = getErrorMessage(response.payload);

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

      const imageBase64 = extractGeneratedImageBase64(response.payload);

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
        referenceImagesUsed: selectedReferenceImages.length,
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
