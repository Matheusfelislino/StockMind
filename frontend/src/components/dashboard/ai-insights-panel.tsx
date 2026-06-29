"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, TrendingUp, AlertCircle } from "lucide-react";
import type { Recommendation } from "@/types";

export function AiInsightsPanel({ rec }: { rec: Recommendation }) {
  return (
    <aside className="sticky top-[72px] overflow-hidden rounded-2xl border border-border/60 bg-surface">
      <div className="relative border-b border-border/60 p-5">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_-4px_oklch(0.78_0.16_158_/_0.5)]">
            <Brain className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">IA Insights</h3>
            <p className="text-[10px] text-muted-foreground">
              Raciocínio do modelo · v4.2
            </p>
          </div>
        </div>
      </div>

      <motion.div
        key={rec.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-5 p-5"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Produto analisado
          </p>
          <h4 className="mt-1.5 text-[13px] font-semibold leading-snug">
            {rec.product}
          </h4>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {rec.store} · <span className="font-mono">{rec.storeCode}</span>
          </p>
        </div>

        <div className="rounded-lg border border-primary/15 bg-primary/[0.04] p-3.5">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <p className="text-[12px] leading-relaxed text-foreground/90">
              {rec.insight}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Sinais detectados
          </p>
          <ul className="mt-2 space-y-2">
            {[
              { icon: TrendingUp, label: "Demanda 14d", value: "+38%", tone: "text-primary" },
              { icon: AlertCircle, label: "Cobertura atual", value: "3.2 dias", tone: "text-destructive" },
              { icon: Brain, label: "Modelo histórico", value: "12 ciclos similares", tone: "text-info" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.label}
                  className="flex items-center justify-between rounded-md border border-border/40 bg-background/30 px-3 py-2"
                >
                  <span className="inline-flex items-center gap-2 text-[11.5px] text-muted-foreground">
                    <Icon className={`h-3.5 w-3.5 ${s.tone}`} />
                    {s.label}
                  </span>
                  <span className="font-mono text-[12px] font-semibold tabular-nums">
                    {s.value}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Confiança do modelo
          </p>
          <div className="mt-2 flex items-end gap-3">
            <span className="font-mono text-3xl font-semibold tabular-nums">
              {rec.confidence}
            </span>
            <span className="pb-1 text-xs text-muted-foreground">/ 100</span>
          </div>
          <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rec.confidence}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="bg-gradient-to-r from-primary via-accent to-primary"
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Calculado a partir de 18 features: histórico de vendas, sazonalidade,
            dados climáticos, prescrição regional e fluxo de caixa.
          </p>
        </div>
      </motion.div>
    </aside>
  );
}
