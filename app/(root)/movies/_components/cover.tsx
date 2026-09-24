import { TmdbMovieDetails, TmdbTvDetails } from "@/types/tmdb";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Star } from "lucide-react";
import TrailerPopupButton from "../../../../components/features/trailer-popup-button";
import LibraryButton from "@/components/features/library-button";
import { getVideos } from "@/data/tmdb";
import { BLUR_POSTER, BLUR_BACKDROP } from "@/lib/blur";

export default async function Cover({
  info,
  type,
  backTo,
}: {
  info: TmdbMovieDetails | TmdbTvDetails;
  type: "movie" | "tv";
  backTo: string;
}) {
  const getYear = (date: string) => {
    return new Date(date).getFullYear() || new Date().getFullYear();
  };
  const videos = await getVideos(type, info.id);
  const trailers = videos.filter(v => v.type === "Trailer")
  return (
    <section className="relative h-[70vh] max-h-[550px] transition-all duration-500 mb-8">
      <ImageWithFallback
        src={
          info.backdrop_path
            ? `https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${info.backdrop_path}`
            : null
        }
        alt={`${info.title || info.name} backdrop`}
        fill
        priority
        // objectFit="cover"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={BLUR_BACKDROP}
        className="object-left object-cover md:object-bottom -z-10 mask-t-from-30% mask-b-from-50% mask-b-to-98%"
        quality={80}
      />
      <div className="size-full flex flex-col items-center justify-end md:justify-start gap-2 md:flex-row md:items-end md:gap-5 px-4 md:px-14 py-8 relative z-10">
        <ImageWithFallback
        src={
          info.poster_path
            ? `https://image.tmdb.org/t/p/w342${info.poster_path}`
            : null
        }
        width={150}
        height={250}
        alt={`${info.title || info.name} poster`}
        placeholder="blur"
        blurDataURL={BLUR_POSTER}
        sizes="(max-width: 768px) 144px, (max-width: 1280px) 240px, 280px"
        className="!w-36 md:!w-60 xl:!w-70 aspect-2/3 rounded-xl shadow-[0_0_25px_2px_black]"
      />
        <div className="flex flex-col justify-end gap-2.5 md:gap-4">
          <Badge>{info.media_type === "tv" ? "Serie" : "Movie"}</Badge>
          <h1 className="text-3xl lg:text-5xl font-extrabold lg:leading-16">
            {info.title || info.name}
          </h1>
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
            <LibraryButton
              mediaId={info.id}
              mediaType={type}
              kind="WATCHLIST"
              backTo={backTo}
            />
            <LibraryButton
              mediaId={info.id}
              mediaType={type}
              kind="FAVORITE"
              backTo={backTo}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
