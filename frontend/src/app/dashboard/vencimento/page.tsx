"use client";

import { motion } from "framer-motion";
import { CalendarClock, AlertTriangle, Package } from "lucide-react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { useExpirationRisk } from "@/hooks/useQueries";
import { formatDate, getDaysUntilExpiration } from "@/lib/formatters";
import type { InventoryLotResponseDTO } from "@/types";

function DaysChip({ days }: { days: number }) {
  const color =
    days < 15
      ? "bg-destructive/15 text-destructive ring-destructive/20"
      : days < 30
        ? "bg-warning/15 text-warning ring-warning/20"
        : "bg-info/15 text-info ring-info/20";

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 tabular-nums ${color}`}>
      {days}d
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="flex animate-pulse gap-4 px-5 py-4">
      <div className="h-9 w-9 rounded-lg bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-48 rounded bg-muted" />
        <div className="h-3 w-32 rounded bg-muted" />
      </div>
      <div className="h-3 w-12 rounded bg-muted" />
    </div>
  );
}

export default function VencimentoPage() {
  const { data, isLoading, error } = useExpirationRisk(60);

  const sorted = [...(data?.criticalLots ?? [])].sort((a, b) => {
    const dA = getDaysUntilExpiration(a.expirationDate);
    const dB = getDaysUntilExpiration(b.expirationDate);
    return dA - dB;
  });

  const under30 = sorted.filter((l) => getDaysUntilExpiration(l.expirationDate) < 30);
  const under60 = sorted.filter((l) => {
    const d = getDaysUntilExpiration(l.expirationDate);
    return d >= 30 && d < 60;
  });

  const stats = [
    { label: "Lotes em risco", value: String(data?.totalLotsAtRisk ?? "—"), sub: "próximos 60 dias" },
    { label: "Críticos (< 30d)", value: String(under30.length), sub: "vencimento iminente" },
    { label: "Atenção (30-60d)", value: String(under60.length), sub: "monitorar" },
    { label: "Unidades em risco", value: (data?.totalQuantityAtRisk ?? 0).toLocaleString("pt-BR"), sub: "total de itens" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Risco de Perda"
        title="Vencimento"
        description="Lotes próximos do vencimento por loja. Ordenado por proximidade do vencimento."
      />

      <PageBody>
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border/60 bg-surface p-5"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {s.label}
              </p>
              {isLoading ? (
                <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <p className="mt-3 font-mono text-2xl font-semibold tabular-nums">{s.value}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
          <div className="border-b border-border/60 px-5 py-4">
            <h3 className="text-sm font-semibold">Lotes em janela crítica</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Próximos 60 dias · ordenado por proximidade
            </p>
          </div>

          {error ? (
            <div className="px-5 py-10 text-center">
              <AlertTriangle className="mx-auto h-6 w-6 text-destructive" />
              <p className="mt-2 text-sm text-destructive">Erro ao carregar dados</p>
              <p className="text-xs text-muted-foreground">{error.message}</p>
            </div>
          ) : isLoading ? (
            <div className="divide-y divide-border/60">
              {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : sorted.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Package className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 text-sm font-medium">Nenhum lote em risco</p>
              <p className="text-xs text-muted-foreground">
                Todos os lotes têm mais de 60 dias até o vencimento
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {sorted.map((lot: InventoryLotResponseDTO, i: number) => {
                const days = getDaysUntilExpiration(lot.expirationDate);
                const iconBg = days < 30 ? "bg-destructive/10 ring-destructive/20" : "bg-warning/10 ring-warning/20";
                const iconColor = days < 30 ? "text-destructive" : "text-warning";

                return (
                  <motion.li
                    key={lot.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[auto_minmax(0,2fr)_minmax(0,1fr)_auto_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-hover/50"
                  >
                    <div className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${iconBg}`}>
                      <CalendarClock className={`h-4 w-4 ${iconColor}`} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{lot.productName}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        <span className="font-mono">{lot.batchNumber}</span>
                        {" · "}
                        {lot.storeName}
                        {" · "}
                        {lot.quantity.toLocaleString("pt-BR")} un
                      </p>
                    </div>

                    <div className="min-w-0 text-xs text-muted-foreground">
                      <p>{formatDate(lot.expirationDate)}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
                          <div
                            className="h-full"
                            style={{
                              width: `${100 - Math.min((days / 60) * 100, 100)}%`,
                              background:
                                days < 15
                                  ? "var(--destructive)"
                                  : days < 30
                                    ? "var(--warning)"
                                    : "var(--info)",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <DaysChip days={days} />

                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold tabular-nums text-muted-foreground">
                        {lot.quantity.toLocaleString("pt-BR")} un
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
