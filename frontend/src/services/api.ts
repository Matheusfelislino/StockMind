import type {
  StoreResponseDTO,
  ProductResponseDTO,
  InventoryLotResponseDTO,
  ForecastResponseDTO,
  PurchaseRecommendationResponseDTO,
  ExpirationRiskKPI,
  RuptureKPI,
  DashboardOverview,
  RecommendationStatus,
  RecommendationsKPI,
} from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`[${res.status}] ${path}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  getOverview: (storeId: string, days = 30, expirationDaysAhead = 60) =>
    apiFetch<DashboardOverview>(
      `/dashboard/overview?storeId=${storeId}&days=${days}&expirationDaysAhead=${expirationDaysAhead}`
    ),

  getExpirationRisk: (daysAhead = 60) =>
    apiFetch<ExpirationRiskKPI>(
      `/dashboard/kpi/expiration-risk?daysAhead=${daysAhead}`
    ),

  getRupture: (storeId: string, days = 30) =>
    apiFetch<RuptureKPI>(
      `/dashboard/kpi/rupture?storeId=${storeId}&days=${days}`
    ),

  getRecommendations: (storeId?: string) =>
    apiFetch<RecommendationsKPI>(
      `/dashboard/kpi/recommendations${storeId ? `?storeId=${storeId}` : ""}`
    ),
};

// ─── Recomendações ────────────────────────────────────────────────────────────

export const recommendationsApi = {
  updateStatus: (id: string, status: RecommendationStatus) =>
    apiFetch<PurchaseRecommendationResponseDTO>(`/recommendations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    }),
};

// ─── Previsões ────────────────────────────────────────────────────────────────

export const forecastApi = {
  getByStore: (storeId: string) =>
    apiFetch<ForecastResponseDTO[]>(`/forecasts/store/${storeId}`),
};

// ─── Estoque ──────────────────────────────────────────────────────────────────

export const inventoryApi = {
  getCriticalLots: (daysAhead = 60) =>
    apiFetch<InventoryLotResponseDTO[]>(
      `/inventory/critical?daysAhead=${daysAhead}`
    ),
};

// ─── Lojas ────────────────────────────────────────────────────────────────────

export const storesApi = {
  getAll: () => apiFetch<StoreResponseDTO[]>("/stores"),
};

// ─── Produtos ─────────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: () => apiFetch<ProductResponseDTO[]>("/products"),
};
