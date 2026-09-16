function svgPlaceholder(width: number, height: number) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f1f1f"/><stop offset="0.5" stop-color="#292929"/><stop offset="1" stop-color="#161616"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#g)"/></svg>`
  )}`;
}

/** Portrait (2:3) blurred placeholder for poster images. */
export const BLUR_POSTER = svgPlaceholder(40, 60);

/** Landscape (16:9) blurred placeholder for backdrop/still images. */
export const BLUR_BACKDROP = svgPlaceholder(64, 36);