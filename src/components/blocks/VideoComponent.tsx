'use client';

import React from 'react';

export type VideoComponentProps = {
  url: string;
  type?: 'youtube' | 'vimeo' | 'direct';
  width?: string;
  height?: string;
  autoplay?: boolean;
  controls?: boolean;
};

export const VideoComponent: React.FC<VideoComponentProps> = ({
  url,
  type = 'youtube',
  width = '100%',
  height = '400px',
  autoplay = false,
  controls = true,
}) => {
  // Extract video ID from YouTube URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?]+)/);
    return match?.[1] || url;
  };

  // Extract video ID from Vimeo URL
  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match?.[1] || url;
  };

  const renderVideo = () => {
    if (type === 'youtube') {
      const videoId = getYouTubeId(url);
      const embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;
      return (
        <iframe
          src={embedUrl}
          width={width}
          height={height}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-lg"
        />
      );
    }

    if (type === 'vimeo') {
      const videoId = getVimeoId(url);
      const embedUrl = `https://player.vimeo.com/video/${videoId}${autoplay ? '?autoplay=1' : ''}`;
      return (
        <iframe
          src={embedUrl}
          width={width}
          height={height}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-lg"
        />
      );
    }

    // Direct video file
    return (
      <video
        src={url}
        width={width}
        height={height}
        controls={controls}
        autoPlay={autoplay}
        className="rounded-lg shadow-lg"
      />
    );
  };

  return (
    <div className="relative" style={{ width, height }}>
      {renderVideo()}
    </div>
  );
};

export const videoComponentConfig = {
  type: 'video',
  name: 'Video',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjYwIiB5PSI0MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIHJ4PSI4IiBmaWxsPSIjMTExODI3Ii8+PHBvbHlnb24gcG9pbnRzPSIxMzUsNjAgMTg1LDkwIDEzNSwxMjAiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
  defaultProps: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'youtube',
    width: '100%',
    height: '400px',
    autoplay: false,
    controls: true,
  },
  propsSchema: {
    url: { type: 'text', label: 'Video URL' },
    type: { type: 'select', label: 'Video Type', options: ['youtube', 'vimeo', 'direct'] },
    width: { type: 'text', label: 'Width' },
    height: { type: 'text', label: 'Height' },
    autoplay: { type: 'boolean', label: 'Autoplay' },
    controls: { type: 'boolean', label: 'Show Controls' },
  },
};
