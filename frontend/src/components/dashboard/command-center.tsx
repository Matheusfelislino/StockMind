"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  ArrowRightLeft,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import type { Recommendation } from "@/types";

const categoryConfig = {
  ruptura: {
    label: "Ruptura",
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    ring: "ring-destructive/20",
  },
  reposicao: {
    label: "Reposição",
    icon: RefreshCw,
    color: "text-primary",
    bg: "bg-primary/10",
    ring: "ring-primary/20",
  },
  transferencia: {
    label: "Transferência",
    icon: ArrowRightLeft,
    color: "text-info",
    bg: "bg-info/10",
    ring: "ring-info/20",
  },
  promocao: {
    label: "Promoção",
    icon: TrendingUp,
    color: "text-warning",
    bg: "bg-warning/10",
    ring: "ring-warning/20",
  },
} as const;

const urgencyConfig = {
  critical: {
    label: "Crítico",
    color: "bg-destructive/15 text-destructive ring-destructive/20",
  },
  high: {
    label: "Alto",
    color: "bg-warning/15 text-warning ring-warning/20",
  },
  medium: {
    label: "Médio",
    color: "bg-muted text-muted-foreground ring-border",
  },
};

function ConfidenceBar({ value }: { value: number }) {
  return (
    <span className="inline-flex h-1 w-12 overflow-hidden rounded-full bg-border">
      <span
        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
        style={{ width: `${value}%` }}
      />
    </span>
  );
}

interface CommandCenterProps {
  items: Recommendation[];
  onSelect: (rec: Recommendation) => void;
  selectedId?: string;
  onAction?: (id: string, action: "approve" | "reject") => void;
}

export function CommandCenter({
  items: initialItems,
  onSelect,
  selectedId,
  onAction,
}: CommandCenterProps) {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<string>(
    selectedId ?? initialItems[0]?.id ?? ""
  );

  const handleAction = (
    id: string,
    action: "approve" | "reject",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((r) => r.id !== id));
    onAction?.(id, action);
  };

  const handleSelect = (rec: Recommendation) => {
    setSelected(rec.id);
    onSelect(rec);
  };

  const totalImpact = items.reduce((s, r) => s + r.impact, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight">
              Command Center
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-primary/20">
              <Sparkles className="h-2.5 w-2.5" />
              {items.length} decisões
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Ordenado por impacto financeiro · oportunidade total{" "}
            <span className="font-semibold text-foreground">
              R$ {(totalImpact / 1000).toFixed(0)}k
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Modelo v4.2 · atualizado 2m
        </div>
      </div>

      <ul className="divide-y divide-border/60">
        <AnimatePresence initial={false}>
          {items.map((rec, i) => {
            const cat = categoryConfig[rec.category];
            const urg = urgencyConfig[rec.urgency];
            const Icon = cat.icon;
            const isSelected = selected === rec.id;

            return (
              <motion.li
                key={rec.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                onClick={() => handleSelect(rec)}
                className={`group relative cursor-pointer px-5 py-4 transition-colors ${
                  isSelected
                    ? "bg-surface-elevated"
                    : "hover:bg-surface-hover/60"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="rec-active"
                    className="absolute left-0 top-0 h-full w-0.5 bg-primary"
                  />
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${cat.bg} ring-1 ${cat.ring}`}
                  >
                    <Icon className={`h-4 w-4 ${cat.color}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-sm font-semibold">
                        {rec.product}
                      </h4>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ${urg.color}`}
                      >
                        {urg.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {rec.store} · <span className="font-mono">{rec.storeCode}</span>{" "}
                      · <span className="font-mono">{rec.sku}</span>
                    </p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/80">
                      {rec.reason}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-muted-foreground/60">Sugerido</span>
                        <span className="font-mono font-semibold text-foreground">
                          {rec.qty.toLocaleString("pt-BR")} {rec.unit}
                        </span>
                      </span>
                      <span className="text-border">•</span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-muted-foreground/60">Confiança</span>
                        <ConfidenceBar value={rec.confidence} />
                        <span className="font-mono font-semibold text-foreground">
                          {rec.confidence}%
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Impacto
                      </p>
                      <p className="font-mono text-base font-semibold tabular-nums text-primary">
                        +R$ {(rec.impact / 1000).toFixed(1)}k
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(e) => handleAction(rec.id, "reject", e)}
                        className="grid h-7 w-7 place-items-center rounded-md border border-border/60 bg-background/40 text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Rejeitar"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleAction(rec.id, "approve", e)}
                        className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2.5 text-[11px] font-semibold text-primary-foreground shadow-[0_0_16px_-4px_oklch(0.78_0.16_158_/_0.6)] transition-transform hover:scale-105"
                      >
                        <Check className="h-3 w-3" />
                        Aprovar
                      </button>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {items.length === 0 && (
        <div className="px-5 py-12 text-center">
          <Check className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-2 text-sm font-medium">Tudo limpo</p>
          <p className="text-xs text-muted-foreground">
            Nenhuma recomendação pendente
          </p>
        </div>
      )}
    </div>
  );
}
