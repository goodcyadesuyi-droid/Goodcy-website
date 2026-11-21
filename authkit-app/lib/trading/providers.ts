import type { ProviderCapabilities, TradingProduct } from "./types";
const forex: TradingProduct[] = ["FOREX_CFD"];
export const providerRegistry: ProviderCapabilities[] = [
  { providerId:"deriv",displayName:"Deriv Options API",status:"SANDBOX_PENDING",supportedProducts:["FIXED_TIME_OPTIONS"],supportedRegions:[],accountTypes:["DEMO"],notes:["OAuth 2.0 + PKCE scaffold committed. Requires registered Deriv OAuth app, configured secrets and successful demo account verification. No live account or execution enabled."] },
  { providerId:"exness-mt5",displayName:"Exness MT5",status:"NOT_CONFIGURED",supportedProducts:forex,supportedRegions:[],accountTypes:[],notes:["MT5 account compatibility and an authorized gateway must be confirmed separately."]},
  { providerId:"ic-markets",displayName:"IC Markets",status:"NOT_CONFIGURED",supportedProducts:forex,supportedRegions:[],accountTypes:[],notes:["No broker API or execution agreement is configured."]},
  { providerId:"pepperstone",displayName:"Pepperstone",status:"NOT_CONFIGURED",supportedProducts:forex,supportedRegions:[],accountTypes:[],notes:["No broker API or execution agreement is configured."]},
  { providerId:"xm",displayName:"XM",status:"NOT_CONFIGURED",supportedProducts:forex,supportedRegions:[],accountTypes:[],notes:["No broker API or execution agreement is configured."]},
];
