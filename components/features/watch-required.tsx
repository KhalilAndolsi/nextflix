import Link from "next/link";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function WatchRequired({ backTo = "/" }: { backTo?: string }) {
  return (
    <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-xl border border-border bg-card p-8 text-center">
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="size-full bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.4),transparent_60%)]" />
      </div>
      <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/20">
        <Lock className="size-8 text-primary" />
      </div>
      <div className="relative space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Sign in to watch
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          You need an account to watch movies and TV series on Nextflix. Sign
          in or create one — it only takes a moment.
        </p>
      </div>
      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/sign-in?next=${encodeURIComponent(backTo)}`}
          className={buttonVariants({ size: "lg" })}
        >
          <LogIn />
          Sign in
        </Link>
        <Link
          href={`/sign-up?next=${encodeURIComponent(backTo)}`}
          className={buttonVariants({ size: "lg", variant: "outline" })}
        >
          <UserPlus />
          Create account
        </Link>
      </div>
    </div>
  );
}