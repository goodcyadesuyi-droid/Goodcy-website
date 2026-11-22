import { NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { readDerivSession } from "@/lib/deriv/session";

export const dynamic = "force-dynamic";

/**
 * Creates a short-lived Deriv Options demo WebSocket URL.
 * The Deriv bearer token never leaves this server route.
 * The returned URL contains a one-time OTP by design and must be used immediately.
 */
export async function POST() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const session = await readDerivSession(user.id);
  if (!session) {
    return NextResponse.json(
      { error: "Connect a Deriv demo account before opening the trading stream." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const response = await fetch(
      `https://api.derivws.com/trading/v1/options/accounts/${encodeURIComponent(session.accountId)}/otp`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        cache: "no-store",
      },
    );
    const payload = await response.json() as {
      data?: { url?: string };
      errors?: Array<{ message?: string; code?: string }>;
    };
    if (!response.ok) {
      return NextResponse.json(
        { error: payload.errors?.[0]?.message || "Deriv could not issue a demo WebSocket OTP.", code: payload.errors?.[0]?.code || "DERIV_OTP_FAILED" },
        { status: response.status === 401 ? 401 : 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const websocketUrl = payload.data?.url;
    if (!websocketUrl) {
      return NextResponse.json({ error: "Deriv response did not include a WebSocket URL." }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }
    const parsed = new URL(websocketUrl);
    if (
      parsed.protocol !== "wss:" ||
      parsed.hostname !== "api.derivws.com" ||
      parsed.pathname !== "/trading/v1/options/ws/demo" ||
      !parsed.searchParams.has("otp")
    ) {
      return NextResponse.json({ error: "Deriv returned an unexpected WebSocket URL; connection was blocked." }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json(
      { websocketUrl, accountMode: "DEMO", otpExpiresInSeconds: 120, singleUse: true },
      { headers: { "Cache-Control": "no-store", "Pragma": "no-cache" } },
    );
  } catch {
    return NextResponse.json({ error: "Unable to create the Deriv demo WebSocket connection. Try reconnecting." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
