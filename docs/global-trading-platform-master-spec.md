# Mamba FX Academy — Global Trading Platform Master Specification

Repository: goodcyadesuyi-droid/Goodcy-website
Working branch: authkit-vercel-setup
Application root: authkit-app
Trading route: /terminal

## 1. Product objective

Build an original global-ready multi-asset trading application under the Mamba FX Academy brand. Functional categories may be comparable to established trading platforms, but all code, UX, visual design, copy and assets must be original. Do not copy IQ Option or any other provider's proprietary source, branding, protected UI or trade logic.

Preserve the existing public homepage, original logo asset, domain configuration and AuthKit authentication. Trading features belong inside the authenticated application. Do not reintroduce TikTok, short-video, creator, social-feed or unrelated community features into this trading product.

## 2. Global availability and jurisdiction

Global website access is not the same as global permission to offer every financial product. The platform must:
- Determine country/region through a legally appropriate, disclosed onboarding process; do not rely solely on IP geolocation.
- Maintain a jurisdiction/product/provider rules registry with effective dates, evidence, review owner and status.
- Gate instruments, leverage, CFDs, derivatives, fixed-time/binary options, deposits and withdrawals by jurisdiction, customer classification and provider permissions.
- Support blocked, review-required, demo-only and enabled states. Unknown or conflicting cases default to restricted.
- Require qualified legal/compliance review before launching in each market. A product roadmap selection is not regulatory approval.
- Provide localized risk disclosures, terms, privacy notices, complaints routes and required regulatory information.
- Support age, identity, sanctions, PEP and AML checks where legally required, with privacy and retention controls.
- Keep a dated record of the rule and decision that allowed or denied each product for each account.

Initial policy: practice/demo trading can be made available for testing subject to platform rules. Real-money trading and real-money fixed-time options remain disabled until the relevant jurisdiction, entity, provider, product and operational approvals are independently verified.

## 3. Application architecture

Use a modular monolith initially, with clear service boundaries:
- Web client: existing Next.js/React application, responsive mobile-first interface and PWA.
- Identity: AuthKit session verification on every protected server route; stable internal user ID mapping; optional MFA and session revocation.
- API layer: validated, versioned server endpoints; authorization and rate limits.
- Domain services: identity/profile, eligibility, instruments, quotes, charts, orders, options demo, portfolio, ledger, payments, notifications, admin and audit.
- Persistence: PostgreSQL as source of truth; migrations checked into version control.
- Cache/streaming: Redis or managed equivalent for ephemeral quote cache, rate limits and pub/sub; never treat cache as the financial ledger.
- Market-data adapters: provider-specific ingestion, normalization, entitlements, timestamps and stale-data detection.
- Broker adapters: provider-specific account, quote and order capabilities behind a common internal interface.
- Background jobs: reconciliation, settlement simulation, provider health, retention and notifications.
- Observability: structured logs, metrics, traces, error reporting, uptime checks and security alerts.

Use a documented API contract (OpenAPI) and typed domain models. Validate all input server-side. Use decimal-safe arithmetic (integer minor units or a decimal library), never binary floating-point for money, quantity, price calculations or settlement.

## 4. Core database model

Create normalized PostgreSQL tables with UUID keys, UTC timestamps, explicit statuses, indexes, foreign keys and user scoping:
- users, user_profiles, auth_identities, sessions, user_preferences
- jurisdictions, jurisdiction_rules, product_permissions, eligibility_checks, compliance_cases
- instruments, instrument_classes, trading_sessions, market_data_sources, provider_entitlements
- quote_ticks with partition/retention policy, candles, candle_aggregates, price_alerts, watchlists, watchlist_items
- trading_accounts, account_provider_links, account_balances, balance_snapshots
- orders, order_events, executions, positions, position_events, pending_orders
- demo_options_contracts, demo_options_quotes, demo_options_outcomes (simulation only)
- ledger_accounts, ledger_journals, ledger_entries, fees, adjustments
- deposits, withdrawals, payment_provider_events (only after payment-provider approval)
- provider_connections, provider_health, provider_sync_cursors
- risk_limits, risk_events, trading_halts
- notifications, support_cases, admin_roles, admin_permissions, audit_events
- idempotency_keys, webhook_events, outbox_events, feature_flags

Financial records must be append-only or corrected through reversing entries. Use database transactions, unique constraints and idempotency keys to prevent duplicate orders, executions, webhooks or ledger postings. Never accept a browser-supplied balance or execution result as authoritative.

## 5. Market-data system

