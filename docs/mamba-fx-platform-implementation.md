# Mamba FX Trading Platform — implementation status

## Confirmed configuration
- Products: Forex/CFD and fixed-time options.
- Broker strategy: multiple authorized providers through independent adapters.
- Deriv OAuth app created by the owner: Mamba FX Academy, app ID 351H6KkG4TTezdP4S5Xvt, Trade scope selected, 0% markup.
- Registered Deriv redirect URI: https://mambafxacademy.com/api/deriv/oauth/callback
- Repository: goodcyadesuyi-droid/Goodcy-website.
- Branch: authkit-vercel-setup. Application root: authkit-app.

## Implemented
- Replaced the previous terminal preview with a multi-asset workspace and removed the old social-video navigation from the member dashboard.
- Added Forex/CFD and fixed-time-options demo UI, instrument categories, search, watchlist controls, chart controls, demo tickets and activity tabs.
- Added Deriv OAuth 2.0 Authorization Code + PKCE start and callback routes. The start route now uses the exact redirect URI registered in Deriv and requests only the Trade scope.
- The callback validates OAuth state, exchanges the one-time code server-side, calls Deriv's authenticated Options account-list endpoint, requires a demo account, and saves a time-limited encrypted token in an HttpOnly, Secure production cookie.
- The Deriv integration is deliberately marked OAUTH_READY_PENDING_CONFIG, not sandbox verified. No real account is selected.
- AuthKit protection remains on the trading terminal. The public homepage and logo asset were not intentionally changed.

## Required deployment configuration
Set these values as private environment variables in the hosting provider; never paste tokens or secrets into chat or commit them:
- DERIV_CLIENT_ID=351H6KkG4TTezdP4S5Xvt
- APP_BASE_URL=https://mambafxacademy.com
- MFX_DERIV_TOKEN_ENCRYPTION_KEY=<base64-encoded 32-byte random key>
- LIVE_TRADING_ENABLED=false
- LIVE_OPTIONS_ENABLED=false

Generate the encryption key with a secure password/key generator (for example, Node: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`). Keep a backup in the hosting provider's secret manager. Rotating the key invalidates existing encrypted Deriv sessions and requires users to reconnect.

## Current limitations and next verification
- OAuth connection has not yet been run against the deployed domain; no successful Deriv consent or sandbox account verification is claimed.
- A user must be signed in to Mamba FX Academy, choose Connect Deriv Demo, sign in to Deriv and consent to the Trade scope.
- The callback verifies account-list access and finds a demo Options account. If Deriv returns no demo account, connection is not marked successful.
- Token storage currently uses an encrypted, HttpOnly session cookie and is time-limited to the Deriv token expiry. This is not a persistent multi-device broker connection store.
- The API's successful account-list response proves the granted Trade scope can access that endpoint; it does not by itself verify trade placement, order settlement, or every product permission.
- The current UI's quotes and candles are illustrative static samples. Demo ticket records are local UI state; they are not yet submitted to Deriv's demo WebSocket.
- No live execution, real-money options, deposits or withdrawals are enabled.
- Exness, IC Markets, Pepperstone and XM remain unconfigured.

## Security and financial integrity
- Never expose broker tokens to browser JavaScript or log authorization codes/tokens.
- Keep secrets only in the hosting provider's server-side environment.
- Bind each broker session to the authenticated Mamba FX user.
- Verify account_type is demo before any demo action; never infer demo status from a balance.
- Keep live trading and live options disabled with server-side feature flags.
- Implement idempotency, pre-trade risk checks, audit logs, quote freshness checks and reconciliation before enabling any execution workflow.
- Do not advertise a provider as supported until sandbox tests pass and written production approval exists.

## Deriv API workflow
Deriv's current OAuth documentation specifies Authorization Code + PKCE, state validation, backend token exchange at https://auth.deriv.com/oauth2/token and bearer-token API calls. The Trade scope is used for GET /trading/v1/options/accounts. Deriv's Options API uses a short-lived OTP to establish a demo WebSocket session; this remains a separate next step and has not been enabled here.

## Further milestones
1. Configure the three server environment values above and deploy the branch.
2. Run OAuth using a signed-in test user and verify Deriv returns a demo Options account.
3. Add a server-only demo WebSocket adapter using the OTP endpoint and verify demo balance/quotes without enabling live endpoints.
4. Persist demo orders, executions, positions and audit events in a database.
5. Integrate licensed market data and provider conformance tests.
6. Complete jurisdiction-specific legal/compliance review before considering any real-money fixed-time options or live trading.
7. Keep live execution, deposits and withdrawals disabled until all provider, legal, security and operational gates are approved.
