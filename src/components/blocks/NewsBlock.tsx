'use client';

import React from 'react';

export type NewsBlockProps = {
  title: string;
  articles: Array<{
    headline: string;
    date: string;
    excerpt: string;
    link: string;
  }>;
};

export const NewsBlock: React.FC<NewsBlockProps> = ({ title, articles }) => {
  return (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                <h3 className="text-xl font-bold mb-3">{article.headline}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <a
                  href={article.link}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Read More →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export const newsBlockConfig = {
  type: 'news',
  name: 'News/Blog',
  category: 'sections',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iMjAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMWYyOTM3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MYXRlc3QgTmV3czwvdGV4dD48cmVjdCB4PSIxNSIgeT0iNTAiIHdpZHRoPSI5MCIgaGVpZ2h0PSIxMTAiIHJ4PSI1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSIxMTUiIHk9IjUwIiB3aWR0aD0iOTAiIGhlaWdodD0iMTEwIiByeD0iNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PHJlY3QgeD0iMjE1IiB5PSI1MCIgd2lkdGg9IjkwIiBoZWlnaHQ9IjExMCIgcng9IjUiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMSIvPjx0ZXh0IHg9IjIwIiB5PSI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjkiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMWYyOTM3Ij5OZXdzIEhlYWRsaW5lPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI4NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjciIGZpbGw9IiM2YjcyODAiPkRhdGU8L3RleHQ+PGxpbmUgeDE9IjIwIiB5MT0iOTAiIHgyPSI5NSIgeTI9IjkwIiBzdHJva2U9IiNlNWU3ZWIiLz48dGV4dCB4PSIyMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNyIgZmlsbD0iIzZiNzI4MCI+RXhjZXJwdCB0ZXh0Li4uPC90ZXh0Pjx0ZXh0IHg9IjEyMCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI5IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzFmMjkzNyI+TmV3cyBIZWFkbGluZTwvdGV4dD48dGV4dCB4PSIxMjAiIHk9Ijg1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNyIgZmlsbD0iIzZiNzI4MCI+RGF0ZTwvdGV4dD48dGV4dCB4PSIyMjAiIHk9IjcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZjI5MzciPk5ld3MgSGVhZGxpbmU8L3RleHQ+PHRleHQgeD0iMjIwIiB5PSI4NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjciIGZpbGw9IiM2YjcyODAiPkRhdGU8L3RleHQ+PC9zdmc+',
  defaultProps: {
    title: 'Latest News',
    articles: [
      {
        headline: 'Campaign Launch Event Draws Record Crowd',
        date: 'March 15, 2025',
        excerpt: 'Over 2,000 supporters gathered to kick off the campaign with an inspiring message of hope and change.',
        link: '#',
      },
      {
        headline: 'Endorsement from Veterans Association',
        date: 'March 10, 2025',
        excerpt: 'Local veterans group announces strong support for conservative values and leadership.',
        link: '#',
      },
      {
        headline: 'Town Hall Meeting This Saturday',
        date: 'March 5, 2025',
        excerpt: 'Join us for an open discussion on the issues that matter most to our community.',
        link: '#',
      },
    ],
  },
  propsSchema: {
    title: { type: 'text', label: 'Section Title' },
    articles: { type: 'array', label: 'Articles' },
  },
};
