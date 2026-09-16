"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeFromLibrary } from "@/lib/library-actions";

type LibraryRemoveButtonProps = {
  mediaId: number;
  mediaType: "movie" | "tv";
  kind: "WATCHLIST" | "FAVORITE" | "HISTORY";
};

export default function LibraryRemoveButton({
  mediaId,
  mediaType,
  kind,
}: LibraryRemoveButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await removeFromLibrary(mediaId, mediaType, kind);
      router.refresh();
      toast.success("Removed from your library");
    });
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleClick}
      disabled={isPending}
      className="size-8 rounded-full bg-black/60 text-white/80 hover:bg-black/80 hover:text-white"
      aria-label="Remove"
    >
      <X className="size-4" />
    </Button>
  );
}