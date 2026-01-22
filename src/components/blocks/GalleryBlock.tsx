'use client';

import React from 'react';

export type GalleryBlockProps = {
  title: string;
  images: Array<{ url: string; alt: string }>;
  columns?: number;
};

export const GalleryBlock: React.FC<GalleryBlockProps> = ({
  title,
  images,
  columns = 3,
}) => {
  return (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">{title}</h2>
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg bg-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 animate-fade-in group"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Self-contained placeholder image (gray square with text)
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DbGljayB0byB1cGxvYWQgaW1hZ2U8L3RleHQ+PC9zdmc+';

export const galleryBlockConfig = {
  type: 'gallery',
  name: 'Image Gallery',
  category: 'sections',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iMjAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMWYyOTM3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBHYWxsZXJ5PC90ZXh0PjxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjkwIiBoZWlnaHQ9IjkwIiByeD0iNSIgZmlsbD0iI2U1ZTdlYiIvPjxyZWN0IHg9IjExNSIgeT0iNTAiIHdpZHRoPSI5MCIgaGVpZ2h0PSI5MCIgcng9IjUiIGZpbGw9IiNlNWU3ZWIiLz48cmVjdCB4PSIyMTAiIHk9IjUwIiB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHJ4PSI1IiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNjUiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOTk5Ij7wn5OJPC90ZXh0Pjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiPvCfkYo8L3RleHQ+PHRleHQgeD0iMjU1IiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OSI+8J+PlzwvdGV4dD48L3N2Zz4=',
  defaultProps: {
    title: 'Our Gallery',
    images: [
      { url: placeholderImage, alt: 'Image 1' },
      { url: placeholderImage, alt: 'Image 2' },
      { url: placeholderImage, alt: 'Image 3' },
    ],
    columns: 3,
  },
  propsSchema: {
    title: { type: 'text', label: 'Gallery Title' },
    images: { type: 'gallery', label: 'Images' },
    columns: { type: 'number', label: 'Columns', min: 1, max: 4 },
  },
};
