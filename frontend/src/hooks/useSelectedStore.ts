"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "stockmind_selected_store";

export function useSelectedStore() {
  const [storeId, setStoreId] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setStoreId(saved);
  }, []);

  const selectStore = (id: string) => {
    setStoreId(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  return { storeId, selectStore };
}
