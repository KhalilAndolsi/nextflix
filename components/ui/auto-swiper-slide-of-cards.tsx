"use client";
import dynamic from "next/dynamic";
import { SwiperSlide } from "swiper/react";
const Swiper = dynamic(() => import("swiper/react").then((d) => d.Swiper), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
import "swiper/css";

export default function AutoSwiperSlideOfCards({
  content,
  type = "h",
}: {
  content: React.ReactNode[];
  type?: "h" | "v";
}) {
  return (
    <Swiper
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
      }>
      {content.map((item, i) => (
        <SwiperSlide key={i}>{item}</SwiperSlide>
      ))}
    </Swiper>
  );
}
