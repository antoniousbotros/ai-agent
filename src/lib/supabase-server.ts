import { createClient } from '@supabase/supabase-js';

// The Service Role Key bypasses RLS securely on the server-side.
// WARNING: Never expose this to the client!
export function getServerAuthClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    return createClient(supabaseUrl, supabaseServiceKey);
}
