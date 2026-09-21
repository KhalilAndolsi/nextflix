"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { BookMarked, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLibraryStatus, toggleLibrary } from "@/lib/library-actions";

type LibraryButtonProps = {
  mediaId: number;
  mediaType: "movie" | "tv";
  kind: "WATCHLIST" | "FAVORITE";
  initialActive?: boolean;
  backTo: string;
};

export default function LibraryButton({
  mediaId,
  mediaType,
  kind,
  initialActive,
  backTo,
}: LibraryButtonProps) {
  const router = useRouter();
  const [active, setActive] = useState(initialActive ?? false);
  const [isPending, startTransition] = useTransition();

  const isWatchlist = kind === "WATCHLIST";
  const label = isWatchlist ? "Watchlist" : "Favorites";

  useEffect(() => {
    if (initialActive !== undefined) return;
    let cancelled = false;
    getLibraryStatus(mediaId, mediaType)
      .then((status) => {
        if (cancelled) return;
        setActive(isWatchlist ? status.watchlist : status.favorite);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [initialActive, isWatchlist, mediaId, mediaType]);

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleLibrary(mediaId, mediaType, kind);
      if ("error" in result) {
        router.push(`/sign-in?next=${encodeURIComponent(backTo)}`);
        return;
      }
      setActive(result.added);
      router.refresh();
      toast.success(
        result.added ? `Added to ${label}` : `Removed from ${label}`
      );
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={isPending}
      aria-label={active ? `In ${label}` : `Add to ${label}`}
      className={
        active
          ? "border-primary text-primary hover:border-primary hover:text-primary"
          : undefined
      }
    >
      {isWatchlist ? (
        <BookMarked fill={active ? "currentColor" : "none"} />
      ) : (
        <Heart fill={active ? "currentColor" : "none"} />
      )}
      <span className="hidden sm:inline">
        {active ? `In ${label}` : `Add to ${label}`}
      </span>
    </Button>
  );
}