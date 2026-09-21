"use client";

import type { ReactNode } from "react";
import { useSession } from "@/lib/auth-client";
import WatchRequired from "@/components/features/watch-required";

export default function PlayerGate({
  backTo,
  children,
}: {
  backTo: string;
  children: ReactNode;
}) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="w-full aspect-video mx-auto mb-5 rounded-xl bg-muted animate-pulse" />
    );
  }

  if (!session?.user) {
    return <WatchRequired backTo={backTo} />;
  }

  return <>{children}</>;
}
