import { createClient } from '@supabase/supabase-js';

// Live Supabase configuration defaults for seamless repository sharing & running out-of-the-box
const DEFAULT_SUPABASE_URL = 'https://dpkjhgnhagjzuloxjlqo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_dqTh_YtBYhdYyQmDF3gilQ_can4Buw-';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

// Check if user provided placeholder strings or missing env variables
const isPlaceholderUrl = !rawUrl || rawUrl.includes('your-project-id') || rawUrl.includes('demo-kisanmitra');
const isPlaceholderKey = !rawKey || rawKey.includes('your-supabase-anon') || rawKey.includes('demo-anon-key');

export const supabaseUrl = isPlaceholderUrl ? DEFAULT_SUPABASE_URL : rawUrl;
export const supabaseAnonKey = isPlaceholderKey ? DEFAULT_SUPABASE_ANON_KEY : rawKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('demo-kisanmitra') &&
  !supabaseUrl.includes('your-project-id')
);

// Native Supabase client initialized safely
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