Build independent market-data adapters. Each adapter must document legal data entitlement and redistribution rights; supported regions, account types, instruments, exchanges and sessions; quote/candle granularity, timestamp semantics, corrections and historical depth; stream protocol, REST limits, reconnect rules and outage behaviour; and whether data is real-time, delayed, indicative or demo-generated.

Normalize instruments, bid/ask, last price, spread, precision, volume, provider timestamp and receive timestamp. Preserve source provenance. Detect stale, crossed, malformed and out-of-order quotes. Display delayed/stale/demo labels. Never fabricate live prices or silently substitute a different feed. Implement health checks, reconnect/backoff, circuit breakers, sequence-gap detection and historical backfill. Failover is allowed only when data entitlements and instrument mapping match.

## 6. Advanced charting

Provide candlestick, OHLC/bar, line and area views; provider-supported timeframes and permitted aggregation; crosshair, zoom, pan, autoscale and responsive axes; trendline, horizontal/vertical line, ray, channel, rectangle and text drawing tools; SMA, EMA, RSI, MACD, Bollinger Bands, ATR, stochastic and volume indicators where data supports them; configurable parameters and saved templates; watchlist-to-chart selection; price alerts; historical loading, gap handling, timezone display and data-source labels. Avoid look-ahead bias in calculations and backtests. Indicators are informational tools, not guarantees.

## 7. Trading products

### Forex and CFDs
Support only order types and fields actually exposed by the connected provider: market, limit and stop orders; stop-loss, take-profit and trailing stop only where provider semantics support them. Include instrument precision, minimum size, contract size, margin, leverage, trading hours, financing, spread and fees. Implement pre-trade validation, estimated margin, risk disclosure and confirmation. Track order states including created, accepted, rejected, partially filled, filled, cancel requested, cancelled, expired and failed. Reconcile provider execution IDs, positions, fees, swaps and account equity. Never promise universal leverage, execution or instrument availability.

### Fixed-time options
Implement a clearly labeled practice/simulation product first. A demo contract needs quoted entry price, direction, stake, expiry, payout terms, quote timestamp, settlement source and deterministic settlement record. Define equal-price, missing/stale data, market closure, provider outage and dispute behaviour. Prevent expiry manipulation and replay. Do not represent simulation as a provider-issued contract. Real-money fixed-time/binary options require separate product-specific legal review, approved provider capability, jurisdiction gating and operational sign-off.

## 8. Accounts, portfolio and ledger

Provide separate practice and live account namespaces. Never commingle demo and real-money balances or records. Portfolio views show balance, equity, used/free margin, margin level, open positions, pending orders, exposure by instrument/class/currency, realized and unrealized P&L, fees and history.

The ledger is authoritative for platform-side financial accounting. Provider balances and executions must be reconciled; discrepancies create cases and alerts, not silent edits. For external broker accounts, show provider-sourced values with source and last-sync time. A broker connection must not imply that Mamba FX holds client funds.

## 9. Broker/provider integration framework

Create one adapter per provider, each with a capability manifest: authentication type and scopes; sandbox availability and account eligibility; supported regions, products, symbols, order types, streaming and historical data; rate limits, idempotency, webhooks, reconciliation and error mapping; API/data licence terms; certification evidence and last verification date.

Potential providers previously requested: Exness, Deriv, IC Markets, Pepperstone and XM. These are candidates, not confirmed integrations. Do not claim an API exists or is available for a given account until current official documentation and provider approval confirm it. Check Exness/platform compatibility per account and gateway. Never request broker passwords in chat or store credentials in client code. Prefer provider OAuth or scoped tokens. Secrets belong in a deployment secret manager and must never be committed.

Integrate one provider at a time in sandbox/demo mode. Live execution requires verified provider permission, jurisdiction, security, test coverage, reconciliation and operational approval.

## 10. Risk and execution controls

Before any live order, validate identity, account state, jurisdiction/product permission, instrument status and provider capability. Apply per-order, per-instrument, per-account and aggregate exposure limits. Validate available margin, market hours, quote freshness, price bands and precision. Enforce idempotency and replay protection. Use server-side order state machines and authenticated provider webhooks. Reconcile orders, fills, positions and balances continuously. Provide user disable controls and a global kill switch. Maintain immutable audit trails and incident procedures. Test partial fills, duplicate requests, timeouts, disconnects, outages, gaps and recovery.

No live trading, deposit, withdrawal or cash settlement should be enabled by a UI toggle alone.

## 11. Security and privacy

