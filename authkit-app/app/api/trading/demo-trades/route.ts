import { NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { databaseConfigured, supabaseRest } from "@/lib/trading/database";

type AccountRow = { id: string };
type TradeRow = {
  id: string;
  product: "FOREX_CFD" | "FIXED_TIME_OPTIONS";
  symbol: string;
  side: "BUY" | "SELL";
  quantity: string | number;
  reference_price: string | number;
  expiry_label: string | null;
  status: "OPEN" | "CLOSED";
  created_at: string;
};

async function currentUser() {
  const { user } = await withAuth({ ensureSignedIn: true });
  return user;
}

async function ensureDemoAccount(userId: string) {
  const rows = await supabaseRest<AccountRow[]>(
    "mfx_trading_accounts?on_conflict=auth_user_id&select=id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ auth_user_id: userId, account_mode: "DEMO" }),
    },
  );
  if (!rows?.[0]?.id) throw new Error("Could not initialize the demo account.");
  return rows[0].id;
}

function serialize(row: TradeRow) {
  return {
    id: row.id,
    product: row.product,
    symbol: row.symbol,
    side: row.side,
    amount: Number(row.quantity),
    entry: Number(row.reference_price),
    expiry: row.expiry_label ?? undefined,
    openedAt: row.created_at,
    status: row.status,
  };
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!databaseConfigured()) {
      return NextResponse.json({ error: "Persistent database is not configured." }, { status: 503 });
    }
    await ensureDemoAccount(user.id);
    const rows = await supabaseRest<TradeRow[]>(
      `mfx_demo_trades?auth_user_id=eq.${encodeURIComponent(user.id)}&select=*&order=created_at.desc`,
    );
    return NextResponse.json({ trades: rows.map(serialize), storage: "persistent-demo" }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load demo activity.";
    return NextResponse.json({ error: message }, { status: message.includes("not configured") ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!databaseConfigured()) {
      return NextResponse.json({ error: "Persistent database is not configured." }, { status: 503 });
    }
    const body = await request.json();
    const product = body.product;
    const side = body.side;
    const symbol = typeof body.symbol === "string" ? body.symbol.trim().toUpperCase() : "";
    const quantity = Number(body.amount);
    const referencePrice = Number(body.entry);
    const expiry = typeof body.expiry === "string" ? body.expiry.slice(0, 40) : null;

    if (!["FOREX_CFD", "FIXED_TIME_OPTIONS"].includes(product) ||
        !["BUY", "SELL"].includes(side) ||
        !/^[A-Z0-9._-]{2,24}$/.test(symbol) ||
        !Number.isFinite(quantity) || quantity <= 0 || quantity > 1000000 ||
        !Number.isFinite(referencePrice) || referencePrice <= 0) {
      return NextResponse.json({ error: "Invalid demo trade details." }, { status: 400 });
    }
    if (product === "FIXED_TIME_OPTIONS" && quantity < 1) {
      return NextResponse.json({ error: "Options demo stake must be at least one virtual unit." }, { status: 400 });
    }

    const accountId = await ensureDemoAccount(user.id);
    const rows = await supabaseRest<TradeRow[]>("mfx_demo_trades?select=*", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        account_id: accountId,
        auth_user_id: user.id,
        product,
        symbol,
        side,
        quantity,
        reference_price: referencePrice,
        expiry_label: product === "FIXED_TIME_OPTIONS" ? expiry : null,
        status: "OPEN",
      }),
    });
    return NextResponse.json({ trade: serialize(rows[0]), storage: "persistent-demo" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save demo activity.";
    return NextResponse.json({ error: message }, { status: message.includes("not configured") ? 503 : 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await currentUser();
    if (!databaseConfigured()) {
      return NextResponse.json({ error: "Persistent database is not configured." }, { status: 503 });
    }
    const body = await request.json();
    if (typeof body.id !== "string" || body.id.length > 64) {
      return NextResponse.json({ error: "A valid demo record ID is required." }, { status: 400 });
    }
    const rows = await supabaseRest<TradeRow[]>(
      `mfx_demo_trades?id=eq.${encodeURIComponent(body.id)}&auth_user_id=eq.${encodeURIComponent(user.id)}&status=eq.OPEN&select=*`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ status: "CLOSED", closed_at: new Date().toISOString() }),
      },
    );
    if (!rows.length) return NextResponse.json({ error: "Open demo record not found." }, { status: 404 });
    return NextResponse.json({ trade: serialize(rows[0]), storage: "persistent-demo" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to close demo record.";
    return NextResponse.json({ error: message }, { status: message.includes("not configured") ? 503 : 500 });
  }
}
