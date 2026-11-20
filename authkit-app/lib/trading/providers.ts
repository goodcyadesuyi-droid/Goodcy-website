import type { ProviderCapabilities, TradingProduct } from "./types";

/**
 * These are unconfigured integration targets, not connected brokers.
 * A provider must not be marked production-approved until written permission,
 * regional eligibility, data rights and end-to-end certification are verified.
 */
const both: TradingProduct[] = ["FOREX_CFD"];
export const providerRegistry: ProviderCapabilities[] = [
  { providerId: "exness-mt5", displayName: "Exness MT5", status: "NOT_CONFIGURED", supportedProducts: both, supportedRegions: [], accountTypes: [], notes: ["MT5 account compatibility and an authorized gateway must be confirmed separately."] },
  { providerId: "deriv", displayName: "Deriv", status: "NOT_CONFIGURED", supportedProducts: both, supportedRegions: [], accountTypes: [], notes: ["API access, contract availability and regional permissions require verification."] },
  { providerId: "ic-markets", displayName: "IC Markets", status: "NOT_CONFIGURED", supportedProducts: both, supportedRegions: [], accountTypes: [], notes: ["No broker API or execution agreement is configured."] },
  { providerId: "pepperstone", displayName: "Pepperstone", status: "NOT_CONFIGURED", supportedProducts: both, supportedRegions: [], accountTypes: [], notes: ["No broker API or execution agreement is configured."] },
  { providerId: "xm", displayName: "XM", status: "NOT_CONFIGURED", supportedProducts: both, supportedRegions: [], accountTypes: [], notes: ["No broker API or execution agreement is configured."] },
  { providerId: "options-provider", displayName: "Fixed-time options provider", status: "NOT_CONFIGURED", supportedProducts: ["FIXED_TIME_OPTIONS"], supportedRegions: [], accountTypes: [], notes: ["Live options require legal approval, an authorized provider, licensed pricing and settlement rules."] },
];
