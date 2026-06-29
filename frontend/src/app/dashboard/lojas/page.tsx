"use client";

import { motion } from "framer-motion";
import { MapPin, TrendingUp } from "lucide-react";
import { storeHeatmap } from "@/lib/mock-data";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { StoreHeatmap } from "@/components/dashboard/charts";

const summaryStats = [
  { label: "Lojas ativas", value: "142" },
  { label: "Saúde média", value: "78" },
  { label: "Críticas", value: "8" },
  { label: "Receita 30d", value: "R$ 24.8M" },
];

export default function LojasPage() {
  const sorted = [...storeHeatmap].sort((a, b) => b.health - a.health);

  return (
    <>
      <PageHeader
        eyebrow="Network"
        title="Lojas"
        description="142 lojas conectadas em tempo real. Saúde operacional consolidada por desempenho, ruptura e capital."
      />

      <PageBody>
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {summaryStats.map((s, i) => (
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
              <p className="mt-3 font-mono text-2xl font-semibold tabular-nums">
                {s.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mb-6">
          <StoreHeatmap />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
          <div className="border-b border-border/60 px-5 py-4">
            <h3 className="text-sm font-semibold">Ranking de desempenho</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Top 12 lojas por saúde operacional · últimos 30 dias
            </p>
          </div>
          <ul className="divide-y divide-border/60">
            {sorted.map((s, i) => (
              <motion.li
                key={s.code}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-[40px_auto_minmax(0,1fr)_minmax(0,160px)_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-hover/60"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  #{i + 1}
                </span>
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted ring-1 ring-border">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{s.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {s.code}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
                      style={{ width: `${s.health}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs tabular-nums">
                    {s.health}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-sm font-semibold tabular-nums text-primary">
                  <TrendingUp className="h-3 w-3" /> R$ {s.revenue}M
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </PageBody>
    </>
  );
}
