"use client";
import React from "react";
import dynamic from "next/dynamic";

import { BilledCastSkeleton } from "./skeletons";
const Swiper = dynamic(() => import("@/components/ui/swiper-client"), {
  ssr: false,
  loading: () => <BilledCastSkeleton />,
});

import { CastMember } from "@/types/tmdb";
import Image from "next/image";
import { BLUR_POSTER } from "@/lib/blur";
import { Separator } from "../ui/separator";

export default function BilledCast({ casts }: { casts: CastMember[] }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-medium">Top Billed Cast</h2>
      <Swiper
        slides={casts
          .filter((cast) => cast.profile_path)
          .map((cast) => (
            <div
              key={cast.id}
              className="overflow-hidden rounded-xl bg-primary/20 group">
              <Image
                src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                alt={cast.name}
                width={100}
                height={200}
                sizes="(max-width: 682px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 16vw, 12vw"
                placeholder="blur"
                blurDataURL={BLUR_POSTER}
                className=" max-h-[150px] w-full object-cover group-hover:scale-90 origin-[50%_30%] transition-all group-hover:rounded-lg"
              />
              <p className="px-4 py-2 *:block *:truncate">
                <span className="font-medium" title={cast.name}>
                  {cast.name}
                </span>
                <span className="text-xs">{cast.character}</span>
              </p>
            </div>
          ))}
        slidesPerView={3}
        spaceBetween={5}
        breakpoints={{
          682: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 6,
            spaceBetween: 10,
          },
          1536: {
            slidesPerView: 8,
            spaceBetween: 15,
          },
        }}
        grabCursor
        className="max-h-[250px] select-none"
      />
      {/* <Link
        href="/"
        className="text-end transition-colors hover:text-foreground/50 text-sm p-2 block">
        Full Cast & Crew
      </Link> */}
      <Separator orientation="horizontal" className="bg-white/50 mt-5" />
    </div>
  );
}
