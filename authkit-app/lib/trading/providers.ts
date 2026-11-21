import type { ProviderCapabilities, TradingProduct } from "./types";
const forex: TradingProduct[] = ["FOREX_CFD"];
export const providerRegistry: ProviderCapabilities[] = [
  { providerId:"deriv",displayName:"Deriv Options API",status:"OAUTH_READY_PENDING_CONFIG",supportedProducts:["FIXED_TIME_OPTIONS"],supportedRegions:[],accountTypes:["DEMO"],notes:["Deriv OAuth 2.0 + PKCE start/callback routes are implemented for the registered Trade scope. Requires DERIV_CLIENT_ID and MFX_DERIV_TOKEN_ENCRYPTION_KEY in the hosting environment, a signed-in Mamba FX user, successful Deriv consent and verified demo Options account. This is not yet a verified sandbox connection. Live account selection and live execution are disabled."] },
  { providerId:"exness-mt5",displayName:"Exness MT5",status:"NOT_CONFIGURED",supportedProducts:forex,supportedRegions:[],accountTypes:[],notes:["MT5 account compatibility and an authorized gateway must be confirmed separately."]},
  { providerId:"ic-markets",displayName:"IC Markets",status:"NOT_CONFIGURED",supportedProducts:forex,supportedRegions:[],accountTypes:[],notes:["No broker API or execution agreement is configured."]},
  { providerId:"pepperstone",displayName:"Pepperstone",status:"NOT_CONFIGURED",supportedProducts:forex,supportedRegions:[],accountTypes:[],notes:["No broker API or execution agreement is configured."]},
  { providerId:"xm",displayName:"XM",status:"NOT_CONFIGURED",supportedProducts:forex,supportedRegions:[],accountTypes:[],notes:["No broker API or execution agreement is configured."]},
];
