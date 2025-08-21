import { TmdbMovieDetails, TmdbTvDetails, Video } from "@/types/tmdb";
import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";
import { BookMarked, Star } from "lucide-react";
import { Button } from "../ui/button";
import TrailerPopupButton from "../features/trailer-popup-button";
import { getVideos } from "@/data/tmdb";

export default async function Cover({
  info,
  type,
}: {
  info: TmdbMovieDetails | TmdbTvDetails;
  type: "movie" | "tv";
}) {
  const getYear = (date: string) => {
    return new Date(date).getFullYear() || new Date().getFullYear();
  };
  const videos = await getVideos(type, info.id);
  const trailers = videos.filter(v => v.type === "Trailer")
  return (
    <section className="relative h-[70vh] max-h-[550px] transition-all duration-500 mb-8">
      <Image
        src={`https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${info.backdrop_path}`}
        alt="backdrop"
        fill
        objectFit="cover"
        sizes="100vw"
        className="object-left md:object-bottom -z-10 mask-t-from-30% mask-b-from-50% mask-b-to-98%"
        quality={85}
      />
      <div className="size-full flex flex-col items-center justify-end md:justify-start gap-2 md:flex-row md:items-end md:gap-5 px-4 md:px-14 py-8 relative z-10">
        <Image
          src={`https://image.tmdb.org/t/p/w500${info.poster_path}`}
          width={150}
          height={250}
          alt="poster"
          className="!w-36 md:!w-60 xl:!w-70 aspect-2/3 rounded-xl shadow-[0_0_25px_2px_black]"
        />
        <div className="flex flex-col justify-end gap-2.5 md:gap-4">
          <Badge>{info.media_type === "tv" ? "Serie" : "Movie"}</Badge>
          <p className="text-3xl lg:text-5xl font-extrabold lg:leading-16">
            {info.title || info.name}
          </p>
          <p className="text-sm">
            {info.vote_average.toFixed(1)}{" "}
            <Star
              size={14}
              className="fill-amber-300 stroke-0 inline-block -translate-y-0.5"
            />{" "}
            | {getYear(info.release_date)} •{" "}
            {info.genres.map(({ name }) => name).join(" • ")}
          </p>
          <p className="max-w-2xl line-clamp-2">{info.overview}</p>
          <div className="flex max-sm:justify-center gap-4">
            <TrailerPopupButton trailers={trailers} />
            <Button variant="outline">
              <BookMarked /> Add Watchlist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
