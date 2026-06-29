"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  dashboardApi,
  storesApi,
  recommendationsApi,
} from "@/services/api";

export const QUERY_KEYS = {
  stores: ["stores"] as const,
  overview: (storeId: string) => ["dashboard", "overview", storeId] as const,
  expirationRisk: (daysAhead: number) => ["dashboard", "expiration-risk", daysAhead] as const,
  rupture: (storeId: string, days: number) => ["dashboard", "rupture", storeId, days] as const,
  recommendations: (storeId?: string) => ["dashboard", "recommendations", storeId] as const,
};

export function useStores() {
  return useQuery({
    queryKey: QUERY_KEYS.stores,
    queryFn: storesApi.getAll,
    staleTime: 60 * 60 * 1000,
  });
}

export function useDashboardOverview(storeId: string, days = 30) {
  return useQuery({
    queryKey: QUERY_KEYS.overview(storeId),
    queryFn: () => dashboardApi.getOverview(storeId, days),
    enabled: !!storeId,
  });
}

export function useExpirationRisk(daysAhead = 60) {
  return useQuery({
    queryKey: QUERY_KEYS.expirationRisk(daysAhead),
    queryFn: () => dashboardApi.getExpirationRisk(daysAhead),
  });
}

export function useRuptureKPI(storeId: string, days = 30) {
  return useQuery({
    queryKey: QUERY_KEYS.rupture(storeId, days),
    queryFn: () => dashboardApi.getRupture(storeId, days),
    enabled: !!storeId,
  });
}

export function useRecommendations(storeId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.recommendations(storeId),
    queryFn: () => dashboardApi.getRecommendations(storeId),
    staleTime: 60 * 1000,
  });
}

export function useUpdateRecommendationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      recommendationsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "recommendations"] });
    },
  });
}
