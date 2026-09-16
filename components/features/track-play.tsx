"use client";

import { useEffect, useRef } from "react";
import { recordHistory } from "@/lib/library-actions";

type TrackPlayProps = {
  mediaId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
};

export default function TrackPlay({
  mediaId,
  mediaType,
  season,
  episode,
}: TrackPlayProps) {
  const last = useRef<string>("");

  useEffect(() => {
    const key = `${mediaType}:${mediaId}:${season ?? ""}:${episode ?? ""}`;
    if (last.current === key) return;
    last.current = key;
    recordHistory(mediaId, mediaType, { season, episode });
  }, [mediaId, mediaType, season, episode]);

  return null;
}