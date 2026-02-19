import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables!');
    console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate the anon key format (should be a JWT token)
if (!supabaseAnonKey.startsWith('eyJ')) {
    console.error('Invalid Supabase anon key format!');
    console.error('The key should start with "eyJ" and be a JWT token.');
    console.error('Please check GET_SUPABASE_KEYS.md for instructions on getting the correct key.');
    throw new Error('Invalid Supabase anon key format');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export type Profile = {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
};

export type Audit = {
    id: string;
    user_id: string;
    title: string;
    design_type: 'figma' | 'png' | 'pdf' | 'url';
    design_url: string | null;
    design_image_url: string | null;
    audit_depth: 'Quick' | 'Standard' | 'Deep';
    audit_score: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    is_shared: boolean;
    share_token: string | null;
    created_at: string;
    updated_at: string;
};

export type Issue = {
    id: string;
    audit_id: string;
    title: string;
    category: 'Accessibility' | 'UX' | 'UI' | 'Layout' | 'Content';
    severity: 'High' | 'Medium' | 'Low';
    status: 'open' | 'resolved';
    explanation: string;
    how_to_fix: string;
    suggestion: string;
    position_x: number;
    position_y: number;
    created_at: string;
    updated_at: string;
};
