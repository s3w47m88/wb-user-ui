import { supabase, PageConfig } from './supabase';

/**
 * Get the currently selected organization ID from localStorage
 */
function getSelectedOrganizationId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('selectedOrganizationId');
}

export async function savePage(pageConfig: Omit<PageConfig, 'id' | 'created_at' | 'updated_at'>) {
  const organizationId = getSelectedOrganizationId();

  if (!organizationId) {
    throw new Error('No organization selected. Please select an organization first.');
  }

  const { data, error } = await supabase
    .from('pages')
    .insert({
      name: pageConfig.name,
      components: pageConfig.components,
      theme: pageConfig.theme,
      organization_id: organizationId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving page:', {
      error,
      organizationId,
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    throw new Error(`Failed to save page: ${error.message || 'Unknown error'}`);
  }

  return data as PageConfig;
}

export async function updatePage(id: string, pageConfig: Partial<PageConfig>) {
  const { data, error } = await supabase
    .from('pages')
    .update({
      name: pageConfig.name,
      components: pageConfig.components,
      theme: pageConfig.theme,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating page:', {
      error,
      pageId: id,
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    throw new Error(`Failed to update page: ${error.message || 'Unknown error'}`);
  }

  return data as PageConfig;
}

export async function loadPage(id: string) {
  const { data, error } = await supabase
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

  let query = supabase
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

  let query = supabase
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
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting page:', error);
    throw new Error('Failed to delete page');
  }
}
