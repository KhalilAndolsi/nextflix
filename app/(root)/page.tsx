
import type { Metadata } from "next";
import HeroSection from "./movies/_components/hero-section";
import { getData, getLandingPageData } from "@/data/tmdb";
import { Suspense } from "react";
import { headers } from "next/headers";
import ThumsSlide from "./movies/_components/thums-slide";
import TopFive from "@/app/(root)/movies/_components/top-five";
import BestSections from "./movies/_components/best-sections";
import ContinueWatching, {
  ContinueWatchingItem,
} from "./movies/_components/continue-watching";
import {
  HeroSectionSkeleton,
  ThumsSlideSkeleton,
  TopFiveSkeleton,
  BestSectionsSkeleton,
  ContinueWatchingSkeleton,
} from "@/components/blocks/skeletons";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MediaKind } from "@/generated/prisma/enums";
import type { TmdbMovieDetails, TmdbTvDetails } from "@/types/tmdb";
import { SITE_URL, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Watch Movies & TV Series Online",
  description: site.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: `${SITE_URL}/assets/images/logo.png`,
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [`${SITE_URL}/assets/images/logo.png`],
  },
};

export default async function HomePage() {
  const {
    cover,
    moviesNowPlaying,
    popular,
    discover,
    popularMovies,
    popularSeries,
    upComingMovies,
    topRatedSeries,
    topRatedMovies,
  } = await getLandingPageData();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let continueWatching: ContinueWatchingItem[] = [];
  if (session) {
    const historyRows = await prisma.userMedia.findMany({
      where: { userId: session.user.id, kind: MediaKind.HISTORY },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    const resolved = await Promise.all(
      historyRows.map(async (row): Promise<ContinueWatchingItem | null> => {
        try {
          const data = (await getData(
            row.mediaType as "movie" | "tv",
            row.mediaId
          )) as TmdbMovieDetails | TmdbTvDetails;
          return {
            mediaId: row.mediaId,
            mediaType: row.mediaType as "movie" | "tv",
            posterPath: data.poster_path || null,
            title: data.title || data.name || `#${row.mediaId}`,
            voteAverage: data.vote_average || 0,
            season: row.season,
            episode: row.episode,
          };
        } catch {
          return null;
        }
      })
    );
    continueWatching = resolved.filter(
      (item): item is ContinueWatchingItem => item !== null
    );
  }

  return (
    <>
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection data={cover} />
      </Suspense>
      {continueWatching.length > 0 && (
        <Suspense fallback={<ContinueWatchingSkeleton />}>
          <ContinueWatching items={continueWatching} />
        </Suspense>
      )}
      {/* <InfiniteSlider
        speed={60}
        gap={30}
        className="items-center mask-x-from-80%">
        {[1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => (
          <Image
            key={i}
            src={`/assets/images/brands/m${n}.png`}
            width={120}
            height={60}
            priority={i < 8}
            loading={i < 8 ? "eager" : "lazy"}
            decoding="async"
            alt={`Brand ${n} logo`}
            className="h-auto w-24 lg:w-30 xl:w-34 object-cover"
            style={{ contentVisibility: "auto" }}
          />
        ))}
      </InfiniteSlider>*/}
      {/*//TODO: fix InfiniteSlider Problem  */}
      <Suspense fallback={<ThumsSlideSkeleton />}>
        <ThumsSlide
          varient="long"
          title="Movies Now Playing"
          href="/movies"
          type="movie"
          infos={moviesNowPlaying}
        />
      </Suspense>
      <Suspense fallback={<ThumsSlideSkeleton />}>
        <ThumsSlide
          varient="long"
          title="Discover Series"
          href="/series"
          type="tv"
          infos={discover}
        />
      </Suspense>
      <Suspense fallback={<TopFiveSkeleton />}>
        <TopFive infos={popular} />
      </Suspense>
      <Suspense fallback={<ThumsSlideSkeleton />}>
        <ThumsSlide
          varient="short"
          title="Movies"
          href="/movies"
          type="movie"
          infos={popularMovies}
        />
      </Suspense>
      <Suspense fallback={<ThumsSlideSkeleton />}>
        <ThumsSlide
          varient="short"
          title="Series"
          href="/series"
          type="tv"
          infos={popularSeries}
        />
      </Suspense>
      <Suspense fallback={<BestSectionsSkeleton />}>
        <BestSections
          main={upComingMovies}
          mainType="movie"
          slideOne={topRatedMovies}
          slideTwo={topRatedSeries}
          slideOneType="movie"
          slideTwoType="tv"
        />
      </Suspense>
    </>
  );
}
