# Mamba FX Academy — Exness MT5 Live Account Connection Readiness

**Project state:** Preparation only. Not connected to Exness. Live trading is disabled.

## What is being integrated

The requested account is an **Exness MT5 live account**. The target is to connect the Mamba FX Academy interface to the account through an authorised MetaTrader 5 terminal integration and private backend. Mamba's custom interface is not itself a MetaQuotes-developed product. MT5 is MetaQuotes software; Exness is the broker and account provider.

## Do not confuse Exness API with MT5 connectivity

Exness' current API help page says its Trader API is for eligible Exness trading accounts and that standard MetaTrader accounts cannot connect to it. Therefore, do not attempt to use Exness Trader API as an assumed bridge to this MT5 account. Confirm the exact account platform and obtain written approval from Exness for the proposed third-party MT5 terminal bridge and commercial use.

Exness lists an MT5 WebTerminal developed by MetaQuotes and hosted on Exness' website. That is an official browser-based terminal option, but linking to it is not the same as embedding a licensed MT5 terminal into Mamba or establishing a Mamba backend connection.

## Architecture to prepare

1. Mamba website/PWA remains a presentation layer; it must never contain broker secrets.
2. Private backend authenticates each Mamba user and verifies account ownership.
3. Managed Windows host runs the official MT5 terminal and a private connector/adapter, subject to Exness approval. The terminal is not exposed to the public internet.
4. Backend exposes authenticated, narrowly scoped endpoints for account status, quotes, positions, orders and history. Realtime updates use an authenticated gateway.
5. Encrypted secret storage, MFA, audit trails, idempotency, rate limits, monitoring, IP restrictions where supported, and emergency shutdown are mandatory.
6. AGI assistant starts read-only: explain charts and verified account data. Chart controls are separate from trade execution.

## Preconditions before connecting the account

- Account owner verifies in Exness Personal Area that the account is MT5-based and retrieves its exact trading server name.
- Exness confirms in writing that the intended third-party bridge, custom frontend and commercial/customer use are authorised for this account and region.
- Legal/regulatory review confirms the Mamba business model is permitted in Nigeria and every relevant jurisdiction. Do not offer managed execution or execute customer orders without the required permissions.
- Private backend and managed Windows host are deployed and security-reviewed.
- Demo connection and read-only reconciliation tests pass.

## Safe activation sequence

**Stage 0 — Current:** UI selection only; no account linked; no credentials collected; no real account data; no live orders.

**Stage 1 — Authorisation:** broker written approval, account platform/server confirmation, and legal review.

**Stage 2 — Infrastructure:** private backend, Windows MT5 host, encrypted secrets, MFA, audit and monitoring.

**Stage 3 — Demo/read-only verification:** confirm identity, server, symbols, live quotes, positions, orders, history, balance, equity and margin against the official terminal. Test reconnects, stale data, rejected requests, partial fills, market closures and duplicate-request handling.

**Stage 4 — Live permission review:** independent security review, explicit account-owner consent, clear risk disclosure, hard limits and emergency kill switch. Only then may a separate controlled release enable live order methods. Default to per-order user confirmation; never let an AI model independently submit live orders without a separate explicitly authorised automation configuration.

## Secrets and credentials

Never send credentials to ChatGPT or commit them to GitHub. Never put them in browser JavaScript, app bundles, URLs, screenshots or logs. The account owner must enter credentials only into the eventual secure backend onboarding flow. This document intentionally contains no account number, password, token, API key or private key.

## Official references

- Exness API eligibility: https://get.exness.help/hc/en-us/articles/27866287512476-Exness-API
- Exness supported platforms / MT5 WebTerminal: https://get.exness.help/hc/en-us/articles/360008194992-Available-trading-platforms
- Exness platform selection per account: https://get.exness.help/hc/en-us/articles/11087694467484-Can-I-change-the-platform-used-with-my-trading-account
- MetaQuotes MT5 Python integration: https://www.mql5.com/en/docs/python_metatrader5
