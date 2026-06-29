"use client";

import { ChevronDown, Store } from "lucide-react";
import { useStores } from "@/hooks/useQueries";
import type { StoreResponseDTO } from "@/types";

interface StoreSelectorProps {
  value: string;
  onChange: (storeId: string) => void;
}

export function StoreSelector({ value, onChange }: StoreSelectorProps) {
  const { data: stores, isLoading } = useStores();

  const selected = stores?.find((s: StoreResponseDTO) => s.id === value);

  if (isLoading) {
    return (
      <div className="flex h-8 w-48 animate-pulse items-center gap-2 rounded-md border border-border/60 bg-surface px-3">
        <div className="h-3 w-3 rounded bg-muted" />
        <div className="h-3 flex-1 rounded bg-muted" />
      </div>
    );
  }

  if (!stores?.length) return null;

  return (
    <div className="relative">
      <Store className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 appearance-none rounded-md border border-border/60 bg-surface pl-8 pr-7 text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-surface-elevated focus:outline-none focus:ring-1 focus:ring-primary/40"
      >
        {!value && (
          <option value="" disabled>
            Selecionar loja…
          </option>
        )}
        {stores.map((store: StoreResponseDTO) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
