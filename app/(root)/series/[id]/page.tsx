import type { Metadata } from "next";
import React, { Suspense } from "react";
import { getData, getPageData, streamingDetails } from "@/data/tmdb";
import Cover from "@/app/(root)/movies/_components/cover";
import BilledCast from "@/components/blocks/billed-cast";
import { LinkIcon, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ThumsSlide from "../../movies/_components/thums-slide";
import Image from "next/image";
import { BLUR_POSTER, BLUR_BACKDROP } from "@/lib/blur";
import AutoSwiperSlideOfCards from "@/components/ui/auto-swiper-slide-of-cards";
import { TmdbTvDetails } from "@/types/tmdb";
import SeriesStreamingController from "../_components/blocks/series-streaming-controller";
import { SITE_URL, TMDB_IMAGE_BASE_URL } from "@/lib/site";

export const revalidate = 604800;

export async function generateStaticParams() {
  const { trending } = await getPageData("tv");
  return trending.slice(0, 8).map((item) => ({ id: String(item.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = (await getData("tv", Number(id))) as TmdbTvDetails;
    const title = data.name || data.title;
    const description = data.overview
      ? data.overview.slice(0, 160)
      : data.tagline;
    const image = data.backdrop_path || data.poster_path
      ? `${TMDB_IMAGE_BASE_URL}/w1280${data.backdrop_path || data.poster_path}`
      : `${SITE_URL}/assets/images/logo.png`;
    return {
      title,
      description,
      alternates: {
        canonical: `/series/${id}`,
      },
      openGraph: {
        type: "video.tv_show",
        url: `${SITE_URL}/series/${id}`,
        siteName: "Nextflix",
        title,
        description,
        images: [{ url: image, width: 1280, height: 720, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {};
  }
}


export default async function SerieDetails({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const {
    data: results,
    credits,
    keywords,
    recommendations,
    similar,
    images,
    reviews,
  } = await streamingDetails("tv", Number(id));
  const data = results as TmdbTvDetails;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: data.name || data.title,
    alternateName: data.original_name || data.original_title,
    url: `${SITE_URL}/series/${id}`,
    image: data.backdrop_path
      ? `${TMDB_IMAGE_BASE_URL}/w1280${data.backdrop_path}`
      : undefined,
    description: data.overview,
    startDate: data.first_air_date || undefined,
    endDate: data.last_air_date || undefined,
    genre: data.genres?.map((genre) => genre.name) || undefined,
    numberOfSeasons: data.number_of_seasons || undefined,
    numberOfEpisodes: data.number_of_episodes || undefined,
    season:
      data.seasons?.map((season) => ({
        "@type": "TVSeason",
        name: season.name,
        seasonNumber: season.season_number,
        numberOfEpisodes: season.episode_count,
        datePublished: season.air_date || undefined,
      })) || undefined,
    productionCompany:
      data.production_companies?.map((company) => company.name) || undefined,
    aggregateRating:
      data.vote_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: data.vote_average,
            ratingCount: data.vote_count,
            bestRating: 10,
          }
        : undefined,
    actor:
      credits.cast.length > 0
        ? credits.cast.slice(0, 10).map((cast) => ({
            "@type": "Person",
            name: cast.name,
            characterName: cast.character,
          }))
        : undefined,
  };
  return (
    <>
      <Cover info={data} type="tv" backTo={`/series/${id}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="grid grid-cols-12 w-full px-4 lg:px-14 gap-3 mb-5">
            <div className="col-span-full lg:col-span-9">
              <div className="w-full aspect-video rounded-xl bg-muted animate-pulse" />
            </div>
            <div className="max-lg:min-h-[500px] col-span-full lg:col-span-3 p-2">
              <div className="size-full rounded-xl bg-muted animate-pulse" />
            </div>
          </div>
        }>
        <SeriesStreamingController
          info={{
            ...data,
            seasons: data.seasons.filter((s) => s.season_number !== 0),
          }}
          backTo={`/series/${id}`}
        />
      </Suspense>
      <section className="grid grid-cols-12 w-full px-4 lg:px-14 gap-3">
        <div className="col-span-full lg:col-span-9">
          <div className="mb-8">
            <h2 className="mb-2 text-lg font-medium">
              Reviews ({reviews.length})
            </h2>
            <div className="max-h-[400px] overflow-hidden overflow-y-auto hidden-scrollbar space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 rounded-xl border-2 space-y-4 border-white/20 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Image
                          src={
                            review.author_details.avatar_path
                              ? `https://image.tmdb.org/t/p/w500${review.author_details.avatar_path}`
                              : `https://api.dicebear.com/7.x/notionists/png?seed=${Math.random()}`
                          }
                          width={40}
                          height={40}
                          alt={review.author ? `${review.author} avatar` : "Reviewer avatar"}
                          placeholder="blur"
                          blurDataURL={BLUR_POSTER}
                          className="bg-primary rounded-full"
                        />
                        <p className="flex flex-col">
                          <span className="font-medium">
                            {review.author || "Unkown"}
                          </span>
                          <span className="text-xs">
                            {new Date(review.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </p>
                      </div>
                      <Badge className="bg-muted">
                        <span className="font-extrabold">
                          {review.author_details.rating}
                        </span>
                        <Star fill="currentColor" className="text-amber-400" />
                      </Badge>
                    </div>
                    <p>{review.content}</p>
                  </div>
                ))
              ) : (
                <p className="grid place-items-center bg-muted rounded-xl h-32">
                  No Reviews Have
                </p>
              )}
            </div>
          </div>
          <div className="mb-8">
            <h2 className="mb-2 text-lg font-medium">Backdrops</h2>
            <AutoSwiperSlideOfCards
              content={images.backdrops.slice(0, 12).map((image, i) => (
                <Image
                  key={i}
                  src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                  width={780}
                  height={439}
                  sizes="(max-width: 1200px) 50vw, 25vw"
                  alt={`${data.name || data.title} backdrop ${i + 1}`}
                  placeholder="blur"
                  blurDataURL={BLUR_BACKDROP}
                  className="object-cover"
                />
              ))}
            />
          </div>
          <div className="mb-8">
            <h2 className="mb-2 text-lg font-medium">Posters</h2>
            <AutoSwiperSlideOfCards
              type="v"
              content={images.posters.slice(0, 12).map((image, i) => (
                <Image
                  key={i}
                  src={`https://image.tmdb.org/t/p/w342${image.file_path}`}
                  width={342}
                  height={513}
                  sizes="(max-width: 786px) 33vw, (max-width: 1200px) 17vw, 12.5vw"
                  alt={`${data.name || data.title} poster ${i + 1}`}
                  placeholder="blur"
                  blurDataURL={BLUR_POSTER}
                  className="object-cover"
                />
              ))}
            />
          </div>
          <BilledCast casts={credits.cast} />
        </div>
        <div className="col-span-full lg:col-span-3 p-2">
          <div className="space-y-3 sticky top-5">
            <p>
              <span className="font-bold pr-2">Name:</span>
              {data.title || data.name}
            </p>
            <p>
              <span className="font-bold pr-2">Original Name:</span>
              {data.original_title || data.original_name}
            </p>
            <p>
              <span className="font-bold pr-2">Overview:</span>
              {data.overview}
            </p>
            <p className="flex gap-2">
              <span className="font-bold">Website:</span>
              <a
                href={data.homepage}
                target="_blank"
                className="cursor-pointer flex items-center gap-2">
                visit
                <LinkIcon size={14} />
              </a>
            </p>
            <p>
              <span className="font-bold pr-2">Status:</span>
              {data.status}
            </p>
            <p>
              <span className="font-bold pr-2">Original Language:</span>
              <span className="uppercase">{data.original_language}</span>
            </p>
            <p>
              <span className="font-bold pr-2 text-nowrap">Tag line:</span>
              {data.tagline}
            </p>
            <div>
              <span className="font-bold pr-2 text-nowrap">Keywords:</span>
              <div className="flex gap-2 flex-wrap mt-2">
                {keywords.map((key) => (
                  <Badge key={key.id}>{key.name}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <ThumsSlide
        infos={similar}
        href="./"
        title="Similar"
        varient="long"
        type="movie"
      />
      <ThumsSlide
        infos={recommendations}
        href="./"
        title="Recommendations"
        varient="short"
      />
    </>
  );
}
