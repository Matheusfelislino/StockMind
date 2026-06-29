"use client";

import { motion } from "framer-motion";
import { Package, Search, Filter } from "lucide-react";
import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";

type CurveTag = "A" | "B" | "C";

const mockProducts = [
  { id: "p01", name: "Dipirona Monoidratada 500mg", ean: "7896181906016", curve: "A" as CurveTag, costPrice: 8.40, salePrice: 12.90, active: true },
  { id: "p02", name: "Losartana Potássica 50mg", ean: "7896714240038", curve: "A" as CurveTag, costPrice: 18.20, salePrice: 28.50, active: true },
  { id: "p03", name: "Omeprazol 20mg", ean: "7896006050210", curve: "A" as CurveTag, costPrice: 11.80, salePrice: 18.90, active: true },
  { id: "p04", name: "Atorvastatina Cálcica 20mg", ean: "7891058001246", curve: "A" as CurveTag, costPrice: 22.60, salePrice: 35.80, active: true },
  { id: "p05", name: "Amoxicilina 500mg", ean: "7896006230116", curve: "A" as CurveTag, costPrice: 14.20, salePrice: 22.40, active: true },
  { id: "p06", name: "Vitamina D3 2000UI", ean: "7898054980068", curve: "B" as CurveTag, costPrice: 19.80, salePrice: 32.90, active: true },
  { id: "p07", name: "Insulina Glargina 100UI/mL", ean: "4018151206110", curve: "A" as CurveTag, costPrice: 148.00, salePrice: 218.90, active: true },
  { id: "p08", name: "Paracetamol 750mg", ean: "7896714160206", curve: "A" as CurveTag, costPrice: 4.80, salePrice: 7.90, active: true },
  { id: "p09", name: "Ibuprofeno 600mg", ean: "7896714240076", curve: "B" as CurveTag, costPrice: 9.20, salePrice: 14.90, active: true },
  { id: "p10", name: "Metformina 850mg", ean: "7896103202013", curve: "A" as CurveTag, costPrice: 7.60, salePrice: 12.40, active: true },
];

const curveColors: Record<CurveTag, string> = {
  A: "bg-primary/15 text-primary ring-primary/20",
  B: "bg-warning/15 text-warning ring-warning/20",
  C: "bg-muted text-muted-foreground ring-border",
};

export default function ProdutosPage() {
  const [query, setQuery] = useState("");
  const [curveFilter, setCurveFilter] = useState<CurveTag | "all">("all");

  const filtered = mockProducts.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.ean.includes(query);
    const matchesCurve = curveFilter === "all" || p.curve === curveFilter;
    return matchesQuery && matchesCurve;
  });

  const margin = (p: typeof mockProducts[0]) =>
    (((p.salePrice - p.costPrice) / p.salePrice) * 100).toFixed(0);

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title="Produtos"
        description="Catálogo ativo com curva ABC, preços e margem. Classificação atualizada automaticamente pelo modelo."
      />

      <PageBody>
        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome ou EAN…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-surface pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(["all", "A", "B", "C"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurveFilter(c)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  curveFilter === c
                    ? "bg-surface-elevated text-foreground ring-1 ring-border"
                    : "text-muted-foreground hover:bg-surface"
                }`}
              >
                {c === "all" ? "Todos" : `Curva ${c}`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
          <div className="border-b border-border/60 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto_auto] items-center gap-4">
              <span className="w-9" />
              <span>Produto</span>
              <span className="hidden w-28 text-right sm:block">Custo</span>
              <span className="hidden w-24 text-right sm:block">Preço</span>
              <span className="w-20 text-right">Margem</span>
              <span className="w-16 text-center">Curva</span>
            </div>
          </div>
          <ul className="divide-y divide-border/60">
            {filtered.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-hover/60"
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted ring-1 ring-border">
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {p.ean}
                  </p>
                </div>
                <span className="hidden font-mono text-sm tabular-nums text-muted-foreground sm:block w-28 text-right">
                  R$ {p.costPrice.toFixed(2)}
                </span>
                <span className="hidden font-mono text-sm tabular-nums sm:block w-24 text-right">
                  R$ {p.salePrice.toFixed(2)}
                </span>
                <span className="font-mono text-sm font-semibold tabular-nums text-primary w-20 text-right">
                  {margin(p)}%
                </span>
                <div className="flex w-16 justify-center">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${curveColors[p.curve]}`}
                  >
                    {p.curve}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum produto encontrado.
              </p>
            </div>
          )}
        </div>
      </PageBody>
    </>
  );
}
