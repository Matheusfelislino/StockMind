"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  PackageX,
  Coins,
  CalendarClock,
  Package,
  Store,
  Settings,
  Search,
  Bell,
  Command,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
};

const nav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/recomendacoes", label: "Recomendações", icon: Sparkles, badge: 24 },
  { href: "/dashboard/ruptura", label: "Ruptura", icon: PackageX },
  { href: "/dashboard/capital", label: "Capital Travado", icon: Coins },
  { href: "/dashboard/vencimento", label: "Vencimento", icon: CalendarClock },
  { href: "/dashboard/produtos", label: "Produtos", icon: Package },
  { href: "/dashboard/lojas", label: "Lojas", icon: Store },
];

function SidebarNav({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 px-5">
        <div className="relative grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_-4px_oklch(0.78_0.16_158_/_0.6)]">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M4 7l8-4 8 4M4 7v10l8 4 8-4V7M4 7l8 4 8-4M12 11v10"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            StockMind
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Intelligence
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 pb-3">
        <button className="group flex w-full items-center gap-2 rounded-md border border-border/60 bg-surface/50 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface">
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="flex items-center gap-0.5 rounded border border-border/60 bg-background/50 px-1.5 py-0.5 font-mono text-[10px]">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-3">
        <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
          Workspace
        </p>
        <ul className="space-y-0.5 pb-4">
          {nav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onLinkClick}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-all",
                    active
                      ? "bg-surface text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0_/_0.05)]"
                      : "text-sidebar-foreground hover:bg-surface/60 hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={cn("h-4 w-4 shrink-0", active && "text-primary")}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
          System
        </p>
        <ul className="space-y-0.5 pb-4">
          <li>
            <Link
              href="/dashboard/settings"
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors",
                pathname.startsWith("/dashboard/settings")
                  ? "bg-surface text-foreground"
                  : "text-sidebar-foreground hover:bg-surface/60 hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Link>
          </li>
        </ul>
      </ScrollArea>

      {/* User */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 rounded-md p-1.5">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-accent to-primary text-[11px] font-semibold text-primary-foreground">
            MR
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-xs font-medium"> Maria Clara Signorini</p>
            <p className="truncate text-[10px] text-muted-foreground">
              DrogaRede · 142 lojas
            </p>
          </div>
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.78_0.16_158)]" />
        </div>
      </div>
    </div>
  );
}

function titleForPath(p: string): string {
  if (p === "/dashboard") return "Dashboard";
  if (p.startsWith("/dashboard/recomendacoes")) return "Recomendações";
  if (p.startsWith("/dashboard/ruptura")) return "Ruptura";
  if (p.startsWith("/dashboard/capital")) return "Capital Travado";
  if (p.startsWith("/dashboard/vencimento")) return "Vencimento";
  if (p.startsWith("/dashboard/produtos")) return "Produtos";
  if (p.startsWith("/dashboard/lojas")) return "Lojas";
  if (p.startsWith("/dashboard/settings")) return "Configurações";
  return "";
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[244px] shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <SidebarNav />
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[244px] p-0">
          <SidebarNav onLinkClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
          <div className="flex items-center gap-3 text-sm">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="hidden text-muted-foreground sm:inline">StockMind</span>
            <span className="hidden text-muted-foreground/40 sm:inline">/</span>
            <span className="font-medium">{titleForPath(pathname)}</span>
            <span className="ml-3 hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary md:inline-flex">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Live · sync 2m ago
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <button className="hidden h-8 items-center gap-2 rounded-md border border-border/60 bg-surface px-3 text-xs font-medium text-foreground transition-colors hover:bg-surface-elevated sm:inline-flex">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Ask StockMind
            </button>
          </div>
        </header>

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
