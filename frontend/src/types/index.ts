// ─── Enums alinhados ao backend Java ─────────────────────────────────────────

export type RecommendationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type CurveCategory = "A" | "B" | "C";
export type RiskLevel = "critical" | "high" | "medium" | "low";

// ─── DTOs espelhando os ResponseDTOs do backend ───────────────────────────────

export interface StoreResponseDTO {
  id: string;
  name: string;
  cnpj: string;
  city: string;
  state: string;
  active: boolean;
  createdAt: string;
}

export interface ProductResponseDTO {
  id: string;
  ean: string;
  name: string;
  description: string;
  curveCategory: CurveCategory;
  costPrice: number;
  salePrice: number;
  active: boolean;
  createdAt: string;
}

export interface InventoryLotResponseDTO {
  id: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  batchNumber: string;
  expirationDate: string;
  quantity: number;
  active: boolean;
  createdAt: string;
}

export interface ForecastResponseDTO {
  id: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  targetDate: string;
  predictedQuantity: number;
  confidenceScore: number;
  createdAt: string;
}

export interface PurchaseRecommendationResponseDTO {
  id: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  suggestedQuantity: number;
  financialImpact: number;
  rationale: string;
  status: RecommendationStatus;
  createdAt: string;
}

// ─── Dashboard KPI types (composição do backend) ──────────────────────────────

export interface RecommendationsKPI {
  totalPending: number;
  totalFinancialImpact: number;
  recommendations: PurchaseRecommendationResponseDTO[];
}

export interface ExpirationRiskKPI {
  totalLotsAtRisk: number;
  totalQuantityAtRisk: number;
  criticalLots: InventoryLotResponseDTO[];
}

export interface RuptureKPI {
  storeId: string;
  periodDays: number;
  totalCurveAProducts: number;
  recentSales: SalesHistoryResponseDTO[];
  forecasts: ForecastResponseDTO[];
}

export interface SalesHistoryResponseDTO {
  id: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  saleDate: string;
  quantitySold: number;
  unitPrice: number;
  totalValue: number;
}

export interface DashboardOverview {
  storeId: string;
  totalCurveAProducts: number;
  totalLotsAtRisk: number;
  totalPendingRecommendations: number;
  totalFinancialImpact: number;
}

// ─── UI-specific types (mock / compostos) ─────────────────────────────────────

export interface Recommendation {
  id: string;
  product: string;
  sku: string;
  store: string;
  storeCode: string;
  qty: number;
  unit: string;
  impact: number;
  confidence: number;
  reason: string;
  category: "ruptura" | "reposicao" | "promocao" | "transferencia";
  urgency: "critical" | "high" | "medium";
  insight: string;
}

export interface KPI {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  description: string;
  spark: number[];
  tone: "danger" | "warning" | "neutral";
}

export interface ForecastPoint {
  day: string;
  actual: number | null;
  forecast: number;
  upper: number;
  lower: number;
}

export interface StoreHealth {
  code: string;
  name: string;
  health: number;
  revenue: number;
  risk: RiskLevel;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
}
