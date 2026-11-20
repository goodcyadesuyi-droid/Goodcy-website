import "server-only";

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function databaseConfigured() {
  return Boolean(supabaseUrl && serviceRoleKey);
}

export async function supabaseRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Persistent trading database is not configured.");
  }
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Trading database request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  if (response.status === 204) return undefined as T;
  const body = await response.text();
  return (body ? JSON.parse(body) : undefined) as T;
}
