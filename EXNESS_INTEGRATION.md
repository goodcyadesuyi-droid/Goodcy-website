# Mamba FX Academy — Exness integration plan

## Current status

- Proposed broker: **Exness**.
- Website hosting: GitHub Pages (static hosting).
- Trading terminal: `trade.html` is currently a DEMO-only frontend.
- Live trading: **DISABLED**. No Exness API credentials, account connection, backend service, or live execution has been configured or tested.
- Do not represent local demo orders or TradingView chart data as Exness account data or executed trades.

## Important account compatibility decision

Exness publishes a Trader API for eligible Exness trading accounts. Exness Help Center currently states that standard MetaTrader accounts cannot connect to this API. Therefore, the first implementation route should be the official Exness Trader API only if the account selected in Exness Personal Area is eligible and the API key can be issued for it.

If the user specifically requires an existing standard MT5 account, do not assume the Exness Trader API will access it. Obtain written confirmation from Exness about an authorised bridge or use a separately secured MT5-terminal integration on a managed Windows VPS, subject to broker terms and operational review.

Official references:
- Exness API overview: https://www.exness-api.com/
- Exness API account eligibility: https://get.exness.help/hc/en-us/articles/27866287512476-Exness-API
- API key and host setup: https://www.exness-api.com/authentication/api-key-and-host-setup
- Request signing: https://www.exness-api.com/authentication/request-signing
- Trading API onboarding: https://www.exness-api.com/trading/get-started
- Access point discovery: https://www.exness-api.com/trading/get-started/access-point-host-discovery
- First read-only request: https://www.exness-api.com/trading/get-started/send-first-request
- Trade execution flow: https://www.exness-api.com/trading/get-started/place-first-trade
- WebSocket events: https://www.exness-api.com/trading/get-started/subscribe-to-websocket-events

## Required production architecture

GitHub Pages cannot run a private server process. Keep it as the static web frontend only. Deploy a separate HTTPS backend to a managed server platform with secret storage, logs, monitoring, database and WebSocket support.

Suggested components:

1. **Frontend** — Mamba FX Academy web/PWA, authenticated session only; never receives Exness signing secrets.
2. **Backend API** — validates user sessions and permissions, signs Exness requests, enforces trading limits and proxies approved account data.
3. **Secret storage** — managed encrypted secrets; Exness private signing key must never be committed to Git, put in browser code, mobile app bundles, screenshots, or chat.
4. **Database** — users, broker-account ownership links, consent, permissions, idempotency keys, order requests, execution events and audit logs.
5. **Realtime gateway** — authenticated WebSocket fan-out from backend to each authorised user's browser/app.
6. **AI assistant** — read-only market/account context by default. It must not submit orders unless the account owner separately enables a clearly disclosed automation permission and explicit risk limits.

## Exness API connection sequence

1. Account owner completes Exness identity/address verification and confirms API eligibility in their Personal Area.
2. In Exness Key Management, create a dedicated API key scoped to the intended trading account and only the required permissions.
3. Store API key identifier, private signing key, account ID, DNS Gateway host and resolved account Access Point as server-side secrets/configuration. Never send the private key to Mamba chat or commit it here.
4. Implement Exness Ed25519 request signing exactly as documented, including fresh millisecond timestamps, signed path/query/body hash, and idempotency key headers.
5. Resolve the account Access Point using the Gateway host from Exness Key Management; cache the returned Access Point as documented. Do not hardcode sample hostnames.
6. Start with a signed **read-only** account-details request. Confirm account ID, currency, leverage and permissions before requesting any trade capability.
7. Subscribe to the documented WebSocket ticks and account/transaction event streams. Reconnect with backoff and reconcile snapshots after reconnects.
8. Implement order submission only after read-only validation. Exness trading requests are asynchronous: an ACK is not proof of execution. Store the operation ID and update UI state only after the final transaction event/status confirms success.
9. Validate instrument availability, market session, min/max/step volume, margin, price levels, SL/TP, account trading state and rate limits before every order.
10. Test all workflows on an eligible demo/practice account first. Keep live trading disabled until end-to-end tests, independent security review, legal/regulatory review and explicit account-owner consent are complete.

## Minimum safety controls before live trading

- Per-user account ownership checks; no cross-user account data access.
- Server-side secrets and key rotation/revocation procedure.
- Least-privilege API scopes and IP allowlisting where available.
- MFA for sign-in and step-up confirmation for sensitive actions.
- CSRF protection, secure cookies, rate limiting and request validation.
- Unique idempotency key for every order mutation; prevent duplicate submissions.
- Explicit demo/live mode banner and account identity confirmation on every session.
- Max volume, max exposure, daily loss and margin-use limits; kill switch.
- Audit trail for user consent, order request, broker ACK, final execution result and errors.
- AI cannot promise returns, invent signals, or bypass user permissions and risk limits.
- Clear risk disclosures and review of applicable Nigerian and broker jurisdiction rules.

## What is still needed from the account owner

Do not send passwords, OTPs, API private keys, or account secrets in chat. The account owner must confirm privately in Exness:

- Whether the selected account is an Exness API-eligible account or a standard MT5 account.
- Whether Key Management exposes the Trading API product and permits a scoped key for that account.
- Whether the account owner wants read-only account linking first, before any order permissions.

After that, the developer can configure the backend secrets directly in the hosting provider's protected environment settings and run the read-only connection test.

## Release gate

The live toggle must remain disabled until the backend is deployed, Exness access is confirmed, read-only account verification passes, demo order lifecycle tests pass, security checks pass, and the owner explicitly enables live permissions. A GitHub commit or a visible button is not evidence of a live broker connection.
