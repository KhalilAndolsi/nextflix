"use client";

import { Episode, TmdbTvDetails } from "@/types/tmdb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useQueryState, parseAsInteger } from "nuqs";
import { revalidateMyPath } from "@/lib/revalidate-path";
import { useEffect, useRef, useState } from "react";

export default function SeriesStreamingController({
  info,
}: {
  info: TmdbTvDetails;
}) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [season, setSeason] = useQueryState(
    "s",
    parseAsInteger.withDefault(info.seasons[0].season_number)
  );
  const [episode, setEpisode] = useQueryState(
    "ep",
    parseAsInteger.withDefault(
      episodes.length > 0 ? episodes[0].episode_number : 1
    )
  );

  const fetchSeasonDetails = async (s: number) => {
    const response = await fetch(
      `/api/streaming/serie/${info.id}/season${s ? `?s=${s}` : ""}`
    );
    const data = await response.json();
    setEpisodes(data.data as Episode[]);
  };
  useEffect(() => {
    fetchSeasonDetails(season);
  }, [season]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [episodes]); // Scroll to bottom when episodes change
  return (
    <div className="grid grid-cols-12 w-full px-4 lg:px-14 gap-3 mb-5">
      <div className="col-span-full lg:col-span-9">
        <iframe
          src={`https://multiembed.mov/directstream.php?video_id=${info.id}&tmdb=1&s=${season}&e=${episode}`}
          className="w-full aspect-video mx-auto rounded-xl bg-[url(/assets/images/no-vd.png)] bg-repeat bg-center"
          style={{ backgroundSize: 100 }}
          allowFullScreen
        />
      </div>
      <div className="max-lg:min-h-[500px] col-span-full lg:col-span-3 p-2 flex flex-col gap-2">
        <label htmlFor="">Select The Season</label>
        <Select
          defaultValue={season.toString()}
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
        <div className="flex-grow relative overflow-hidden">
          <div ref={scrollRef} className="hidden-scrollbar absolute left-0 top-0 size-full overflow-hidden overflow-y-scroll space-y-2">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => setEpisode(ep.episode_number)}
                className="flex p-1 gap-2 cursor-pointer rounded-xl overflow-hidden border hover:border-gray-400">
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
