"use client";

import { motion } from "framer-motion";
import { AlertTriangle, PackageX, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { useRuptureKPI, useStores } from "@/hooks/useQueries";
import { useSelectedStore } from "@/hooks/useSelectedStore";
import { StoreSelector } from "@/components/ui/StoreSelector";
import { formatDate, formatConfidence } from "@/lib/formatters";
import { useEffect } from "react";
import type { ForecastResponseDTO } from "@/types";

function SkeletonRow() {
  return (
    <div className="flex animate-pulse gap-4 px-5 py-4">
      <div className="h-9 w-9 rounded-lg bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-48 rounded bg-muted" />
        <div className="h-3 w-32 rounded bg-muted" />
      </div>
      <div className="h-6 w-16 rounded bg-muted" />
    </div>
  );
}

function ConfidenceBadge({ score }: { score: number }) {
  const pct = score * 100;
  const color =
    pct >= 85
      ? "bg-primary/15 text-primary ring-primary/20"
      : pct >= 70
        ? "bg-warning/15 text-warning ring-warning/20"
        : "bg-destructive/15 text-destructive ring-destructive/20";

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 tabular-nums ${color}`}>
      {formatConfidence(score)}
    </span>
  );
}

export default function RupturaPage() {
  const { storeId, selectStore } = useSelectedStore();
  const { data: stores } = useStores();

  useEffect(() => {
    if (!storeId && stores?.length) selectStore(stores[0].id);
  }, [stores, storeId, selectStore]);

  const { data, isLoading, error } = useRuptureKPI(storeId, 30);

  const forecasts = data?.forecasts ?? [];
  const chartData = forecasts
    .slice(0, 10)
    .map((f: ForecastResponseDTO) => ({
      name: f.productName.length > 18 ? f.productName.slice(0, 16) + "…" : f.productName,
      qty: f.predictedQuantity,
      confidence: Math.round(f.confidenceScore * 100),
    }));

  const stats = [
    {
      label: "Produtos Curva A",
      value: String(data?.totalCurveAProducts ?? "—"),
      sub: "monitorados",
      tone: "neutral" as const,
    },
    {
      label: "Previsões geradas",
      value: String(forecasts.length),
      sub: "próximos 30 dias",
      tone: "warning" as const,
    },
    {
      label: "Período",
      value: `${data?.periodDays ?? 30}d`,
      sub: "janela de análise",
      tone: "neutral" as const,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Risco de Receita"
        title="Ruptura"
        description="Previsão de demanda por produto. A IA monitora cobertura, velocidade de venda e lead time do fornecedor."
      >
        <StoreSelector value={storeId} onChange={selectStore} />
      </PageHeader>

      <PageBody>
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 6 }}
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
                <p className={`mt-3 text-3xl font-semibold tracking-tight ${s.tone === "warning" ? "text-warning" : "text-gradient"}`}>
                  {s.value}
                </p>
              )}
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3" /> {s.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        {!isLoading && chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 overflow-hidden rounded-2xl border border-border/60 bg-surface p-5"
          >
            <h3 className="mb-4 text-sm font-semibold">
              Demanda prevista — top {chartData.length} produtos
            </h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.225 0.014 270)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "oklch(0.62 0.018 270)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "oklch(0.62 0.018 270)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.195 0.014 270)",
                      border: "1px solid oklch(0.235 0.015 270)",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "oklch(0.96 0.005 270)" }}
                    itemStyle={{ color: "oklch(0.78 0.16 158)" }}
                    formatter={(value: number) => [`${value} un`, "Previsto"]}
                  />
                  <Bar dataKey="qty" radius={[4, 4, 0, 0]}>
                    {chartData.map((_: unknown, i: number) => (
                      <Cell
                        key={i}
                        fill={`oklch(0.78 0.16 ${158 + i * 6})`}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
          <div className="border-b border-border/60 px-5 py-4">
            <h3 className="text-sm font-semibold">Previsões de demanda</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ordenado por quantidade prevista · modelo Prophet
            </p>
          </div>

          {error ? (
            <div className="px-5 py-10 text-center">
              <AlertTriangle className="mx-auto h-6 w-6 text-destructive" />
              <p className="mt-2 text-sm text-destructive">Erro ao carregar dados</p>
              <p className="text-xs text-muted-foreground">{error.message}</p>
            </div>
          ) : !storeId ? (
            <div className="px-5 py-12 text-center">
              <PackageX className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Selecione uma loja para ver as previsões</p>
            </div>
          ) : isLoading ? (
            <div className="divide-y divide-border/60">
              {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : forecasts.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <PackageX className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 text-sm font-medium">Nenhuma previsão disponível</p>
              <p className="text-xs text-muted-foreground">
                Execute a sincronização noturna para gerar novas previsões
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {[...forecasts]
                .sort((a, b) => b.predictedQuantity - a.predictedQuantity)
                .map((forecast: ForecastResponseDTO, i: number) => (
                  <motion.li
                    key={forecast.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[auto_minmax(0,2fr)_minmax(0,1fr)_auto_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-hover/50"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-destructive/10 ring-1 ring-destructive/20">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{forecast.productName}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {forecast.storeName}
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <p>Alvo: {formatDate(forecast.targetDate)}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold tabular-nums">
                        {forecast.predictedQuantity.toLocaleString("pt-BR")}
                        <span className="ml-1 text-[10px] font-normal text-muted-foreground">un</span>
                      </p>
                    </div>

                    <ConfidenceBadge score={forecast.confidenceScore} />
                  </motion.li>
                ))}
            </ul>
          )}
        </div>
      </PageBody>
    </>
  );
}
