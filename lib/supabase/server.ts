import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Create a Supabase client for use in Server Components
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase client with service role key (bypasses RLS)
 * Use this for admin operations or dev mode
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Get appropriate Supabase client based on environment
 * In dev mode with no auth, uses service role to bypass RLS
 */
export async function getSupabaseClient() {
  const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  
  if (isDev) {
    // Try to get user first
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();
    
    // If no user in dev mode, use service role to bypass RLS
    if (!user) {
      return createServiceClient();
    }
  }
  
  return createClient();
}

