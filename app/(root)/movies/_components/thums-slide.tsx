"use client";
import React from "react";
import ThumCard from "@/app/(root)/movies/_components/thum-card";
import { TmdbResult } from "@/types/tmdb";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import dynamic from "next/dynamic";
import { ThumsSlideSkeleton } from "@/components/blocks/skeletons";
const Swiper = dynamic(() => import("@/components/ui/swiper-client"), {
  ssr: false,
  loading: () => <ThumsSlideSkeleton />,
});

type ThumSlideProps = {
  varient: "long" | "short";
  type?: "movie" | "tv";
  title: string;
  href: string;
  infos: TmdbResult[];
};

export default function ThumsSlide({
  varient,
  title,
  type,
  href,
  infos,
}: ThumSlideProps) {
  const swiperCardsSize =
    varient === "long"
      ? {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 10,
          breakpoints: {
            682: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 15,
            },
            1280: {
              slidesPerView: 6,
              slidesPerGroup: 6,
              spaceBetween: 20,
            },
            1536: {
              slidesPerView: 8,
              slidesPerGroup: 4,
              spaceBetween: 30,
            },
          },
        }
      : {
          slidesPerView: 1,
          spaceBetween: 30,
          breakpoints: {
            682: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            1280: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
            1536: {
              slidesPerView: 6,
              slidesPerGroup: 6,
            },
          },
        };
  return (
    <>
      {
        <section className="relative px-4 lg:px-14 mt-10 overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg md:text-2xl font-bold">{title}</h2>
            <Link
              href={href}
              aria-label={`See more ${title}`}
              className="z-10 size-9 aspect-square lg:hover:bg-muted rounded-full cursor-pointer grid place-items-center lg:absolute lg:top-1/2">
              <span className="sr-only">See more {title}</span>
              <ChevronRight size={20} strokeWidth={3} />
            </Link>
          </div>
          {/* container: 640 - 768 - 1024 - 1280 - 1536  */}
          <Swiper
            slides={infos.map((info) => (
              <ThumCard
                key={info.id}
                varient={varient}
                type={type || info.media_type}
                info={info}
              />
            ))}
            {...swiperCardsSize}
            grabCursor
            className="mask-r-from-90%"
          />
        </section>
      }
    </>
  );
}
