import { NextResponse } from "next/server";
import { providerRegistry } from "@/lib/trading/providers";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    application: "Mamba FX Trading Platform",
    products: {
      forexCfd: { availableInUi: true, demoExecution: true, liveExecution: false },
      fixedTimeOptions: { availableInUi: true, demoRecordsOnly: true, liveExecution: false, approvalRequired: true },
    },
    marketData: { connected: false, source: null, quoteType: "illustrative-ui-samples" },
    providers: providerRegistry,
    safety: {
      liveTradingEnabled: false,
      liveOptionsEnabled: false,
      depositsEnabled: false,
      withdrawalsEnabled: false,
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
