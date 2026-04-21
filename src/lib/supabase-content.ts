export type DocumentType = "page" | "post";

export type DocumentStatus = "draft" | "published" | "archived";

export type SeoConfig = {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  excerpt?: string | null;
  status?: DocumentStatus | null;
};

export type PageConfig = SeoConfig & {
  id: string;
  document_type: "page";
  site_id?: string;
  name: string;
  title?: string | null;
  slug?: string;
  components: ComponentData[];
  theme: ThemeConfig;
  organization_id?: string;
  site_domain?: string | null;
  use_temporary_domain?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PostConfig = SeoConfig & {
  id: string;
  document_type: "post";
  site_id?: string;
  name: string;
  title?: string | null;
  slug?: string;
  menu_title?: string | null;
  author?: string | null;
  published_date?: string | null;
  featured_image_url?: string | null;
  components: ComponentData[];
  theme: ThemeConfig;
  organization_id?: string;
  site_domain?: string | null;
  use_temporary_domain?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CmsDocument = PageConfig | PostConfig;

export type SiteConfig = {
  id: string;
  org_id?: string | null;
  slug?: string | null;
  name?: string | null;
  domain?: string | null;
  business_name?: string | null;
  logo_url?: string | null;
  brand_settings?: SiteBrandSettings | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type MenuTargetType = "page" | "post" | "url";

export type MenuItemConfig = {
  id: string;
  label: string;
  target_type: MenuTargetType;
  page_id?: string | null;
  post_id?: string | null;
  url?: string | null;
  open_in_new_tab?: boolean;
  sort_order: number;
  children: MenuItemConfig[];
};

export type MenuConfig = {
  id: string;
  site_id: string;
  name: string;
  slug: string;
  description?: string | null;
  items: MenuItemConfig[];
  created_at?: string | null;
  updated_at?: string | null;
};

export type CmsDocumentBundle = {
  site: SiteConfig | null;
  document: CmsDocument;
  pages: PageConfig[];
  posts: PostConfig[];
  menus: MenuConfig[];
};

export type ComponentData = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  order: number;
  styles?: Record<string, unknown>;
};

export type ThemeConfig = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  mode: "light" | "dark";
};

export type SiteBrandReferenceImage = {
  id: string;
  url: string;
  label?: string | null;
};

export type SiteBrandSettings = {
  tagline: string;
  description: string;
  audience: string;
  voice: string;
  visual_direction: string;
  fonts: {
    heading: string;
    body: string;
  };
  reference_images: SiteBrandReferenceImage[];
};
