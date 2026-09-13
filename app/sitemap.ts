import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPopular } from "@/data/tmdb";

const toDate = (value: string | undefined) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: `${SITE_URL}/movies`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/series`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [popularMovies, popularSeries] = await Promise.all([
    getPopular("movie"),
    getPopular("tv"),
  ]);

  const movieRoutes: MetadataRoute.Sitemap = popularMovies
    .filter((movie) => movie.id)
    .map((movie) => {
      const lastModified = toDate(movie.release_date);
      const route: MetadataRoute.Sitemap[number] = {
        url: `${SITE_URL}/movies/${movie.id}`,
        changeFrequency: "weekly",
        priority: 0.7,
      };
      if (lastModified) route.lastModified = lastModified;
      return route;
    });

  const seriesRoutes: MetadataRoute.Sitemap = popularSeries
    .filter((serie) => serie.id)
    .map((serie) => {
      const lastModified = toDate(serie.release_date);
      const route: MetadataRoute.Sitemap[number] = {
        url: `${SITE_URL}/series/${serie.id}`,
        changeFrequency: "weekly",
        priority: 0.7,
      };
      if (lastModified) route.lastModified = lastModified;
      return route;
    });

  return [...staticRoutes, ...movieRoutes, ...seriesRoutes];
}