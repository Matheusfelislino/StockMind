"use client";

import {
  Area,
  ComposedChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import { forecastData, storeHeatmap } from "@/lib/mock-data";

export function ForecastChart() {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Forecast de Demanda
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Projeção 30 dias · intervalo de confiança 90%
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <ChartLegend color="oklch(0.96 0.005 270)" label="Real" />
          <ChartLegend color="var(--primary)" label="Previsto" dashed />
          <ChartLegend color="var(--primary)" label="Banda 90%" area />
        </div>
      </div>
      <div className="mt-4 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={forecastData}
            margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
          >
            <defs>
              <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.96 0.005 270)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="oklch(0.96 0.005 270)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="oklch(1 0 0 / 0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 8px 24px -8px rgba(0,0,0,0.5)",
              }}
              cursor={{
                stroke: "var(--primary)",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#bandFill)"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="var(--background)"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="oklch(0.96 0.005 270)"
              strokeWidth={2}
              fill="url(#actualFill)"
              connectNulls={false}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="var(--primary)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartLegend({
  color,
  label,
  dashed,
  area,
}: {
  color: string;
  label: string;
  dashed?: boolean;
  area?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      {area ? (
        <span
          className="h-2 w-4 rounded-sm"
          style={{
            background: `linear-gradient(to bottom, ${color}33, transparent)`,
          }}
        />
      ) : (
        <span
          className="h-0.5 w-4"
          style={{
            background: color,
            opacity: dashed ? 0.8 : 1,
            borderTop: dashed ? `2px dashed ${color}` : undefined,
          }}
        />
      )}
      {label}
    </span>
  );
}

function getHeatColor(health: number): string {
  if (health < 50)
    return "linear-gradient(135deg, oklch(0.4 0.16 25 / 0.5), oklch(0.3 0.1 25 / 0.4))";
  if (health < 70)
    return "linear-gradient(135deg, oklch(0.5 0.14 75 / 0.4), oklch(0.32 0.08 75 / 0.3))";
  if (health < 85)
    return "linear-gradient(135deg, oklch(0.4 0.06 240 / 0.4), oklch(0.28 0.04 240 / 0.3))";
  return "linear-gradient(135deg, oklch(0.45 0.14 158 / 0.4), oklch(0.28 0.08 158 / 0.3))";
}

function Swatch({ tone }: { tone: "critical" | "high" | "medium" | "low" }) {
  const map = {
    critical: "var(--destructive)",
    high: "var(--warning)",
    medium: "oklch(0.55 0.08 240)",
    low: "var(--primary)",
  };
  return (
    <span
      className="h-2 w-2 rounded-sm"
      style={{ background: map[tone], opacity: 0.7 }}
    />
  );
}

export function StoreHeatmap() {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Heatmap de Lojas
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Saúde operacional · 12 lojas em foco
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <Swatch tone="critical" /> Crítico
          <Swatch tone="high" /> Alto
          <Swatch tone="medium" /> Médio
          <Swatch tone="low" /> Saudável
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {storeHeatmap.map((store, i) => (
          <motion.div
            key={store.code}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-border/60 p-2.5 transition-transform hover:scale-[1.03]"
            style={{ background: getHeatColor(store.health) }}
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="font-mono text-[9px] font-semibold text-foreground/90">
                  {store.code}
                </p>
                <p className="mt-0.5 truncate text-[10px] font-medium text-foreground">
                  {store.name}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <span className="font-mono text-base font-semibold tabular-nums">
                  {store.health}
                </span>
                <span className="font-mono text-[9px] text-foreground/70">
                  R${store.revenue}M
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
