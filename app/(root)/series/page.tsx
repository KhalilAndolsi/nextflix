import type { Metadata } from "next";
import BestSections from "@/app/(root)/movies/_components/best-sections";
import HeroSection from "@/app/(root)/movies/_components/hero-section";
import ThumsSlide from "@/app/(root)/movies/_components/thums-slide";
import TopFive from "@/app/(root)/movies/_components/top-five";
import { GENRES } from "@/constant";
import { getDiscover, getPageData } from "@/data/tmdb";
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
  title: "Series",
  description:
    "Browse and stream TV series online in HD for free. Popular, trending and top-rated shows plus series currently on the air.",
  alternates: {
    canonical: "/series",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/series`,
    title: "Series | Nextflix",
    description:
      "Browse and stream TV series online in HD for free. Popular, trending and top-rated shows.",
    images: [{ url: `${SITE_URL}/assets/images/logo.png`, width: 1200, height: 630, alt: "Nextflix" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Series | Nextflix",
    description:
      "Browse and stream TV series online in HD for free. Popular, trending and top-rated shows.",
    images: [`${SITE_URL}/assets/images/logo.png`],
  },
};

export default async function SeriesPage() {
  const { trending, nowPlaying, popular, topRated, discover, upComing } =
    await getPageData("tv");
  const genreOne = GENRES.movies[5];
  const genreOneData = await getDiscover("tv", genreOne.id);
  const genreTwo = GENRES.movies[2];
  const genreTwoData = await getDiscover("tv", genreTwo.id);
  return (
    <>
      <h1 className="sr-only">
        Series — Watch & stream TV series online in HD for free
      </h1>
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
