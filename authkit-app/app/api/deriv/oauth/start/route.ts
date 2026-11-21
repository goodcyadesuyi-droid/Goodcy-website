import { NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
const REDIRECT_URI = "https://mambafxacademy.com/api/deriv/oauth/callback";
function b64url(value: Buffer) { return value.toString("base64url"); }

export async function GET() {
  await withAuth({ ensureSignedIn: true });
  const clientId = process.env.DERIV_CLIENT_ID;
  if (!clientId) return NextResponse.json({ error: "Deriv OAuth is not configured. Add DERIV_CLIENT_ID in the hosting environment." }, { status: 503 });
  const verifier = b64url(randomBytes(48));
  const state = b64url(randomBytes(32));
  const challenge = b64url(createHash("sha256").update(verifier).digest());
  const jar = await cookies();
  jar.set("mfx_deriv_oauth", JSON.stringify({ verifier, state, redirectUri: REDIRECT_URI }), {
    httpOnly: true, secure: true, sameSite: "lax", path: "/api/deriv/oauth", maxAge: 600,
  });
  const url = new URL("https://auth.deriv.com/oauth2/auth");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("scope", "trade");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  return NextResponse.redirect(url);
}
