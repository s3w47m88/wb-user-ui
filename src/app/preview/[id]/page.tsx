'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { loadPage } from '@/lib/page-service';
import { PageConfig } from '@/lib/supabase';
import { EditableBlock } from '@/components/editor/EditableBlock';

export default function PreviewPage() {
  const params = useParams();
  const [page, setPage] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        const pageId = params.id as string;
        const pageData = await loadPage(pageId);
        setPage(pageData);
      } catch (err) {
        console.error('Error loading page:', err);
        setError('Failed to load page. Please check the link and try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The page you are looking for does not exist.'}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Header */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">{page.name}</span>
        </div>
        <a
          href="/"
          className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          Create Your Own
        </a>
      </div>

      {/* Page Content */}
      <div>
        {page.components
          .sort((a, b) => a.order - b.order)
          .map((component) => (
            <EditableBlock key={component.id} component={component} disabled />
          ))}
      </div>
    </div>
  );
}
