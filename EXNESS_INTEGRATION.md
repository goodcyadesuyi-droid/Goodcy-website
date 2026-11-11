# Mamba FX Academy — Multi-Broker and AGI OS Integration Plan

## Product decision

Mamba FX Academy will list all five requested brokers:

1. Exness
2. Deriv
3. IC Markets
4. Pepperstone
5. XM

The custom trading interface is branded **Mamba FX AGI-Powered Intelligent Operating System (AGI OS)**. AGI OS is the intended AI trading assistant and orchestration layer; it is not represented as human-level or proven Artificial General Intelligence. The current website contains only an educational assistant preview.

## Current implementation status

- `trade.html` now offers a five-broker selector and remembers the selected broker in the browser.
- The selector is a preference only. Every broker currently shows **Selected · not connected**.
- The trading terminal remains demo-only. Local practice orders are not transmitted to any broker.
- The AGI OS assistant is a local educational preview, not a connected AI model, account monitor, signal service, or order manager.
- Live trading remains disabled. No broker account has been linked, and no production backend has been deployed or tested.
- GitHub Pages hosts static files only; it cannot securely host broker secrets or run the required private trading service.

## Broker integration assessment

A broker selector is not the same as an authorised trading connection. Implement a separate adapter for each broker and activate it only after the broker's exact account type, region, platform and API permissions are verified.

### Exness

Exness publishes a Trader API with REST and WebSocket capabilities for account data, market data and trading. Its Help Center states that standard MetaTrader accounts cannot connect to that API; confirm account eligibility in the Exness Personal Area before implementation. For a standard MT5 account, investigate a broker-authorised MT5 terminal bridge instead of assuming the Exness Trader API can access it.

References:
- https://get.exness.help/hc/en-us/articles/27866287512476-Exness-API
- https://www.exness-api.com/

### Deriv

Deriv publishes REST and WebSocket APIs for account access, market data and trading operations. Implement only the product/account endpoints appropriate to the user's Deriv account; Deriv options contracts and Deriv MT5 accounts are not interchangeable integration targets.

References:
- https://developers.deriv.me/docs/
- https://developers.deriv.com/docs/intro/api-overview/

### IC Markets

IC Markets' Help Centre says it does not offer FIX API connectivity into MT4/MT5 accounts, while cTrader accounts may use the cTrader/FIX route described by the broker. For MT5 accounts, obtain written broker confirmation of any supported integration or use a properly authorised MT5 terminal bridge.

Reference:
- https://www.icmarkets-global.com/en/help-resources/help-centre

### Pepperstone

Pepperstone publishes API trading and cTrader integration information, but access and eligibility must be confirmed directly with Pepperstone for the specific account and region. The broker also supports MT4/MT5 accounts; do not assume an API product intended for one platform automatically controls another platform's account.

References:
- https://pepperstone.com/en/platforms/integrations
- https://pepperstone.com/en/platforms/tools
- https://pepperstone.com/en/support/platforms-and-tools

### XM

XM offers MT5 and supports Expert Advisors on its MetaTrader platform. The public information reviewed for this project does not establish a general retail trading API for connecting arbitrary third-party apps to XM MT5 accounts. Ask XM in writing whether it authorises an external custom frontend/bridge for the specific account. Do not use partner reporting APIs as trading APIs.

References:
- https://www.xm.com/mt5
- https://partners.xm.com/help-center/tools-and-technology

## Recommended technical architecture

1. **Mamba frontend/PWA:** custom charts, account cards, broker selector, order ticket, positions, pending orders, history and AGI OS chat.
2. **Broker adapter layer:** independent adapters for Exness, Deriv, IC Markets, Pepperstone and XM. Each adapter must declare supported platform/account types and capabilities; do not pretend every broker supports the same endpoints.
3. **Private backend:** HTTPS API, authenticated sessions, per-user account isolation, broker connectivity and server-side order validation.
4. **Realtime gateway:** authenticated WebSocket updates for prices, orders, positions, balance and equity, with reconnect and reconciliation logic.
5. **Database and audit:** encrypted account-link metadata, user consent, permissions, order intents, idempotency keys, broker acknowledgements, final execution states and audit logs.
6. **Secrets:** store API credentials only in protected server-side secret storage. Never place them in browser JavaScript, mobile bundles, GitHub, screenshots or chat.
7. **AGI OS service:** model-backed assistant connected to approved market and account context through backend tools. Default to read-only analysis. Do not claim AGI capability, guaranteed accuracy, guaranteed profit or risk-free trading.

## AGI OS capabilities to implement

- Explain market structure, indicators, order types, margin and risk.
- Summarise only verified broker account and market data, showing source and timestamp.
- Monitor open positions, pending orders, margin and configured risk limits.
- Generate scenario analysis and educational trade plans with uncertainty and downside.
- Require user confirmation for every trade by default.
- If automated execution is ever enabled, require separate opt-in, broker permissions, explicit strategy/risk settings, position and daily-loss limits, kill switch, and complete audit trail.
- Never bypass broker restrictions, user consent, account permissions or risk controls.

## Production release gates

- Confirm legal/regulatory permissions for the business model and target users, including Nigeria and the broker's relevant jurisdiction.
- Confirm the broker allows the specific integration method for each account.
- Deploy a private backend on suitable hosting. For MT5-terminal integrations, use a managed Windows VPS with the terminal installed and securely controlled; do not expose the terminal or credentials publicly.
- Begin with demo accounts and read-only account verification.
- Test reconnects, stale data, partial fills, rejected orders, duplicate requests, symbol differences, trading sessions, margin, SL/TP and emergency shutdown.
- Complete independent security review and end-to-end demo testing.
- Keep live trading disabled until the account owner explicitly opts in and every release gate passes.

## Security and risk controls

- MFA, secure session cookies, CSRF protection, rate limiting and strict CORS/origin allowlist.
- Per-user account ownership checks; no cross-user data access.
- Least-privilege broker credentials, secret rotation and revocation.
- Idempotency keys for order mutations and reconciliation against broker-confirmed state.
- Max order volume, max exposure, max daily loss, margin-use thresholds and kill switch.
- Demo/live mode shown clearly and tied to verified account identity, never just a UI toggle.
- Clear leveraged-trading risk disclosures. No profit guarantees or deterministic win/loss claims.

## Account-owner setup

Do not send passwords, OTPs, API secrets or private keys in ChatGPT. The account owner should connect accounts only through the eventual secure Mamba backend flow after the broker-specific method has been approved. Start with one demo account and read-only access before adding any trading permission.
