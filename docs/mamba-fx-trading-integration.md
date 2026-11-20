# Mamba FX Trading Terminal — broker integration plan

## Current implementation

- `/terminal` is an authenticated, responsive trading-terminal interface.
- It includes an illustrative candlestick chart, instrument watchlist, timeframe controls, indicator controls, order ticket, and positions panel.
- Buy/Sell actions create local demo-only positions in browser state. They do not contact a broker.
- Live mode is locked. No real order, account balance, quote, stop-loss, take-profit, or payment data is connected.
- The existing public landing page, logo assets, AuthKit flow, and admin route are not intentionally changed.

## Exness compatibility finding

Exness's current official API documentation says the API supports eligible Exness-platform trading accounts and explicitly says standard MetaTrader accounts cannot connect to that API. Therefore, the Exness REST/WebSocket API must not be presented as an MT5-account bridge.

For the requested Exness MT5 account support, the project needs a separate integration route confirmed in writing with Exness/MetaQuotes or an authorized MT5 technology provider. Confirm account-type compatibility, server-side order execution permissions, market-data rights, regional restrictions, commercial terms, and production approval before implementation.

Official references:
- https://get.exness.help/hc/en-us/articles/27866287512476-Exness-API
- https://get.exness.help/hc/en-us/articles/360008194992-Available-trading-platforms
- https://get.exness.help/hc/en-us/articles/18022583206940-Exness-platform-based-trading-accounts

## Required production architecture

1. Browser/mobile client calls Mamba FX backend endpoints only; never connect a browser directly to a broker using a master credential.
2. Backend broker adapter implements the approved Exness/MT5 connection method.
3. Store secrets in a server-side secret manager. Never commit API keys, MT5 passwords, investor passwords, or broker tokens.
4. Separate demo and live accounts and credentials. Demo is the only enabled execution mode until security, regulatory, and broker approvals are complete.
5. Validate user authorization, instrument availability, volume/lot steps, margin, market session, stop-distance rules, idempotency, and risk limits server-side before submitting an order.
6. Persist broker order IDs, execution results, positions, and audit events. Reconcile the database against broker state.
7. Add explicit user confirmation for orders, per-account loss/exposure limits, rate limiting, audit logging, and a kill switch.
8. Never claim an order succeeded until the broker confirms execution.

## Environment configuration (names only; values belong in the deployment secret manager)

- `TRADING_PROVIDER=exness`
- `EXNESS_API_BASE_URL` — only if the approved Exness API is used for a compatible Exness-platform account
- `EXNESS_API_KEY` and `EXNESS_API_SECRET` — only if issued to the project by Exness
- `MT5_GATEWAY_URL` — only after an authorized MT5 gateway is selected
- `MT5_GATEWAY_CLIENT_ID` and `MT5_GATEWAY_CLIENT_SECRET` — only if issued by that provider

Do not add placeholder credentials to source control. Keep live execution disabled until the broker confirms the intended account and integration path.
