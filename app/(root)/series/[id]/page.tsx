import React from "react";
import { streamingDetails } from "@/data/tmdb";
import Cover from "@/app/(root)/movies/_components/cover";
import BilledCast from "@/components/blocks/billed-cast";
import { LinkIcon, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ThumsSlide from "../../movies/_components/thums-slide";
import Image from "next/image";
import AutoSwiperSlideOfCards from "@/components/ui/auto-swiper-slide-of-cards";
import { TmdbTvDetails } from "@/types/tmdb";
import SeriesStreamingController from "../_components/blocks/series-streaming-controller";


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
  return (
    <>
      <Cover info={data} type="tv" />
      <SeriesStreamingController info={{...data, seasons: data.seasons.filter(s => s.season_number !== 0)}} />
      <section className="grid grid-cols-12 w-full px-4 lg:px-14 gap-3">
        <div className="col-span-full lg:col-span-9">
          <div className="mb-8">
            <p className="mb-2 text-lg font-medium">
              Reviews ({reviews.length})
            </p>
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
                          alt="pfp"
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
            <p className="mb-2 text-lg font-medium">Backdrops</p>
            <AutoSwiperSlideOfCards
              content={images.backdrops.map((image, i) => (
                <Image
                  key={i}
                  src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                  width={image.width}
                  height={image.height}
                  alt="Backdrops"
                  className="object-cover"
                />
              ))}
            />
          </div>
          <div className="mb-8">
            <p className="mb-2 text-lg font-medium">Posters</p>
            <AutoSwiperSlideOfCards
              type="v"
              content={images.posters.map((image, i) => (
                <Image
                  key={i}
                  src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                  width={image.width}
                  height={image.height}
                  alt="Backdrops"
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
