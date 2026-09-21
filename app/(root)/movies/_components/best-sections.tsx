"use client";
import React, { useMemo } from "react";
import { TmdbResult } from "@/types/tmdb";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { BLUR_BACKDROP } from "@/lib/blur";
import { Badge } from "@/components/ui/badge";
import { getGenre } from "@/utils/getGenre";
import {
  BookMarked,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Star,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import ThumCard from "@/app/(root)/movies/_components/thum-card";

import dynamic from "next/dynamic";
import Link from "next/link";

const Swiper = dynamic(() => import("@/components/ui/swiper-client"), {
  ssr: false,
  loading: () => null,
});

export default function BestSections({
  main,
  mainTitle,
  mainType,
  slideOne,
  slideTwo,
  slideOneTitle,
  slideTwoTitle,
  slideOneType,
  slideTwoType,
}: {
  main: TmdbResult[];
  mainTitle?: string;
  mainType: "movie" | "tv";
  slideOne: TmdbResult[];
  slideTwo: TmdbResult[];
  slideOneTitle?: string;
  slideTwoTitle?: string;
  slideOneType: "movie" | "tv";
  slideTwoType: "movie" | "tv";
}) {
  const getYear = (date: string) => {
    return new Date(date).getFullYear() || new Date().getFullYear();
  };
  return (
    <section className="px-4 lg:px-14 mt-14 flex flex-wrap gap-5">
      <div className="rounded-xl h-[50vh] max-h-[550px] w-[100%] lg:w-auto lg:flex-2 overflow-hidden flex flex-col">
        <div className="py-4 flex items-center justify-between">
          <p className="text-xl font-extrabold">
            {mainTitle ? mainTitle : "Up Coming"}
          </p>
          <div className="flex">
            <button
              type="button"
              className="size-8 hover:bg-muted rounded-full grid place-items-center cursor-pointer upcoming-prev">
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="size-8 hover:bg-muted rounded-full grid place-items-center cursor-pointer upcoming-next">
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="w-full flex-1">
          <Swiper
            slides={main.map((info) => (
              <div
                key={info.id}
                className="relative size-full transition-all duration-500">
                <ImageWithFallback
                  src={
                    info.backdrop_path
                      ? `https://image.tmdb.org/t/p/w500${info.backdrop_path}`
                      : null
                  }
                  fill
                  // objectFit="cover"
                  alt="movie-cover"
                  placeholder="blur"
                  blurDataURL={BLUR_BACKDROP}
                  className="-z-10 size-full object-cover mask-b-from-10% rounded-xl"
                />
                <div className="p-4 h-full flex flex-col items-start justify-end gap-2">
                  <Badge>{mainType === "movie" ? "Movie" : "Serie"}</Badge>
                  <p className="text-3xl font-extrabold truncate max-w-xl">
                    {info.title || info.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {info.vote_average.toFixed(1)}{" "}
                    <Star
                      size={14}
                      className="fill-amber-300 stroke-0 inline-block -translate-y-0.5"
                    />{" "}
                    | {getYear(info.release_date)} •{" "}
                    {info.genre_ids
                      .map((id) => getGenre("movies", id))
                      .filter((g) => g !== "")
                      .join(" • ")}
                  </p>
                  <p className="line-clamp-2 max-w-md">{info.overview}</p>
                  <div className="flex max-sm:justify-center gap-4 mt-5">
                    <Link href={`/${mainType === "movie" ? "movies" : "series"}/${info.id}`} className={buttonVariants()} >
                      <CirclePlay /> Watch Now
                    </Link>
                    <Button variant="outline">
                      <BookMarked /> Add Watchlist
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            slidesPerView={1}
            spaceBetween={10}
            className="h-full"
            modules={["autoplay", "navigation", "effectFade"]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".upcoming-next",
              prevEl: ".upcoming-prev",
            }}
            effect={"fade"}
            fadeEffect={{
              crossFade: true,
            }}
            speed={800}
            loop
          />
        </div>
      </div>
      <TopRated data={slideOne} type={slideOneType} title={slideOneTitle} />
      <TopRated data={slideTwo} type={slideTwoType} title={slideTwoTitle} />
    </section>
  );
}

const TopRated = ({
  data,
  type,
  title,
}: {
  data: TmdbResult[];
  type: "movie" | "tv";
  title?: string;
}) => {
  const { nextBtnClass, prevBtnClass } = useMemo(() => {
    const id = `top-rated-${type}`;
    return {
      nextBtnClass: `next-btn-${id}`,
      prevBtnClass: `prev-btn-${id}`,
    };
  }, [type]);

  return (
    <div className="rounded-xl h-[50vh] max-h-[550px] w-[100%] md:flex-1 lg:w-auto overflow-hidden flex flex-col">
      <div className="py-4 flex items-center justify-between">
        <p className="text-xl font-extrabold">
          {title ? title : `Top ${type === "movie" ? "Movies" : "Series"}`}
        </p>
        <div className="flex items-center justify-center">
          <button
            type="button"
            className={`size-8 hover:bg-muted rounded-full grid place-items-center cursor-pointer ${prevBtnClass}`}>
            <ChevronLeft />
          </button>
          <button
            type="button"
            className={`size-8 hover:bg-muted rounded-full grid place-items-center cursor-pointer ${nextBtnClass}`}>
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Swiper
          slides={data.map((info) => (
            <ThumCard key={info.id} info={info} varient="shortest" type={type} />
          ))}
          direction="vertical"
          slidesPerView={3}
          spaceBetween={10}
          className="h-full parent-grayscale-effect"
          modules={["autoplay", "navigation"]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            stopOnLastSlide: false,
          }}
          navigation={{
            nextEl: "." + nextBtnClass,
            prevEl: "." + prevBtnClass,
          }}
          speed={800}
          loop
          slidesPerGroup={3}
          slideClassName="h-auto child-grayscale-effect"
        />
      </div>
    </div>
  );
};
