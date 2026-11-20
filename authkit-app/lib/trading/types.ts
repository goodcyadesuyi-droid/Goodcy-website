export type TradingProduct = "FOREX_CFD" | "FIXED_TIME_OPTIONS";
export type TradingEnvironment = "DEMO" | "LIVE";
export type OrderSide = "BUY" | "SELL";
export type ProviderStatus = "NOT_CONFIGURED" | "SANDBOX_PENDING" | "SANDBOX_VERIFIED" | "PRODUCTION_APPROVED";

export interface Instrument {
  symbol: string;
  displayName: string;
  assetClass: "FOREX" | "STOCK" | "CRYPTO" | "COMMODITY" | "INDEX" | "ETF";
  baseCurrency?: string;
  quoteCurrency?: string;
  pricePrecision: number;
  enabledProducts: TradingProduct[];
}

export interface MarketQuote {
  instrument: string;
  bid: string;
  ask: string;
  timestamp: string;
  source: string;
  isDelayed: boolean;
}

export interface AccountContext {
  userId: string;
  accountId: string;
  environment: TradingEnvironment;
  jurisdiction?: string;
  permittedProducts: TradingProduct[];
}

export interface OrderPreview {
  product: TradingProduct;
  instrument: string;
  side: OrderSide;
  quantity: string;
  limitPrice?: string;
  stopLoss?: string;
  takeProfit?: string;
  expirySeconds?: number;
}

export interface ProviderCapabilities {
  providerId: string;
  displayName: string;
  status: ProviderStatus;
  supportedProducts: TradingProduct[];
  supportedRegions: string[];
  accountTypes: string[];
  notes: string[];
}

/** Provider implementations must run server-side and must not expose credentials to clients. */
export interface MarketDataProvider {
  readonly providerId: string;
  getQuote(instrument: string): Promise<MarketQuote>;
}

export interface ForexCfdExecutionProvider {
  readonly providerId: string;
  previewOrder(account: AccountContext, order: OrderPreview): Promise<{ accepted: boolean; reason?: string }>;
  submitOrder(account: AccountContext, order: OrderPreview, idempotencyKey: string): Promise<{ providerOrderId: string; status: "ACCEPTED" | "REJECTED" | "PENDING" }>;
  reconcileAccount(account: AccountContext): Promise<{ checkedAt: string; positions: unknown[] }>;
}

export interface FixedTimeOptionsProvider {
  readonly providerId: string;
  getContractQuote(account: AccountContext, order: OrderPreview): Promise<{ quoteId: string; payoutDisclosure: string; expiresAt: string }>;
  purchaseContract(account: AccountContext, quoteId: string, idempotencyKey: string): Promise<{ providerContractId: string; status: "ACCEPTED" | "REJECTED" | "PENDING" }>;
  getSettlement(providerContractId: string): Promise<{ status: "PENDING" | "SETTLED" | "CANCELLED"; outcome?: string; settledAt?: string }>;
}