Apply least privilege, secure cookies, CSRF protection where applicable, strict CORS, CSP, input validation, output encoding, rate limits, bot protection and dependency scanning. Encrypt data in transit and at rest. Keep secrets in a managed secret store. Use MFA for privileged roles, role-based access control, admin approvals and audit logs. Protect personal information with minimization, retention schedules, access controls and deletion/export workflows consistent with applicable law. Perform threat modelling, penetration testing and incident-response exercises before launch.

Never log passwords, API secrets, full payment credentials or unnecessary personal data. Never expose provider credentials to the browser.

## 12. Admin and operations

Build role-separated consoles for user/account support and compliance case review; instrument/provider configuration and market-data health; feature flags and jurisdiction/product eligibility; risk limits, trading halts and emergency controls; reconciliation exceptions, failed webhooks and background jobs; audit search and incident management. Require MFA and explicit permissions for high-impact changes. Log every admin action. Admins must not silently alter ledger history.

## 13. UX and accessibility

Retain Mamba FX brand assets and public homepage. Use a distinct original trading workspace at the existing authenticated route. Include overview, markets/watchlist, chart, trade ticket, positions/orders, portfolio, history, account settings, help/support and disclosures. Clearly separate practice/live accounts. Support small Android phones, tablets and desktop; keyboard navigation, screen-reader labels, sufficient contrast, reduced motion and accessible forms; locale, date/timezone and number formatting; clear errors, loading states, stale-data warnings and confirmations.

## 14. Testing and release gates

Required automated tests:
- Unit: money, precision, P&L, margin, indicators and state machines.
- Integration: authentication, authorization, transactions, idempotency, webhooks and provider adapters.
- Contract: provider sandbox behaviour.
- End-to-end: onboarding, eligibility, demo order lifecycle, history and account separation.
- Security: access control, injection, CSRF, secrets and privilege escalation.
- Load/soak: quote streams, chart history and reconnect storms.
- Reconciliation: duplicate, missing and corrected events.

CI must run lint, typecheck, tests, migration validation, dependency/security scans and production build. Deploy to staging first. Run smoke tests and backups before production. Roll back safely; destructive data migrations require an approved plan.

## 15. Delivery phases and acceptance criteria

1. Foundation: stabilize current branch, typed contracts, migrations, AuthKit identity mapping, environment validation and audit framework. Tests pass; homepage/logo unchanged; anonymous and cross-user API access rejected.
2. Persistent demo platform: demo accounts, ledger, orders, positions, history and portfolio. Data survives reload/login; idempotency works; demo/live data separated.
3. Market data: one licensed sandbox/feed adapter, quote stream and historical candles. Provenance, timestamps, stale-data handling and reconnect tests pass.
4. Charting: chart interactions and indicators. Responsive and deterministic chart tests pass.
5. Provider sandbox: one approved provider adapter, account sync, demo orders and reconciliation. Official provider test evidence and contract tests pass.
6. Global compliance framework: jurisdiction rules, disclosures, required KYC/AML integration, case handling and product gates. Documented legal/compliance sign-off for each launch market/product.
7. Controlled live pilot: only after all prior gates, with capped exposure, monitoring, support, incident response and kill switch.
8. Expansion: add providers, instruments, locales and markets only after each provider/market passes the same verification gates.

## 16. Environment configuration

Document required variables with safe placeholders, never real secrets: DATABASE_URL; AuthKit issuer/audience/server verification settings; REDIS_URL if used; market-data provider URL and server-side secret references; broker OAuth/client settings and secret-manager references; webhook signing secrets; KYC/AML provider configuration; notification provider configuration; APP_BASE_URL, allowed origins and environment name. Provide an .env.example containing placeholders only. Validate configuration at startup and fail closed for missing security-critical settings.

## 17. Current implementation truth

Existing repository work is an initial demo trading workspace and provider framework. Do not claim live market data, advanced chart engine, real broker connections, deposits/withdrawals, real-money options, completed global compliance, passing production build or deployment unless each is implemented and verified. The Supabase/PostgreSQL migration and demo API described in project notes must be checked against the current branch before being treated as present or production-ready.

## 18. Non-negotiable preservation constraints

- Do not edit or replace the existing public homepage without explicit approval.
- Do not replace, redraw or recolor the original Mamba FX logo.
- Keep the existing GitHub repository and working branch; do not merge the diverged branch into main automatically.
- Keep AuthKit protection and existing account identity flow.
- Remove old TikTok/social features from the trading application.
- Make additive, reviewable commits and provide exact changed-file and test summaries.
