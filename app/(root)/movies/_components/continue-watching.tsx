"use client";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BLUR_POSTER } from "@/lib/blur";
import { ContinueWatchingSkeleton } from "@/components/blocks/skeletons";

const Swiper = dynamic(() => import("@/components/ui/swiper-client"), {
  ssr: false,
  loading: () => <ContinueWatchingSkeleton />,
});

export type ContinueWatchingItem = {
  mediaId: number;
  mediaType: "movie" | "tv";
  posterPath: string | null;
  title: string;
  voteAverage: number;
  season: number | null;
  episode: number | null;
};

export default function ContinueWatching({
  items,
  title = "Continue Watching",
}: {
  items: ContinueWatchingItem[];
  title?: string;
}) {
  return (
    <section className="relative px-4 lg:px-14 mt-10 overflow-hidden">
      <div className="mb-4">
        <h3 className="text-lg md:text-2xl font-bold">{title}</h3>
      </div>
      <Swiper
        slides={items.map((item) => {
          const href =
            item.mediaType === "movie"
              ? `/movies/${item.mediaId}`
              : item.season != null && item.episode != null
                ? `/series/${item.mediaId}?s=${item.season}&ep=${item.episode}`
                : `/series/${item.mediaId}`;
          return (
            <div key={`${item.mediaType}-${item.mediaId}`}>
              <Link
                href={href}
                className="relative block aspect-[2/3] overflow-hidden rounded-xl bg-muted group">
                {item.posterPath ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                    alt={item.title}
                    fill
                    sizes="(max-width: 682px) 50vw, (max-width: 1280px) 25vw, (max-width: 1536px) 17vw, 12.5vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_POSTER}
                    quality={80}
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-muted-foreground">
                    <PlayCircle className="size-12 stroke-primary" />
                  </span>
                )}
                {item.mediaType === "tv" && item.season != null && (
                  <Badge className="absolute top-2 right-2">
                    S{item.season}
                    {item.episode != null ? ` · E${item.episode}` : ""}
                  </Badge>
                )}
                <PlayCircle
                  size={45}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 stroke-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Link>
              <p className="mt-2 truncate text-sm font-medium">{item.title}</p>
            </div>
          );
        })}
        slidesPerView={2}
        slidesPerGroup={2}
        spaceBetween={10}
        grabCursor
        className="mask-r-from-90%"
        breakpoints={{
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
        }}
      />
    </section>
  );
}