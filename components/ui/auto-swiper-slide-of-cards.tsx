"use client";
import dynamic from "next/dynamic";
import { AutoSwiperSkeleton } from "../blocks/skeletons";

const Swiper = dynamic(() => import("@/components/ui/swiper-client"), {
  ssr: false,
  loading: () => <AutoSwiperSkeleton />,
});

export default function AutoSwiperSlideOfCards({
  content,
  type = "h",
}: {
  content: React.ReactNode[];
  type?: "h" | "v";
}) {
  return (
    <Swiper
      slides={content}
      slidesPerView={type === "h" ? 2 : 3}
      slidesPerGroup={type === "h" ? 2 : 3}
      spaceBetween={5}
      grabCursor
      breakpoints={
        type === "h"
          ? {
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 15,
              },
            }
          : {
              786: {
                slidesPerView: 6,
                slidesPerGroup: 6,
                spaceBetween: 15,
              },
              1200: {
                slidesPerView: 8,
                slidesPerGroup: 8,
              },
            }
      }
    />
  );
}
