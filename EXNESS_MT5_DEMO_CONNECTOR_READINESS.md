# Mamba FX Academy — Exness MT5 Demo Integration Readiness

**Requested mode:** Exness MT5 demo account.

**Current status:** Preparation and official onboarding link added. No Exness account is connected, no credentials were collected, no private connector/backend is deployed, and live trading is disabled.

## Official demo account setup

1. Open the official Exness demo-account page: https://www.exness.com/demo-trading-account/
2. Sign in to an existing Exness Personal Area or register directly with Exness.
3. In the Personal Area, create a new trading account and choose **Demo** and **MT5** as the platform. Choose an account type/currency/leverage available to the account owner. Exness documents a Standard MT5 demo account with a virtual balance as an available starting route.
4. Retrieve the exact MT5 server name and demo login details from the Exness Personal Area. Keep the trading password private; do not send it to ChatGPT, paste it into the Mamba website, or commit it to GitHub.
5. Confirm the account can sign in to the official MetaTrader 5 terminal. The account must explicitly be MT5; Exness platform accounts are not MT5-compatible, and an account's platform cannot be changed after creation.

## Integration route and API limitation

The Exness Trader API is not the default bridge for this account: Exness' current API help page says standard MetaTrader accounts cannot connect to that API. The intended route for an MT5 account is a private MT5 terminal connector on a managed Windows host, but only after Exness confirms in writing that this third-party integration is permitted for the account, region and intended Mamba business model. The MT5 Python package communicates with a local installed/running MT5 terminal; do not expose that terminal directly to the public internet.

Exness provides an MT WebTerminal developed by MetaQuotes and hosted on Exness' website. This can be used as an official broker-hosted trading terminal, but it is not a Mamba backend connection or an embedded/licensed MT5 terminal inside the Mamba app.

## Backend architecture to implement

- Private authenticated backend, separate from GitHub Pages.
- Managed Windows host running the official MT5 terminal and a narrowly scoped connector.
- Per-user account ownership checks and MFA.
- Server-side encrypted secrets; no secrets in browser code, GitHub, URLs, logs or ChatGPT.
- Read-only endpoints first: verified account identity, server, symbols, bid/ask, positions, pending orders, history, balance, equity and margin.
- Authenticated realtime updates, freshness timestamps, reconnect/reconciliation logic, rate limits, audit logs, monitoring, backups and emergency shutdown.
- Demo-only mode enforced server-side, not by a browser toggle.

## Verification checklist

- [ ] Account owner created an Exness **MT5 Demo** account.
- [ ] Exact server/platform/account type confirmed in Exness Personal Area.
- [ ] Successful login verified in official MT5 terminal.
- [ ] Exness gave written approval for Mamba's intended connector and customer-facing use.
- [ ] Legal/regulatory review completed for the Mamba business model and target jurisdictions.
- [ ] Private backend and managed Windows host deployed and security-reviewed.
- [ ] Read-only demo data reconciles with the official MT5 terminal.
- [ ] Disconnects, stale quotes, symbol mapping, rejected requests and duplicate requests tested.
- [ ] Live execution remains disabled. This demo project must not submit live orders.

## Current Mamba frontend behaviour

The terminal now links to the official Exness demo onboarding page. The broker selector is a selection only. The Connect button truthfully reports that the connector is not deployed. The on-page virtual balance and local practice orders are not Exness data and are not transmitted to MT5. No live order route is implemented or enabled.

## Official references

- Exness demo account: https://www.exness.com/demo-trading-account/
- Exness API eligibility: https://get.exness.help/hc/en-us/articles/27866287512476-Exness-API
- Exness supported platforms and MT WebTerminal: https://get.exness.help/hc/en-us/articles/360008194992-Available-trading-platforms
- Account platform cannot be changed after creation: https://get.exness.help/hc/en-us/articles/11087694467484-Can-I-change-the-platform-used-with-my-trading-account
- MetaQuotes MT5 Python integration: https://www.mql5.com/en/docs/python_metatrader5
