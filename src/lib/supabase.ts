import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.includes("placeholder") || !url;
}

export function getSupabase(): SupabaseClient {
  if (isDemoMode()) {
    throw new Error("Supabase not configured (demo mode)");
  }
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
    _client = createClient(url, key);
  }
  return _client;
}

// Demo auth mock that mimics Supabase auth interface
const demoAuth = {
  getSession: async () => ({
    data: {
      session: {
        user: { id: "demo-user-00000000", email: "demo@vid2blog.app", user_metadata: { name: "Demo User" } },
        access_token: "demo-access-token",
      },
    },
    error: null,
  }),
  getUser: async () => ({
    data: { user: { id: "demo-user-00000000", email: "demo@vid2blog.app" } },
    error: null,
  }),
  signInWithPassword: async () => ({ data: {}, error: null }),
  signUp: async () => ({ data: {}, error: null }),
  signInWithOAuth: async () => ({ data: { url: "/dashboard" }, error: null }),
  signOut: async () => ({ error: null }),
  updateUser: async (attrs: { data?: Record<string, unknown> }) => ({
    data: { user: { id: "demo-user-00000000", email: "demo@vid2blog.app", user_metadata: attrs.data } },
    error: null,
  }),
  onAuthStateChange: () => ({
    data: { subscription: { unsubscribe: () => {} } },
  }),
};

// Demo storage mock
const demoFrom = () => ({
  select: () => demoFrom(),
  eq: () => demoFrom(),
  order: () => demoFrom(),
  single: async () => ({ data: null, error: null }),
  insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
  delete: () => ({ eq: async () => ({ error: null }) }),
});

const demoStorage = {
  from: () => demoFrom(),
};

// Export either real or demo client
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (isDemoMode()) {
      if (prop === "auth") return demoAuth;
      if (prop === "from") return demoStorage.from;
      return undefined;
    }
    return Reflect.get(getSupabase() as object, prop);
  },
});

export { isDemoMode };
