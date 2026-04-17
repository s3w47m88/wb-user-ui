export type EditableImageTarget = {
  key: string;
  index?: number;
};

export type GalleryImage = {
  url: string;
  alt?: string;
};

export const normalizeImagesProp = (images: unknown): unknown => {
  if (typeof images !== "string") {
    return images;
  }

  const trimmedImages = images.trim();
  if (
    !trimmedImages ||
    (!trimmedImages.startsWith("[") && !trimmedImages.startsWith("{"))
  ) {
    return images;
  }

  try {
    return JSON.parse(trimmedImages);
  } catch {
    return images;
  }
};

export const getEditableImageUrl = (
  props: Record<string, unknown>,
  target: EditableImageTarget | null,
): string | undefined => {
  if (!target) {
    return undefined;
  }

  if (target.key === "images" && typeof target.index === "number") {
    const images = Array.isArray(props.images)
      ? (props.images as GalleryImage[])
      : [];
    const selectedImage = images[target.index];

    return typeof selectedImage?.url === "string"
      ? selectedImage.url
      : undefined;
  }

  const value = props[target.key];
  return typeof value === "string" ? value : undefined;
};

export const buildImageUpdate = (
  props: Record<string, unknown>,
  target: EditableImageTarget,
  url: string,
): Record<string, unknown> => {
  if (target.key === "images" && typeof target.index === "number") {
    const images = Array.isArray(props.images)
      ? ([...props.images] as Array<GalleryImage | string | null | undefined>)
      : [];
    const currentImage = images[target.index];

    images[target.index] =
      currentImage && typeof currentImage === "object"
        ? { ...(currentImage as GalleryImage), url }
        : { url, alt: `Image ${target.index + 1}` };

    return { images };
  }

  return { [target.key]: url };
};
