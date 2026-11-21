# Deriv demo connection setup — Mamba FX Academy

## What has been implemented

- AuthKit-protected Deriv OAuth start and callback routes.
- OAuth Authorization Code flow with PKCE, random state validation and a server-side code exchange.
- Minimal trade scope only, used to read the user's Options accounts and identify a demo account.
- AES-256-GCM encrypted, HttpOnly, user-bound session cookie with expiry.
- A status endpoint that reports demo connection state and explicitly keeps live trading, live options, deposits, withdrawals and auto-trading disabled.
- UI controls to connect/reconnect and disconnect Deriv.

This is an integration scaffold. It is not connected until the environment is configured and a real Deriv demo OAuth round trip succeeds.

## Official Deriv API facts

Deriv's current API documentation describes OAuth 2.0 Authorization Code with PKCE for browser apps. The registered app must have a client ID and exact HTTPS redirect URL. The callback exchanges the code server-side at https://auth.deriv.com/oauth2/token; access tokens have an expires_in value and Deriv does not issue refresh tokens. The API's Options account list is GET https://api.derivws.com/trading/v1/options/accounts and requires the trade scope. The API supports separate public, demo and real WebSocket endpoints; the OTP endpoint returns a short-lived URL scoped to the selected account.

Official docs:
- https://developers.deriv.com/docs/intro/authentication/
- https://developers.deriv.com/docs/intro/oauth/
- https://developers.deriv.com/docs/options/
- https://developers.deriv.com/docs/intro/api-overview/

## Deriv developer setup required

1. Sign in to the Deriv developer dashboard and register an OAuth 2.0 application.
2. Set the callback/redirect URI to exactly: https://YOUR_DOMAIN/api/deriv/oauth/callback
3. Enable the trade scope only for this initial demo account verification.
4. Copy the application ID (client ID). Do not put it in browser code.
5. In the deployment environment, set DERIV_CLIENT_ID, APP_BASE_URL and MFX_DERIV_TOKEN_ENCRYPTION_KEY.
6. Generate an encryption key in a trusted terminal, for example: openssl rand -base64 32
7. Keep LIVE_TRADING_ENABLED=false and LIVE_OPTIONS_ENABLED=false.
8. Redeploy the branch, sign in to Mamba FX, open /terminal, and choose Connect Deriv Demo.
9. Complete the login and consent at Deriv. The callback must return to Mamba FX and the status API must show a verified demo account. If Deriv returns no Options demo account, verify the Deriv account has a demo Options account enabled.

Never paste OAuth tokens, passwords, encryption keys or other secrets into ChatGPT or GitHub. Enter them only in the hosting provider's private environment-variable settings.

## Scope and product boundary

The current Deriv Options API account workflow does not establish support for every Forex/CFD instrument or MT5 account. This adapter is listed only for FIXED_TIME_OPTIONS demo account verification. Market-data subscriptions and demo contract operations require their own tested WebSocket implementation. No buy/sell/contract purchase route has been added here.

No real-money account is selected. No real account WebSocket is opened. No real trade, deposit, withdrawal, or auto-trading operation can be initiated through this integration.

## Before calling the integration verified

- Confirm the Deriv OAuth app registration and callback URI.
- Confirm trade scope is granted to the token.
- Confirm the account-list response identifies a demo Options account.
- Add server-side durable encrypted token storage and revocation lifecycle before production-grade persistent account linking; the current encrypted HttpOnly cookie is a secure initial bridge, not a durable multi-device connection store.
- Add a real sandbox WebSocket handshake, market data and contract monitoring tests before claiming demo execution is integrated.
- Review jurisdiction and provider terms before exposing any product to customers.