"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, AlertTriangle, TrendingUp } from "lucide-react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { useDashboardOverview, useRecommendations, useStores } from "@/hooks/useQueries";
import { useSelectedStore } from "@/hooks/useSelectedStore";
import { StoreSelector } from "@/components/ui/StoreSelector";
import { formatCurrencyCompact, formatCurrency } from "@/lib/formatters";
import type { PurchaseRecommendationResponseDTO } from "@/types";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-border/60 bg-surface p-5">
      <div className="h-3 w-24 rounded bg-muted" />
      <div className="mt-3 h-8 w-28 rounded bg-muted" />
      <div className="mt-2 h-3 w-16 rounded bg-muted" />
    </div>
  );
}

export default function CapitalPage() {
  const { storeId, selectStore } = useSelectedStore();
  const { data: stores } = useStores();

  useEffect(() => {
    if (!storeId && stores?.length) selectStore(stores[0].id);
  }, [stores, storeId, selectStore]);

  const { data: overview, isLoading: overviewLoading, error: overviewError } = useDashboardOverview(storeId);
  const { data: recsData, isLoading: recsLoading } = useRecommendations(storeId || undefined);

  const recommendations = recsData?.recommendations ?? [];
  const pending = recommendations.filter((r) => r.status === "PENDING");
  const approved = recommendations.filter((r) => r.status === "APPROVED");

  const totalImpact = recsData?.totalFinancialImpact ?? 0;
  const pendingImpact = pending.reduce((s, r) => s + r.financialImpact, 0);
  const approvedImpact = approved.reduce((s, r) => s + r.financialImpact, 0);

  const isLoading = overviewLoading || recsLoading;

  const kpis = [
    {
      label: "Capital em decisão",
      value: formatCurrencyCompact(totalImpact),
      sub: "soma de todas as recomendações pendentes",
      tone: "warning" as const,
    },
    {
      label: "Pendente de aprovação",
      value: formatCurrencyCompact(pendingImpact),
      sub: `${pending.length} ordens aguardando`,
      tone: "danger" as const,
    },
    {
      label: "Já aprovado",
      value: formatCurrencyCompact(approvedImpact),
      sub: `${approved.length} ordens aprovadas`,
      tone: "positive" as const,
    },
    {
      label: "Produtos Curva A",
      value: String(overview?.totalCurveAProducts ?? "—"),
      sub: "itens de alta rotatividade monitorados",
      tone: "neutral" as const,
    },
  ];

  const toneColors: Record<string, string> = {
    warning: "text-warning",
    danger: "text-destructive",
    positive: "text-primary",
    neutral: "text-gradient",
  };

  return (
    <>
      <PageHeader
        eyebrow="Working Capital"
        title="Capital Travado"
        description="Visão consolidada do capital imobilizado em compras sugeridas pela IA. Aprove ordens para liberar fluxo de decisão."
      >
        <StoreSelector value={storeId} onChange={selectStore} />
      </PageHeader>

      <PageBody>
        {/* KPI grid */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-surface p-5 transition-all hover:bg-surface-elevated"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {k.label}
              </p>
              {isLoading ? (
                <div className="mt-3 h-8 w-28 animate-pulse rounded bg-muted" />
              ) : (
                <p className={`mt-3 font-mono text-2xl font-semibold tabular-nums ${toneColors[k.tone]}`}>
                  {k.value}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Recommendations breakdown */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
          <div className="border-b border-border/60 px-5 py-4">
            <h3 className="text-sm font-semibold">Ordens de compra por impacto</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Todas as recomendações · ordenadas por impacto financeiro
            </p>
          </div>

          {overviewError ? (
            <div className="px-5 py-10 text-center">
              <AlertTriangle className="mx-auto h-6 w-6 text-destructive" />
              <p className="mt-2 text-sm text-destructive">Erro ao carregar dados</p>
              <p className="text-xs text-muted-foreground">{overviewError.message}</p>
            </div>
          ) : isLoading ? (
            <div className="divide-y divide-border/60">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex animate-pulse gap-4 px-5 py-4">
                  <div className="h-9 w-9 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-48 rounded bg-muted" />
                    <div className="h-3 w-32 rounded bg-muted" />
                  </div>
                  <div className="h-6 w-20 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <TrendingUp className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 text-sm font-medium">Sem dados de capital</p>
              <p className="text-xs text-muted-foreground">Selecione uma loja para ver as recomendações</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {[...recommendations]
                .sort((a, b) => b.financialImpact - a.financialImpact)
                .map((rec: PurchaseRecommendationResponseDTO, i: number) => {
                  const statusConfig = {
                    PENDING: { label: "Pendente", color: "bg-warning/15 text-warning ring-warning/20" },
                    APPROVED: { label: "Aprovado", color: "bg-primary/15 text-primary ring-primary/20" },
                    REJECTED: { label: "Rejeitado", color: "bg-muted text-muted-foreground ring-border" },
                  };
                  const s = statusConfig[rec.status];

                  return (
                    <motion.li
                      key={rec.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-[auto_minmax(0,2fr)_minmax(0,1fr)_auto_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-hover/50"
                    >
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                        <Coins className="h-4 w-4 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{rec.productName}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {rec.storeName} · {rec.suggestedQuantity.toLocaleString("pt-BR")} un
                        </p>
                      </div>

                      <p className="truncate text-xs text-muted-foreground" title={rec.rationale}>
                        {rec.rationale}
                      </p>

                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${s.color}`}>
                        {s.label}
                      </span>

                      <div className="text-right">
                        <p className="font-mono text-sm font-semibold tabular-nums text-primary">
                          {formatCurrency(rec.financialImpact)}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
            </ul>
          )}
        </div>
      </PageBody>
    </>
  );
}
