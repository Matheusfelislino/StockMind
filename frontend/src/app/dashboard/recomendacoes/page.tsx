"use client";

import { AlertTriangle, Filter } from "lucide-react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { useRecommendations } from "@/hooks/useQueries";
import { useSelectedStore } from "@/hooks/useSelectedStore";
import { StoreSelector } from "@/components/ui/StoreSelector";
import { RecommendationsTable } from "@/components/dashboard/RecommendationsTable";
import { formatCurrencyCompact } from "@/lib/formatters";
import { motion } from "framer-motion";

function SkeletonTable() {
  return (
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
  );
}

export default function RecomendacoesPage() {
  const { storeId, selectStore } = useSelectedStore();
  const { data, isLoading, error } = useRecommendations(storeId || undefined);

  const stats = [
    {
      label: "Pendentes",
      value: String(data?.totalPending ?? "—"),
      sub: "aguardando aprovação",
    },
    {
      label: "Impacto total",
      value: data ? formatCurrencyCompact(data.totalFinancialImpact) : "—",
      sub: "em compras sugeridas",
    },
    {
      label: "Aprovadas",
      value: String(data?.recommendations.filter((r) => r.status === "APPROVED").length ?? "—"),
      sub: "nesta sessão",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Decision Center"
        title="Recomendações"
        description="Todas as ordens de compra sugeridas pela IA, ordenadas por impacto financeiro."
      >
        <div className="flex items-center gap-2">
          <StoreSelector value={storeId} onChange={selectStore} />
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium transition-colors hover:bg-surface-elevated">
            <Filter className="h-4 w-4 text-muted-foreground" />
            Filtros
          </button>
        </div>
      </PageHeader>

      <PageBody>
        {/* Summary stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border/60 bg-surface p-5"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {s.label}
              </p>
              {isLoading ? (
                <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-gradient">
                  {s.value}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
          <div className="border-b border-border/60 px-5 py-4">
            <h3 className="text-sm font-semibold">Recomendações de compra</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Geradas pelo modelo Prophet · atualizadas às 03:00
            </p>
          </div>

          {error ? (
            <div className="px-5 py-10 text-center">
              <AlertTriangle className="mx-auto h-6 w-6 text-destructive" />
              <p className="mt-2 text-sm text-destructive">Erro ao carregar recomendações</p>
              <p className="text-xs text-muted-foreground">{error.message}</p>
            </div>
          ) : isLoading ? (
            <SkeletonTable />
          ) : (
            <RecommendationsTable recommendations={data?.recommendations ?? []} />
          )}
        </div>
      </PageBody>
    </>
  );
}
