"use client";

import type { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperProps } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const MODULES = {
  autoplay: Autoplay,
  effectFade: EffectFade,
  navigation: Navigation,
} as const;

export type SwiperModuleKey = keyof typeof MODULES;

export type SwiperSlidesProps = Omit<SwiperProps, "children" | "modules"> & {
  slides: ReactNode[];
  modules?: SwiperModuleKey[];
  slideClassName?: string;
};

export default function SwiperSlides({
  slides,
  modules,
  slideClassName,
  ...props
}: SwiperSlidesProps) {
  return (
    <Swiper modules={modules?.map((key) => MODULES[key])} {...props}>
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className={slideClassName}>
          {slide}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
