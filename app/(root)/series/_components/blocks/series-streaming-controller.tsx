"use client";

import { Episode, TmdbTvDetails } from "@/types/tmdb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useQueryState, parseAsInteger } from "nuqs";
import { revalidateMyPath } from "@/lib/revalidate-path";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import WatchRequired from "@/components/features/watch-required";
import TrackPlay from "@/components/features/track-play";

export default function SeriesStreamingController({
  info,
  isLoggedIn,
  backTo,
}: {
  info: TmdbTvDetails;
  isLoggedIn: boolean;
  backTo: string;
}) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [season, setSeason] = useQueryState(
    "s",
    parseAsInteger.withDefault(info.seasons[0].season_number)
  );
  const [episode, setEpisode] = useQueryState("ep", parseAsInteger.withDefault(1));
  const [reverse, setReverse] = useState(false);

  const fetchSeasonDetails = useCallback(
    async (s: number) => {
      const response = await fetch(
        `/api/streaming/serie/${info.id}/season${s ? `?s=${s}` : ""}`
      );
      const data = await response.json();
      setEpisodes(data.data as Episode[]);
    },
    [info.id]
  );

  useEffect(() => {
    fetchSeasonDetails(season);
  }, [fetchSeasonDetails, season]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const episodeRefs = useRef(new Map<number, HTMLDivElement>());

  const sortedSeasons = useMemo(
    () => [...info.seasons].sort((a, b) => a.season_number - b.season_number),
    [info.seasons]
  );
  const currentSeasonIndex = sortedSeasons.findIndex(
    (s) => s.season_number === season
  );
  const prevSeason =
    currentSeasonIndex > 0 ? sortedSeasons[currentSeasonIndex - 1] : null;
  const nextSeason =
    currentSeasonIndex >= 0 && currentSeasonIndex < sortedSeasons.length - 1
      ? sortedSeasons[currentSeasonIndex + 1]
      : null;

  const sortedEpisodes = useMemo(
    () => [...episodes].sort((a, b) => a.episode_number - b.episode_number),
    [episodes]
  );
  const hasEpisodes = sortedEpisodes.length > 0;
  const firstEpisode = sortedEpisodes[0];
  const lastEpisode = sortedEpisodes[sortedEpisodes.length - 1];
  const isFirstEpisode = hasEpisodes && episode <= firstEpisode.episode_number;
  const isLastEpisode = hasEpisodes && episode >= lastEpisode.episode_number;

  const displayEpisodes = reverse ? [...sortedEpisodes].reverse() : sortedEpisodes;

  const prevDisabled = !hasEpisodes || (isFirstEpisode && !prevSeason);
  const nextDisabled = !hasEpisodes || (isLastEpisode && !nextSeason);

  const handlePrev = () => {
    if (!hasEpisodes) return;
    if (!isFirstEpisode) {
      setEpisode(episode - 1);
      return;
    }
    if (prevSeason) {
      setSeason(prevSeason.season_number);
      setEpisode(Math.max(1, prevSeason.episode_count));
      revalidateMyPath(`/series/${info.id}`);
    }
  };

  const handleNext = () => {
    if (!hasEpisodes) return;
    if (!isLastEpisode) {
      setEpisode(episode + 1);
      return;
    }
    if (nextSeason) {
      setSeason(nextSeason.season_number);
      setEpisode(1);
      revalidateMyPath(`/series/${info.id}`);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    const target = episodeRefs.current.get(episode);
    if (!container || !target) return;
    const top = target.offsetTop;
    const bottom = top + target.offsetHeight;
    if (top < container.scrollTop) {
      container.scrollTop = Math.max(0, top - 8);
    } else if (bottom > container.scrollTop + container.clientHeight) {
      container.scrollTop = bottom - container.clientHeight + 8;
    }
  }, [episode, episodes, reverse]);

  return (
    <div className="grid grid-cols-12 w-full px-4 lg:px-14 gap-3 mb-5">
      <div className="col-span-full lg:col-span-9">
        {isLoggedIn ? (
          <>
            <iframe
              src={`https://embedmaster.link/v2kuqe45ne6onejhmq/tv/${info.id}/${season}/${episode}`}
              className="w-full aspect-video mx-auto rounded-xl bg-[url(/assets/images/no-vd.png)] bg-repeat bg-center"
              style={{ backgroundSize: 100 }}
              allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *"
              allowFullScreen
            />
            <TrackPlay
              mediaId={info.id}
              mediaType="tv"
              season={season}
              episode={episode}
            />
            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handlePrev}
                disabled={prevDisabled}
              >
                <SkipBack />
                {isFirstEpisode && prevSeason ? "Prev season" : "Previous"}
              </Button>
              <p className="shrink-0 text-sm font-medium text-muted-foreground tabular-nums">
                S{season} · E{episode}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleNext}
                disabled={nextDisabled}
              >
                {isLastEpisode && nextSeason ? "Next season" : "Next"}
                <SkipForward />
              </Button>
            </div>
          </>
        ) : (
          <WatchRequired backTo={backTo} />
        )}
      </div>
      <div className="max-lg:min-h-[500px] col-span-full lg:col-span-3 p-2 flex flex-col gap-2">
        <label htmlFor="">Select The Season</label>
        <Select
          value={season.toString()}
          onValueChange={(e) => {
            setSeason(parseInt(e));
            revalidateMyPath(`/series/${info.id}`);
          }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {info.seasons.map((season) => (
              <SelectItem value={`${season.season_number}`} key={season.id}>
                {season.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Episodes</label>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => setReverse((v) => !v)}
          >
            <ArrowUpDown />
            {reverse ? "Oldest first" : "Newest first"}
          </Button>
        </div>
        <div className="flex-grow relative overflow-hidden">
          <div ref={scrollRef} className="hidden-scrollbar absolute left-0 top-0 size-full overflow-hidden overflow-y-scroll space-y-2">
            {displayEpisodes.map((ep) => (
              <div
                key={ep.id}
                ref={(el) => {
                  if (el) episodeRefs.current.set(ep.episode_number, el);
                  else episodeRefs.current.delete(ep.episode_number);
                }}
                onClick={() => setEpisode(ep.episode_number)}
                className={cn(
                  "flex p-1 gap-2 cursor-pointer rounded-xl overflow-hidden border hover:border-gray-400",
                  ep.episode_number === episode
                    ? "border-primary bg-primary/10"
                    : "border-border"
                )}>
                <p className="[writing-mode:vertical-lr] text-center rotate-180">
                  {ep.episode_number}
                </p>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${ep.still_path}`}
                  width={120}
                  height={60}
                  className="w-[100px] h-auto aspect-video object-cover rounded-lg"
                  alt={ep.name}
                />
                <p className="text-sm line-clamp-3">
                  <span className="font-medium">{ep.name}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}