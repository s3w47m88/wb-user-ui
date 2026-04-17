export const AI_IMAGE_PROVIDERS = [
  { id: "openai", label: "OpenAI (ChatGPT)" },
  { id: "xai", label: "Grok (xAI)" },
] as const;

export type AiImageProvider = (typeof AI_IMAGE_PROVIDERS)[number]["id"];

type XAiKeyEnv = {
  XAI_API_KEY?: string;
};

type ResolveAspectRatioOptions = {
  height?: number;
  width?: number;
};

export type XAiAspectRatio =
  | "auto"
  | "1:1"
  | "3:2"
  | "2:3";

export type XAiResolution = "1k" | "2k";

export const getConfiguredXAiApiKey = (env: XAiKeyEnv) => {
  const xAiApiKey = env.XAI_API_KEY?.trim();
  return xAiApiKey || null;
};

export const resolveXAiAspectRatio = ({
  height,
  width,
}: ResolveAspectRatioOptions): XAiAspectRatio => {
  if (typeof width !== "number" || typeof height !== "number") {
    return "auto";
  }

  if (width === height) {
    return "1:1";
  }

  return width > height ? "3:2" : "2:3";
};

export const resolveXAiResolution = ({
  height,
  width,
}: ResolveAspectRatioOptions): XAiResolution => {
  if (
    (typeof width === "number" && width > 1024) ||
    (typeof height === "number" && height > 1024)
  ) {
    return "2k";
  }

  return "1k";
};
