import { TmdbResult } from "@/types/tmdb";
import { getGenre } from "@/utils/getGenre";
import { PlayCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ThumCardProps = {
  varient: "long" | "short" | "shortest";
  type: "movie" | "tv";
  info: TmdbResult;
};

export default function ThumCard({ varient, type, info }: ThumCardProps) {
  return (
    <>
      {varient == "long" && (
        <Link
          href={`/${type === "movie" ? "movies" : "series"}/${info.id}`}
          className="block w-full aspect-[2/3] relative overflow-hidden rounded-xl select-none group">
          <Image
            src={`https://image.tmdb.org/t/p/w500${info.poster_path}`}
            alt={info.title || info.name || "Movie poster"}
            fill
            objectFit="cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-center -z-10 mask-b-from-30% group-hover:mask-b-from-0% transition-transform duration-300"
            quality={85}
          />

          <div className="size-full p-3 flex flex-col justify-end relative z-10">
            <h5 className="text-xl font-bold truncate">
              {info.title || info.name}
            </h5>
            <p className="text-sm">
              <Star
                size={16}
                className="fill-amber-300 stroke-amber-300 inline-block -translate-y-0.5 mr-1.5"
              />
              {info.vote_average.toFixed(1)}
              <span className="capitalize text-muted-foreground text-xs">
                {" "}
                | {getGenre("movies", info.genre_ids[0])}{" "}
                {type === "movie" ? "Movie" : "Serie"}
              </span>
            </p>
          </div>

          <PlayCircle
            size={45}
            className="stroke-primary absolute left-1/2 top-1/2 -translate-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
          />
        </Link>
      )}
      {varient == "short" && (
        <Link
          href={`/${type === "movie" ? "movies" : "series"}/${info.id}`}
          className="block group relative">
          <Image
            src={`https://image.tmdb.org/t/p/w500${info.backdrop_path}`}
            width={140}
            height={80}
            alt="cover"
            className="object-cover object-center w-full aspect-video rounded-xl group-hover:mask-b-from-1 transition-all duration-300"
          />
          <div className="p-2">
            <h5 className="truncate font-bold">{info.title || info.name}</h5>
            <p className="text-sm">
              <Star
                size={16}
                className="fill-amber-300 stroke-amber-300 inline-block -translate-y-0.5 mr-1.5"
              />
              {info.vote_average.toFixed(1)}
              <span className="capitalize text-muted-foreground">
                {" "}
                | {getGenre("movies", info.genre_ids[0])}{" "}
                {type === "movie" ? "Movie" : "Serie"}
              </span>
            </p>
          </div>
          <PlayCircle
            size={45}
            className="stroke-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          />
        </Link>
      )}
      {varient == "shortest" && (
        <Link
          href={`/${type === "movie" ? "movies" : "series"}/${info.id}`}
          className="flex items-start shrink max-w-full h-full overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w500${info.poster_path}`}
            width={80}
            height={160}
            alt="cover"
            className="object-cover object-center h-full rounded-xl"
          />
          <div className="px-2">
            <p className="truncate font-bold w-full">{info.title || info.name}</p>
            <p className="text-sm">
              <Star
                size={16}
                className="fill-amber-300 stroke-amber-300 inline-block -translate-y-0.5 mr-1.5"
              />
              {info.vote_average.toFixed(1)}
              <span className="capitalize text-muted-foreground">
                {" "}
                | {getGenre("movies", info.genre_ids[0])}{" "}
                {type === "movie" ? "Movie" : "Serie"}
              </span>
            </p>
          </div>
        </Link>
      )}
    </>
  );
}
