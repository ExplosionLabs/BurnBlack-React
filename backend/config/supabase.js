const { createClient } = require('@supabase/supabase-js');

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl) {
  console.warn('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.warn('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client factory
const createSupabaseClient = (useServiceRole = true) => {
  const key = useServiceRole && supabaseServiceKey ? supabaseServiceKey : supabaseAnonKey;
  
  if (!supabaseUrl || !key) {
    // Return a mock client for development if credentials are missing
    return {
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
        eq: () => ({ data: [], error: null }),
        single: () => ({ data: {}, error: null }),
        order: () => ({ data: [], error: null })
      }),
      rpc: () => ({ data: null, error: null })
    };
  }

  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: useServiceRole ? false : true,
      persistSession: useServiceRole ? false : true
    },
    db: {
      schema: 'public'
    }
  });
};

// Public client for client-side operations (with RLS)
const supabase = createSupabaseClient(false);

// Admin client for server-side operations (bypasses RLS)
const supabaseAdmin = createSupabaseClient(true);

module.exports = {
  createSupabaseClient,
  supabase,
  supabaseAdmin
};