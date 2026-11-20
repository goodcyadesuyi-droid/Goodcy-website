# Mamba FX Trading Platform — implementation status

## Confirmed configuration
- Products: Forex/CFD and fixed-time options.
- Broker strategy: multiple authorized providers through independent adapters.
- Options: design for eventual live support; real-money execution disabled pending jurisdiction-specific legal authorization, provider approval, licensed market data, settlement specifications and compliance controls.
- Repository: goodcyadesuyi-droid/Goodcy-website.
- Branch: authkit-vercel-setup. Application root: authkit-app.

## Implemented in this phase
- Replaced the previous terminal preview with a multi-asset workspace.
- Added Forex/CFD and fixed-time options demo tabs.
- Added instrument categories, search, watchlist controls, chart-type/timeframe controls, indicator selector, demo tickets, activity tabs and provider status labels.
- Updated the authenticated member dashboard to remove Friends, Create/MFX Studio and social-video references, replacing them with trading navigation.
- Kept AuthKit protection on the terminal route.
- No public landing page or logo asset was intentionally changed.

## Current limitations
This is a frontend demo workspace, not a live brokerage platform:
- Quotes and candles are illustrative static samples, not live or licensed market data.
- Demo records exist only in client-side React state; no database persistence.
- Closing a demo record does not close a broker position.
- Stop Loss and Take Profit are UI inputs only.
- Options records are local demo placeholders; no live payout, contract quote, expiry engine or settlement source exists.
- Exness, Deriv, IC Markets, Pepperstone, XM and options providers are not connected.
- Live execution, deposits, withdrawals and real-money options are not implemented.

## Target server architecture
Use independent adapters for licensed market data, broker account authentication, Forex/CFD execution, fixed-time options quote/purchase/expiry/settlement, and demo simulation. Each provider adapter must declare supported accounts, regions, instruments, order types, price source, market hours, size rules and settlement semantics. Do not advertise a provider as supported until sandbox tests pass and written production approval exists.

## Financial integrity and security
- Browser clients never receive broker master credentials.
- Secrets live only in an approved server-side secret manager.
- Every account, order and position is bound to the authenticated user and account.
- Enforce account/product permissions, jurisdiction rules and pre-trade risk checks server-side.
- Use idempotency keys; persist provider order IDs and confirmed execution states.
- Never mark an order filled until provider confirmation.
- Reconcile positions and balances against provider records.
- Keep immutable audit events for security, order and settlement events.
- Separate virtual demo ledgers from real-money ledgers.
- Detect stale quotes; provide loss/exposure controls and a kill switch.

## Multiple-provider evaluation targets
- Exness / MT5: verify account-type and authorized MT5 gateway compatibility.
- Deriv: verify product access, API terms and regional restrictions.
- IC Markets: verify authorized partner integration and supported accounts.
- Pepperstone: verify authorized API/platform integration.
- XM: verify approved integration and supported account types.
- Fixed-time options provider: identify only after legal review and due diligence.

Retail accounts do not automatically grant API, white-label or execution rights. Obtain written provider approval and confirm commercial, data and regional permissions.

## Next milestones
1. Typed backend domain models and database migrations for users, accounts, instruments, quotes, orders, executions, positions, options contracts, settlements, ledger entries and audit events.
2. Server-side demo trading with virtual ledger and persistent history.
3. Integrate one licensed market-data source with feed timestamps.
4. Define provider adapter interfaces and conformance tests.
5. Evaluate and contract authorized broker integrations one at a time.
6. Complete security, KYC/AML, payments and jurisdiction review.
7. Implement options quote and settlement only after provider and legal approval.
8. Keep live execution flags off until all gates pass.

## Deployment secret names
- DATABASE_URL
- REDIS_URL
- MARKET_DATA_PROVIDER
- MARKET_DATA_API_KEY
- BROKER_ADAPTERS_ENABLED
- LIVE_TRADING_ENABLED=false
- LIVE_OPTIONS_ENABLED=false
- Provider credentials only after written authorization. Never commit secret values.
