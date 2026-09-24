
import type { Metadata } from "next";
import HeroSection from "./movies/_components/hero-section";
import { getLandingPageData } from "@/data/tmdb";
import { Suspense } from "react";
import ThumsSlide from "./movies/_components/thums-slide";
import TopFive from "@/app/(root)/movies/_components/top-five";
import BestSections from "./movies/_components/best-sections";
import ContinueWatchingSection from "./movies/_components/continue-watching-section";
import {
  HeroSectionSkeleton,
  ThumsSlideSkeleton,
  TopFiveSkeleton,
  BestSectionsSkeleton,
} from "@/components/blocks/skeletons";
import { SITE_URL, site } from "@/lib/site";

export const revalidate = 604800;

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
        url: `${SITE_URL}/assets/images/cover.png`,
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
    images: [`${SITE_URL}/assets/images/cover.png`],
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

  return (
    <>
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            url: SITE_URL,
            description: site.description,
            publisher: {
              "@type": "Organization",
              name: site.name,
              url: SITE_URL,
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/assets/images/logo.png`,
              },
            },
          }),
        }}
      />
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection data={cover} />
      </Suspense>
      <ContinueWatchingSection />
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
