import BestSections from "@/app/(root)/movies/_components/best-sections";
import HeroSection from "@/app/(root)/movies/_components/hero-section";
import ThumsSlide from "@/app/(root)/movies/_components/thums-slide";
import TopFive from "@/app/(root)/movies/_components/top-five";
import { GENRES } from "@/constant";
import { getDiscover, getPageData } from "@/data/tmdb";
import { TmdbResult } from "@/types/tmdb";
import React, { Suspense } from "react";
import {
  HeroSectionSkeleton,
  ThumsSlideSkeleton,
  TopFiveSkeleton,
  BestSectionsSkeleton,
} from "@/components/blocks/skeletons";

export default async function SeriesPage() {
  const { trending, nowPlaying, popular, topRated, discover, upComing } =
    await getPageData("tv");
  const genreOne = GENRES.movies[5];
  const genreOneData = await getDiscover("tv", genreOne.id);
  const genreTwo = GENRES.movies[2];
  const genreTwoData = await getDiscover("tv", genreTwo.id);
  return (
    <>
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection data={discover} />
      </Suspense>
      <Suspense fallback={<ThumsSlideSkeleton />}>
        <ThumsSlide
          varient="long"
          title="Now Playing"
          href="/series"
          type="tv"
          infos={nowPlaying}
        />
      </Suspense>
      <Suspense fallback={<TopFiveSkeleton />}>
        <TopFive infos={topRated} type="tv" />
      </Suspense>
      <Suspense fallback={<ThumsSlideSkeleton />}>
        <ThumsSlide
          varient="short"
          title="Popular Series"
          href="/series"
          type="tv"
          infos={popular}
        />
      </Suspense>
      <Suspense fallback={<ThumsSlideSkeleton />}>
        <ThumsSlide
          varient="long"
          title="Trending"
          href="/series"
          type="tv"
          infos={trending}
        />
      </Suspense>
      <Suspense fallback={<BestSectionsSkeleton />}>
        <BestSections
          main={upComing}
          mainType="tv"
          mainTitle="On The Air"
          slideOneTitle={genreOne.name}
          slideOne={genreOneData}
          slideTwoTitle={genreTwo.name}
          slideTwo={genreTwoData}
          slideOneType="tv"
          slideTwoType="tv"
        />
      </Suspense>
    </>
  );
}
