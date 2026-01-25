import { supabaseContent, PageConfig } from './supabase-content';

/**
 * Get the currently selected organization ID from localStorage
 */
function getSelectedOrganizationId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('selectedOrganizationId');
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return slug || `page-${Date.now().toString(36)}`;
}

function isValidUuid(value?: string | null): value is string {
  return Boolean(
    value &&
      value !== 'undefined' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

export async function savePage(pageConfig: Omit<PageConfig, 'id' | 'created_at' | 'updated_at'>) {
  const organizationId = getSelectedOrganizationId();
  const siteId = isValidUuid(pageConfig.site_id) ? pageConfig.site_id : null;

  if (!organizationId) {
    throw new Error('No organization selected. Please select an organization first.');
  }

  if (!siteId) {
    throw new Error('No site ID available. Please create a site first.');
  }

  const slug = pageConfig.slug?.trim() || slugify(pageConfig.name || 'page');

  const response = await fetch('/api/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      site_id: siteId,
      name: pageConfig.name,
      title: pageConfig.name,
      slug,
      components: pageConfig.components,
      theme: pageConfig.theme,
      organization_id: organizationId,
      site_domain: pageConfig.site_domain || null,
      use_temporary_domain: Boolean(pageConfig.use_temporary_domain),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Error saving page:', {
      error: result?.error,
      organizationId,
      status: response.status,
      message: result?.message,
    });
    throw new Error(`Failed to save page: ${result?.message || 'Unknown error'}`);
  }

  return result as PageConfig;
}

export async function updatePage(id: string, pageConfig: Partial<PageConfig>) {
  const siteId = isValidUuid(pageConfig.site_id) ? pageConfig.site_id : undefined;

  const response = await fetch(`/api/pages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(siteId ? { site_id: siteId } : {}),
      name: pageConfig.name,
      components: pageConfig.components,
      theme: pageConfig.theme,
      site_domain: pageConfig.site_domain,
      use_temporary_domain: pageConfig.use_temporary_domain,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    const error: any = new Error(`Failed to update page: ${result?.message || 'Unknown error'}`);
    error.code = response.status === 404 ? 'NOT_FOUND' : result?.code;
    console.error('Error updating page:', {
      error: result?.error,
      pageId: id,
      code: error.code,
      message: result?.message,
      status: response.status,
    });
    throw error;
  }

  return result as PageConfig;
}

export async function loadPage(id: string) {
  const { data, error } = await supabaseContent
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading page:', error);
    throw new Error('Failed to load page');
  }

  return data as PageConfig;
}

export async function listPages() {
  const organizationId = getSelectedOrganizationId();

  let query = supabaseContent
    .from('pages')
    .select('id, name, created_at, updated_at')
    .order('created_at', { ascending: false });

  // Filter by organization if one is selected
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error listing pages:', error);
    throw new Error('Failed to list pages');
  }

  return data;
}

export async function getAllPages() {
  const organizationId = getSelectedOrganizationId();

  let query = supabaseContent
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });

  // Filter by organization if one is selected
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error getting all pages:', error);
    // Return empty array instead of throwing - table might not exist yet
    return [];
  }

  return data as PageConfig[];
}

export async function deletePage(id: string) {
  const { error } = await supabaseContent
    .from('pages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting page:', error);
    throw new Error('Failed to delete page');
  }
}
