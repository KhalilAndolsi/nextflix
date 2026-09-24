import type { Metadata } from "next";
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
import { SITE_URL } from "@/lib/site";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Movies",
  description:
    "Browse and stream movies online in HD for free. Now playing, popular, trending and top-rated films plus upcoming releases.",
  alternates: {
    canonical: "/movies",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/movies`,
    title: "Movies | Nextflix",
    description:
      "Browse and stream movies online in HD for free. Now playing, popular, trending and top-rated films.",
    images: [{ url: `${SITE_URL}/assets/images/logo.png`, width: 1200, height: 630, alt: "Nextflix" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Movies | Nextflix",
    description:
      "Browse and stream movies online in HD for free. Now playing, popular, trending and top-rated films.",
    images: [`${SITE_URL}/assets/images/logo.png`],
  },
};

export default async function MoviesPage() {
  const {trending, nowPlaying, popular, topRated, discover, upComing} = await getPageData("movie");
  const genreOne = GENRES.movies[Math.floor(Math.random() * GENRES.movies.length)]
  const genreOneData = await getDiscover("movie", genreOne.id);
  const genreTwo = GENRES.movies[Math.floor(Math.random() * GENRES.movies.length)]
  const genreTwoData = await getDiscover("movie", genreTwo.id);
  return (
    <>
      <h1 className="sr-only">
        Movies — Watch & stream movies online in HD for free
      </h1>
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection data={discover} />
      </Suspense>
      <Suspense fallback={<ThumsSlideSkeleton />}>
        <ThumsSlide
          varient="long"
          title="Now Playing"
          href="/movies"
          type="movie"
          infos={nowPlaying}
        />
      </Suspense>
      <Suspense fallback={<TopFiveSkeleton />}>
        <TopFive infos={topRated} type="movie" />
      </Suspense>
      <Suspense fallback={<ThumsSlideSkeleton />}>
        <ThumsSlide
          varient="short"
          title="Popular Movies"
          href="/movies"
          type="movie"
          infos={popular}
        />
      </Suspense>
      <Suspense fallback={<ThumsSlideSkeleton />}>
        <ThumsSlide
          varient="long"
          title="Trending"
          href="/movies"
          type="movie"
          infos={trending}
        />
      </Suspense>
      <Suspense fallback={<BestSectionsSkeleton />}>
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
