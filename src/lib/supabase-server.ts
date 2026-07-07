import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DEMO_USER, DEMO_TOKEN } from "./demo-mode";

let _adminClient: SupabaseClient | null = null;

function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.includes("placeholder") || !url;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (isDemoMode()) {
    throw new Error("Supabase not configured (demo mode)");
  }
  if (!_adminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    _adminClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return _adminClient;
}

// Backward-compatible export via getter
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return Reflect.get(getSupabaseAdmin() as object, prop);
  },
});

export async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  // Demo mode: return demo user for demo token
  if (token === DEMO_TOKEN || isDemoMode()) {
    return { id: DEMO_USER.id, email: DEMO_USER.email };
  }

  try {
    const client = getSupabaseAdmin();
    const {
      data: { user },
      error,
    } = await client.auth.getUser(token);

    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}
