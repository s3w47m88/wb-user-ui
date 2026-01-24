import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTROL_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_CONTROL_PUBLISHABLE_KEY!;

export const supabaseControl = createClient(supabaseUrl, supabaseKey);
