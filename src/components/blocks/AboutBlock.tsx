'use client';

import React from 'react';

export type AboutBlockProps = {
  candidateName: string;
  candidateTitle: string;
  bio: string;
  imageUrl: string;
  flagEmoji?: boolean;
};

export const AboutBlock: React.FC<AboutBlockProps> = ({
  candidateName,
  candidateTitle,
  bio,
  imageUrl,
  flagEmoji = true,
}) => {
  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={imageUrl}
              alt={candidateName}
              className="w-full rounded-lg shadow-xl"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              {flagEmoji && <span className="text-4xl">🇺🇸</span>}
              <div>
                <h2 className="text-4xl font-bold">{candidateName}</h2>
                <p className="text-xl text-gray-600 mt-1">{candidateTitle}</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none mt-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const aboutBlockConfig = {
  type: 'about',
  name: 'About',
  category: 'sections',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIyMCIgeT0iMzAiIHdpZHRoPSIxMzAiIGhlaWdodD0iMTIwIiByeD0iOCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjE3MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZjI5MzciPkpvaG4gU21pdGg8L3RleHQ+PHRleHQgeD0iMTcwIiB5PSI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNGI1NTYzIj5DYW5kaWRhdGUgZm9yIFUuUy4gU2VuYXRlPC90ZXh0Pjx0ZXh0IHg9IjE3MCIgeT0iOTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzZiNzI4MCI+QSBsaWZlbG9uZyBjb25zZXJ2YXRpdmUgYW5kPC90ZXh0Pjx0ZXh0IHg9IjE3MCIgeT0iMTA4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2YjcyODAiPmRlZGljYXRlZCBwdWJsaWMgc2VydmFudC4uLjwvdGV4dD48dGV4dCB4PSIxNzAiIHk9IjEyMSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNmI3MjgwIj5GaWdodGluZyBmb3IgQW1lcmljYW4gdmFsdWVzLjwvdGV4dD48dGV4dCB4PSIxNjAiIHk9IjQ1IiBmb250LXNpemU9IjI0Ij7wn4e68J+HuDwvdGV4dD48L3N2Zz4=',
  defaultProps: {
    candidateName: 'John Smith',
    candidateTitle: 'Candidate for U.S. Senate',
    bio: 'A lifelong conservative and dedicated public servant with over 20 years of experience fighting for American values.\n\nJohn has worked tirelessly to defend freedom, protect our constitutional rights, and ensure prosperity for all Americans.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600',
    flagEmoji: true,
  },
  propsSchema: {
    candidateName: { type: 'text', label: 'Candidate Name' },
    candidateTitle: { type: 'text', label: 'Candidate Title' },
    bio: { type: 'textarea', label: 'Biography' },
    imageUrl: { type: 'image', label: 'Candidate Photo' },
    flagEmoji: { type: 'boolean', label: 'Show Flag Emoji' },
  },
};
