import { NextResponse } from "next/server";
import { providerRegistry } from "@/lib/trading/providers";
import { databaseConfigured } from "@/lib/trading/database";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    application: "Mamba FX Trading Platform",
    products: {
      forexCfd: { availableInUi: true, demoExecution: true, liveExecution: false },
      fixedTimeOptions: { availableInUi: true, demoRecordsOnly: true, liveExecution: false, approvalRequired: true },
    },
    database: { configured: databaseConfigured(), purpose: "persistent-demo-accounts-and-trade-history" },
    marketData: { connected: false, source: null, quoteType: "illustrative-ui-samples" },
    providers: providerRegistry,
    deriv: { oauthConfigured: Boolean(process.env.DERIV_CLIENT_ID && process.env.APP_BASE_URL && process.env.MFX_DERIV_TOKEN_ENCRYPTION_KEY), connectionFlow: "OAUTH2_PKCE", requestedScopes: ["trade"], accountMode: "DEMO_ONLY", liveExecution: false, demoWebSocketExecution: false },
    safety: {
      liveTradingEnabled: false,
      liveOptionsEnabled: false,
      depositsEnabled: false,
      withdrawalsEnabled: false,
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
