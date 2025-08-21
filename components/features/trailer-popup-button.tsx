"use client";

import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, CirclePlay } from "lucide-react";
import { useOnClickOutside } from "usehooks-ts";
import { Video } from "@/types/tmdb";

export default function TrailerPopupButton({
  trailers,
}: {
  trailers: Video[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(playerRef as React.RefObject<HTMLElement>, () => setIsOpen(false));

  const importantCss = `header{z-index: 1}`;

  const handleChangeTrailer = (step: number) => {
    if (
      (step < 0 && currentTrailer !== 0) ||
      (step > 0 && currentTrailer !== trailers.length - 1)
    ) {
      setCurrentTrailer((prev) => prev + step);
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <div className="inset-0 fixed bg-black/60 backdrop-blur-md grid place-items-center">
            <div className="grid grid-cols-2 gap-2" ref={playerRef}>
              <div className="flex items-center justify-between col-span-full">
                <p className="text-lg font-bold">
                  {trailers[currentTrailer].name}
                </p>
                <p>
                  {new Date(
                    trailers[currentTrailer].published_at
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <iframe
                src={`https://www.youtube.com/embed/${trailers[currentTrailer].key}`}
                className="w-[90vw] lg:w-[40vw] aspect-video rounded-xl col-span-full"
                allowFullScreen
              />
              <Button
                disabled={currentTrailer === 0}
                onClick={() => handleChangeTrailer(-1)}>
                <ArrowLeft />
              </Button>
              <Button
                disabled={currentTrailer === trailers.length - 1}
                onClick={() => handleChangeTrailer(1)}>
                <ArrowRight />
              </Button>
            </div>
          </div>
          <style>{importantCss}</style>
        </>
      )}
      <Button onClick={() => setIsOpen(true)}>
        <CirclePlay /> Watch Trailer
      </Button>
    </>
  );
}