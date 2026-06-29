"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, Coins, CalendarClock, TrendingUp } from "lucide-react";
import { useRecommendations, useDashboardOverview, useExpirationRisk, useStores } from "@/hooks/useQueries";
import { useSelectedStore } from "@/hooks/useSelectedStore";
import { StoreSelector } from "@/components/ui/StoreSelector";
import { RecommendationsTable } from "@/components/dashboard/RecommendationsTable";
import { formatCurrencyCompact } from "@/lib/formatters";

function KpiSkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-border/60 bg-surface p-6">
      <div className="h-3 w-24 rounded bg-muted" />
      <div className="mt-4 h-10 w-32 rounded bg-muted" />
      <div className="mt-4 h-3 w-48 rounded bg-muted" />
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  tone,
  index,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  tone: "danger" | "warning" | "positive" | "neutral";
  index: number;
}) {
  const iconColors = {
    danger: "text-destructive bg-destructive/10 ring-destructive/20",
    warning: "text-warning bg-warning/10 ring-warning/20",
    positive: "text-primary bg-primary/10 ring-primary/20",
    neutral: "text-muted-foreground bg-muted ring-border",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface p-6 transition-all hover:border-border hover:bg-surface-elevated"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: tone === "danger" ? "var(--destructive)" : tone === "warning" ? "var(--warning)" : "var(--primary)" }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <div className={`grid h-8 w-8 place-items-center rounded-lg ring-1 ${iconColors[tone]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-gradient">
          {value}
        </h2>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{sub}</p>
      </div>
    </motion.div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
      <AlertTriangle className="mx-auto h-6 w-6 text-destructive" />
      <p className="mt-2 text-sm font-medium text-destructive">Erro ao carregar dados</p>
      <p className="mt-1 text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { storeId, selectStore } = useSelectedStore();

  const { data: stores } = useStores();
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useDashboardOverview(storeId);
  const { data: expiration, isLoading: expirationLoading } = useExpirationRisk(60);
  const { data: recommendations, isLoading: recsLoading, error: recsError } = useRecommendations(storeId || undefined);

  // Auto-select first store
  useEffect(() => {
    if (!storeId && stores?.length) {
      selectStore(stores[0].id);
    }
  }, [stores, storeId, selectStore]);

  const isLoadingKpis = overviewLoading || expirationLoading;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] hero-glow" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] grid-pattern opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="relative mx-auto max-w-[1600px] px-6 py-8 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                Decision Co-pilot · IA analisando estoque em tempo real
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gradient md:text-[34px]">
                Bom dia, Gerente.
              </h1>
              {overview && (
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  {overview.totalPendingRecommendations > 0 ? (
                    <>
                      Há{" "}
                      <span className="font-semibold text-foreground">
                        {overview.totalPendingRecommendations} recomendações pendentes
                      </span>{" "}
                      com impacto de{" "}
                      <span className="font-semibold text-foreground">
                        {formatCurrencyCompact(overview.totalFinancialImpact)}
                      </span>
                      .
                    </>
                  ) : (
                    "Nenhuma recomendação crítica pendente no momento."
                  )}
                </p>
              )}
            </div>
            <StoreSelector value={storeId} onChange={selectStore} />
          </div>
        </motion.div>

        {/* KPI Grid */}
        {overviewError ? (
          <ErrorState message={overviewError.message} />
        ) : (
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {isLoadingKpis ? (
              <>
                <KpiSkeletonCard />
                <KpiSkeletonCard />
                <KpiSkeletonCard />
              </>
            ) : (
              <>
                <KpiCard
                  index={0}
                  label="Ruptura Curva A"
                  value={String(overview?.totalCurveAProducts ?? "—")}
                  sub="Produtos Curva A monitorados · risco de ruptura nos próximos 30 dias"
                  icon={AlertTriangle}
                  tone="danger"
                />
                <KpiCard
                  index={1}
                  label="Capital Travado"
                  value={formatCurrencyCompact(overview?.totalFinancialImpact ?? 0)}
                  sub={`${overview?.totalPendingRecommendations ?? 0} recomendações de compra pendentes de aprovação`}
                  icon={Coins}
                  tone="warning"
                />
                <KpiCard
                  index={2}
                  label="Risco de Vencimento"
                  value={String(expiration?.totalLotsAtRisk ?? "—")}
                  sub={`Lotes vencendo em 60 dias · ${expiration?.totalQuantityAtRisk ?? 0} unidades em risco`}
                  icon={CalendarClock}
                  tone="danger"
                />
              </>
            )}
          </div>
        )}

        {/* Recommendations */}
        <div className="rounded-2xl border border-border/60 bg-surface">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold tracking-tight">Recomendações Pendentes</h3>
                {recommendations && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-primary/20">
                    <Sparkles className="h-2.5 w-2.5" />
                    {recommendations.totalPending} decisões
                  </span>
                )}
              </div>
              {recommendations && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Impacto financeiro total:{" "}
                  <span className="font-semibold text-foreground">
                    {formatCurrencyCompact(recommendations.totalFinancialImpact)}
                  </span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Atualizado há 5min
            </div>
          </div>

          {recsError ? (
            <div className="p-6">
              <ErrorState message={recsError.message} />
            </div>
          ) : recsLoading ? (
            <div className="divide-y divide-border/60">
              {[...Array(4)].map((_, i) => (
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
          ) : (
            <RecommendationsTable
              recommendations={recommendations?.recommendations ?? []}
            />
          )}
        </div>

        {/* Trend indicator */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-y-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-primary" />
            StockMind · modelos Prophet + ML atualizados diariamente às 03:00
          </span>
          <span className="font-mono">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
