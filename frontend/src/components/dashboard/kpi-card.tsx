"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { KPI } from "@/types";

function Sparkline({ data, tone }: { data: number[]; tone: KPI["tone"] }) {
  const w = 140;
  const h = 40;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  const color =
    tone === "danger"
      ? "var(--destructive)"
      : tone === "warning"
        ? "var(--warning)"
        : "var(--primary)";

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-10 w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`sp-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        fill={`url(#sp-${tone})`}
        points={`0,${h} ${points} ${w},${h}`}
      />
    </svg>
  );
}

export function KpiCard({ kpi, index }: { kpi: KPI; index: number }) {
  const isDown = kpi.trend === "down";
  const Arrow = isDown ? ArrowDownRight : ArrowUpRight;
  const goodDirection = kpi.tone === "warning" && isDown;
  const deltaColor = goodDirection
    ? "text-primary"
    : kpi.tone === "danger"
      ? "text-destructive"
      : "text-warning";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface p-6 transition-all hover:border-border hover:bg-surface-elevated"
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            kpi.tone === "danger"
              ? "var(--destructive)"
              : kpi.tone === "warning"
                ? "var(--warning)"
                : "var(--primary)",
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {kpi.label}
          </p>
          <span
            className={`inline-flex items-center gap-0.5 rounded-full bg-background/60 px-1.5 py-0.5 text-[11px] font-medium ${deltaColor}`}
          >
            <Arrow className="h-3 w-3" />
            {kpi.delta}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <h2 className="text-4xl font-semibold tracking-tight text-gradient">
            {kpi.value}
          </h2>
          <div className="w-32 shrink-0">
            <Sparkline data={kpi.spark} tone={kpi.tone} />
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {kpi.description}
        </p>
      </div>
    </motion.div>
  );
}
