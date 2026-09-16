"use client";
import React from "react";
import Image from "next/image";
import { BLUR_BACKDROP } from "@/lib/blur";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { BookMarked, CirclePlay, Star } from "lucide-react";
import { TmdbResult } from "@/types/tmdb";
import { getGenre } from "@/utils/getGenre";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Link from "next/link";

export default function HeroSection({ data }: { data: TmdbResult[] }) {
  const getYear = (date: string) => {
    return new Date(date).getFullYear() || new Date().getFullYear();
  };

  return (
    <section className="h-[55vh] max-h-[550px]">
      <Swiper
        slidesPerView={1}
        className="size-full"
        effect={"fade"}
        speed={1500}
        loop
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        fadeEffect={{
          crossFade: true,
        }}
        modules={[EffectFade, Autoplay]}>
        {data.map((info, i) => (
          <SwiperSlide key={info.id} className="size-full swiper-no-swiping">
            <div className="size-full relative">
              {/* Next.js Image component for optimized background */}
              <Image
                src={`https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${info.backdrop_path}`}
                alt={info.title || info.name || "Movie backdrop"}
                fill
                // objectFit="cover"
                priority={i === 0} // Priority loading for first slide
                sizes="100vw"
                placeholder="blur"
                blurDataURL={BLUR_BACKDROP}
                className="object-center object-cover -z-10 mask-t-from-30% mask-b-from-50% mask-b-to-98%"
                quality={85}
              />
              <div className="size-full flex flex-col justify-end gap-2.5 md:gap-4 px-4 md:px-14 py-8 relative z-10">
                <Badge>{info.media_type === "tv" ? "Serie" : "Movie"}</Badge>
                <p className="text-3xl lg:text-5xl font-extrabold truncate lg:leading-16">
                  {info.title || info.name}
                </p>
                <p className="text-sm">
                  {info.vote_average.toFixed(1)} <Star size={14} className="fill-amber-300 stroke-0 inline-block -translate-y-0.5" /> | {getYear(info.release_date)} •{" "}
                  {info.genre_ids
                    .map((id) => getGenre("movies", id)).filter(g => g !== "")
                    .join(" • ")}
                </p>
                <p className="max-w-2xl line-clamp-2">
                  {info.overview}
                </p>
                <div className="flex max-sm:justify-center gap-4">
                  <Link href={`/${info.media_type === "tv" ? "series" : "movies"}/${info.id}`} className={buttonVariants()}>
                    <CirclePlay /> Watch Now
                  </Link>
                  <Button variant="outline">
                    <BookMarked /> Add Watchlist
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}