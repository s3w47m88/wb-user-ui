'use client';

import React from 'react';

export type ImageComponentProps = {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  rounded?: boolean;
  shadow?: boolean;
};

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DbGljayB0byB1cGxvYWQgaW1hZ2U8L3RleHQ+PC9zdmc+';

export const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  rounded = false,
  shadow = false,
}) => {
  return (
    <img
      src={src || placeholderImage}
      alt={alt}
      style={{ width, height }}
      className={`${rounded ? 'rounded-lg' : ''} ${shadow ? 'shadow-lg' : ''} object-cover`}
    />
  );
};

export const imageComponentConfig = {
  type: 'image',
  name: 'Image',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjYwIiB5PSI0MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIHJ4PSI4IiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtc2l6ZT0iNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfkYk8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzliYTJhZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2U8L3RleHQ+PC9zdmc+',
  defaultProps: {
    src: placeholderImage,
    alt: 'Image description',
    width: '100%',
    height: 'auto',
    rounded: true,
    shadow: true,
  },
  propsSchema: {
    src: { type: 'image', label: 'Image URL' },
    alt: { type: 'text', label: 'Alt Text' },
    width: { type: 'text', label: 'Width' },
    height: { type: 'text', label: 'Height' },
    rounded: { type: 'boolean', label: 'Rounded Corners' },
    shadow: { type: 'boolean', label: 'Drop Shadow' },
  },
};
