import BestSections from "@/components/blocks/best-sections";
import HeroSection from "@/components/blocks/hero-section";
import ThumsSlide from "@/components/blocks/thums-slide";
import TopFive from "@/components/blocks/top-five";
import { GENRES } from "@/constant";
import { getDiscover, getPageData } from "@/data/tmdb";
import { TmdbResult } from "@/types/tmdb";
import React, { Suspense } from "react";

export default async function SeriesPage() {
  const { trending, nowPlaying, popular, topRated, discover, upComing } =
    await getPageData("tv");
  const genreOne = GENRES.movies[5];
  const genreOneData = await getDiscover("tv", genreOne.id);
  const genreTwo = GENRES.movies[2];
  const genreTwoData = await getDiscover("tv", genreTwo.id);
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <HeroSection data={discover} />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <ThumsSlide
          varient="long"
          title="Now Playing"
          href="/series"
          type="tv"
          infos={nowPlaying}
        />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <TopFive infos={topRated} type="tv" />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <ThumsSlide
          varient="short"
          title="Popular Series"
          href="/series"
          type="tv"
          infos={popular}
        />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <ThumsSlide
          varient="long"
          title="Trending"
          href="/series"
          type="tv"
          infos={trending}
        />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
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
