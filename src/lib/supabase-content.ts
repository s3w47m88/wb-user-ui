import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTENT_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_CONTENT_PUBLISHABLE_KEY!;

export const supabaseContent = createClient(supabaseUrl, supabaseKey);

export type PageConfig = {
  id: string;
  site_id?: string;
  name: string;
  components: ComponentData[];
  theme: ThemeConfig;
  organization_id?: string;
  site_domain?: string | null;
  use_temporary_domain?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ComponentData = {
  id: string;
  type: string;
  props: Record<string, any>;
  order: number;
  styles?: Record<string, any>;
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
  mode: 'light' | 'dark';
};
