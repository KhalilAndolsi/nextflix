
import HeroSection from "../../components/blocks/hero-section";
import { getLandingPageData } from "@/data/tmdb";
import { Suspense } from "react";
import ThumsSlide from "../../components/blocks/thums-slide";
import TopFive from "@/components/blocks/top-five";
import BestSections from "../../components/blocks/best-sections";

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
  // console.dir(popularSeries, {depth: 'infinity'})
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <HeroSection data={cover} />
      </Suspense>
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
      <Suspense fallback={<div>loading...</div>}>
        <ThumsSlide
          varient="long"
          title="Movies Now Playing"
          href="/movies"
          type="movie"
          infos={moviesNowPlaying}
        />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <ThumsSlide
          varient="long"
          title="Discover Series"
          href="/series"
          type="tv"
          infos={discover}
        />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <TopFive infos={popular} />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <ThumsSlide
          varient="short"
          title="Movies"
          href="/movies"
          type="movie"
          infos={popularMovies}
        />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <ThumsSlide
          varient="short"
          title="Series"
          href="/series"
          type="tv"
          infos={popularSeries}
        />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
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
