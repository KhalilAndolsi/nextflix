"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export const IMAGE_FALLBACK_SRC = "/assets/images/no-vd.png";

type ImageWithFallbackProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export default function ImageWithFallback({
  src,
  fallbackSrc = IMAGE_FALLBACK_SRC,
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(false);
  const resolvedSrc = !src || errored ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={() => setErrored(true)}
    />
  );
}
