"use client";

import { useEffect, useState } from "react";
import ContinueWatching, {
  type ContinueWatchingItem,
} from "@/app/(root)/movies/_components/continue-watching";

export default function ContinueWatchingSection() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/library/history", { signal: controller.signal })
      .then((res) => res.json())
      .then((payload) => setItems(payload.data ?? []))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (items.length === 0) return null;

  return <ContinueWatching items={items} />;
}
