# Mamba FX — backend phase 1

## Scope committed
- Persistent demo account creation tied to the authenticated AuthKit user ID.
- Persistent demo trade creation, listing and closing through server-side API routes.
- Supabase Postgres REST access using a server-only service-role key.
- Database migration with account/trade tables, indexes and restrictive direct-table grants.
- Live execution remains disabled; this phase does not submit broker orders.

## Setup required
1. Create a Supabase project.
2. Apply `supabase/migrations/0001_trading_demo.sql` in the Supabase SQL editor.
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to local server environment and Vercel project environment variables. Never expose the service role key in browser code or commit it.
4. Deploy the application and test signed-in demo account creation and trade history.
5. Do not enable live flags.

## API
- `GET /api/trading/demo-trades`: create/ensure the user's demo account and return their persistent demo records.
- `POST /api/trading/demo-trades`: persist a demo record after server-side validation.
- `PATCH /api/trading/demo-trades`: close a demo record belonging to the signed-in user.

All endpoints require AuthKit authentication. User identity is taken from the AuthKit session, never from request JSON. Database access uses server-only credentials. The API is not a broker gateway.

## Not yet implemented
- Licensed live market-data feed and WebSocket quote streaming.
- Advanced chart library and real technical indicator calculations.
- Broker account OAuth/API connections or order execution.
- Live balance/equity/margin reconciliation, deposits or withdrawals.
- Fixed-time options quote, contract purchase, expiry and settlement.

## Market data and broker connection gate
Select a vendor only after confirming permitted use, exchange coverage, symbol mapping, redistribution rights, latency, rate limits, sandbox and commercial terms. For broker connections, verify account eligibility, API access, supported regions, product/order semantics and written authorization. Do not collect broker passwords in ChatGPT or store broker master credentials in the browser.

## Safety controls
- Demo and live account ledgers must remain separate.
- Never report an order as filled without provider confirmation.
- Add idempotency, server-side risk checks, stale-price checks, reconciliation, immutable audit events and a global kill switch before any live execution.
- Fixed-time options require jurisdiction-specific legal review and provider authorization before any real-money capability is enabled.
