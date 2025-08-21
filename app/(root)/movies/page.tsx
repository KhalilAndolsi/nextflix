import BestSections from "@/components/blocks/best-sections";
import HeroSection from "@/components/blocks/hero-section";
import ThumsSlide from "@/components/blocks/thums-slide";
import TopFive from "@/components/blocks/top-five";
import { GENRES } from "@/constant";
import { getDiscover, getPageData } from "@/data/tmdb";
import { TmdbResult } from "@/types/tmdb";
import React, { Suspense } from "react";

export default async function MoviesPage() {
  const {trending, nowPlaying, popular, topRated, discover, upComing} = await getPageData("movie");
  const genreOne = GENRES.movies[Math.floor(Math.random() * GENRES.movies.length-1)]
  const genreOneData = await getDiscover("movie", genreOne.id);
  const genreTwo = GENRES.movies[Math.floor(Math.random() * GENRES.movies.length-1)]
  const genreTwoData = await getDiscover("movie", genreTwo.id);
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <HeroSection data={discover} />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <ThumsSlide
          varient="long"
          title="Now Playing"
          href="/movies"
          type="movie"
          infos={nowPlaying}
        />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <TopFive infos={topRated} type="movie" />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <ThumsSlide
          varient="short"
          title="Popular Movies"
          href="/movies"
          type="movie"
          infos={popular}
        />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <ThumsSlide
          varient="long"
          title="Trending"
          href="/movies"
          type="movie"
          infos={trending}
        />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <BestSections
          main={upComing as TmdbResult[]}
          mainType="movie"
          slideOneTitle={genreOne.name}
          slideOne={genreOneData}
          slideTwoTitle={genreTwo.name}
          slideTwo={genreTwoData}
          slideOneType="movie"
          slideTwoType="movie"
        />
      </Suspense>
    </>
  );
}
