"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ShoppingCart, Loader2 } from "lucide-react";
import type { PurchaseRecommendationResponseDTO } from "@/types";
import { useUpdateRecommendationStatus } from "@/hooks/useQueries";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface RecommendationsTableProps {
  recommendations: PurchaseRecommendationResponseDTO[];
}

export function RecommendationsTable({ recommendations }: RecommendationsTableProps) {
  const { mutate: updateStatus, isPending } = useUpdateRecommendationStatus();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = recommendations.filter(
    (r) => r.status === "PENDING" && !dismissed.has(r.id)
  );

  const handleAction = (id: string, status: "APPROVED" | "REJECTED") => {
    setPendingId(id);
    updateStatus(
      { id, status },
      {
        onSettled: () => {
          setPendingId(null);
          setDismissed((prev) => new Set(prev).add(id));
        },
      }
    );
  };

  if (visible.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <Check className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-2 text-sm font-medium">Tudo limpo</p>
        <p className="text-xs text-muted-foreground">Nenhuma recomendação pendente</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            <th className="px-5 py-3 text-left">Produto</th>
            <th className="hidden px-4 py-3 text-left md:table-cell">Loja</th>
            <th className="px-4 py-3 text-right">Qtd Sugerida</th>
            <th className="hidden px-4 py-3 text-right lg:table-cell">Impacto</th>
            <th className="hidden px-4 py-3 text-left xl:table-cell">Motivo</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          <AnimatePresence initial={false}>
            {visible.map((rec, i) => {
              const isActing = pendingId === rec.id && isPending;
              return (
                <motion.tr
                  key={rec.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, height: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="group transition-colors hover:bg-surface-hover/50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                        <ShoppingCart className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{rec.productName}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {formatDate(rec.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 md:table-cell">
                    <p className="text-xs text-muted-foreground">{rec.storeName}</p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono font-semibold tabular-nums">
                      {rec.suggestedQuantity.toLocaleString("pt-BR")}
                    </span>
                    <span className="ml-1 text-[11px] text-muted-foreground">un</span>
                  </td>
                  <td className="hidden px-4 py-4 text-right lg:table-cell">
                    <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                      {formatCurrency(rec.financialImpact)}
                    </span>
                  </td>
                  <td className="hidden max-w-xs px-4 py-4 xl:table-cell">
                    <p className="truncate text-xs text-muted-foreground" title={rec.rationale}>
                      {rec.rationale}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        disabled={isActing}
                        onClick={() => handleAction(rec.id, "REJECTED")}
                        className="grid h-7 w-7 place-items-center rounded-md border border-border/60 bg-background/40 text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                        aria-label="Rejeitar"
                      >
                        {isActing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        disabled={isActing}
                        onClick={() => handleAction(rec.id, "APPROVED")}
                        className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2.5 text-[11px] font-semibold text-primary-foreground shadow-[0_0_16px_-4px_oklch(0.78_0.16_158_/_0.6)] transition-all hover:scale-105 disabled:opacity-40"
                        aria-label="Aprovar"
                      >
                        {isActing ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                        Aprovar
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
