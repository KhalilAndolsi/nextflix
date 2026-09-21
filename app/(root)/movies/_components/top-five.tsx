"use client";
import { TmdbResult } from "@/types/tmdb";
import React from "react";

import dynamic from "next/dynamic";
const Swiper = dynamic(() => import("@/components/ui/swiper-client"), {
  ssr: false,
  loading: () => <div className="min-h-[280px]" />,
});
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { Star } from "lucide-react";
import Link from "next/link";
import { BLUR_POSTER } from "@/lib/blur";

export default function TopFive({
  infos,
  type,
}: {
  infos: TmdbResult[];
  type?: "movie" | "tv";
}) {
  return (
    <section className="relative px-4 lg:px-14 overflow-hidden mt-8">
      <div className="mb-8">
        <h3 className="text-lg lg:text-2xl font-bold">Top 5 Evaluation</h3>
      </div>
      <Swiper
        slides={infos.map((info, i) => (
          <Link
            key={info.id}
            href={`/${
              type === "movie" || info.media_type === "movie"
                ? "movies"
                : "series"
            }/${info.id}`}
            className="flex min-w-0">
            <h5 className="grid place-items-center p-4 text-7xl font-bold flex-shrink-0">
              {i + 1}
            </h5>
            <ImageWithFallback
              src={
                info.poster_path
                  ? `https://image.tmdb.org/t/p/w185${info.poster_path}`
                  : null
              }
              width={80}
              height={140}
              alt="Cover"
              sizes="100px"
              placeholder="blur"
              blurDataURL={BLUR_POSTER}
              className="w-[100px] h-auto aspect-[2/3] rounded-xl flex-shrink-0"
            />
            <div className="p-4 flex flex-col justify-end flex-1 min-w-0">
              <h6 className="font-bold text-lg truncate min-w-0">
                {info.title || info.name}
              </h6>
              <p>Herro - Action</p>
              <p className="space-x-3">
                <span>
                  <Star
                    className="inline-block fill-amber-300 stroke-amber-300 mr-2"
                    size={16}
                  />
                  {info.vote_average.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  |{" "}
                  {type === "movie" || info.media_type === "movie"
                    ? "Movie"
                    : "Serie"}
                </span>
              </p>
            </div>
          </Link>
        ))}
        slidesPerView={1}
        spaceBetween={15}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1280: {
            slidesPerView: 3,
          },
          1836: {
            slidesPerView: 5,
          },
        }}
        grabCursor
        className="mask-x-from-95% parent-blur-effect"
        slideClassName="child-blur-effect"
      />
    </section>
  );
}
