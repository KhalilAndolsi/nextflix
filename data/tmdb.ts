import "server-only";
import {
  Credits,
  Episode,
  Genre,
  ImagesObject,
  Review,
  TmdbMovieDetails,
  TmdbResult,
  TmdbSearchResult,
  TmdbTvDetails,
  Video,
} from "@/types/tmdb";
import { tmdbApi as http } from "@/utils/http";


export const getTrending = async (type: "all" | "movie" | "tv" = "all") => {
  const { data } = await http.get(`/3/trending/${type}/week`);
  return data.results.filter((d: TmdbResult) => {
    if (d.media_type) {
      return ["movie", "tv"].includes(d.media_type);
    } else {
      return true;
    }
  }) as TmdbResult[];
};

export const getMoviesNowPlaying = async () => {
  const {
    data: { results },
  } = await http.get("/3/movie/now_playing");
  return results as TmdbResult[];
};

export const getPopular = async (type: "movie" | "tv") => {
  const {
    data: { results },
  } = await http.get(`/3/${type}/popular`);
  return results as TmdbResult[];
};

export const getTopRated = async (type: "movie" | "tv") => {
  const {
    data: { results },
  } = await http.get(`/3/${type}/top_rated`);
  return results as TmdbResult[];
};

export const getUpComingMovies = async () => {
  const {
    data: { results },
  } = await http.get(`/3/movie/upcoming`);
  return results as TmdbResult[];
};

export const getVideos = async (type: "movie" | "tv", id: number) => {
  const data = (await http.get(`/3/${type}/${id}/videos`)).data
    .results as Video[];
  const results = data.filter((d) => d.site === "YouTube");
  return results;
};

export const getRecommendations = async (type: "movie" | "tv", id: number) => {
  const data = (await http.get(`/3/${type}/${id}/recommendations`)).data
    .results as TmdbResult[];
  return data;
};
export const getSimilar = async (type: "movie" | "tv", id: number) => {
  const data = (await http.get(`/3/${type}/${id}/similar`)).data
    .results as TmdbResult[];
  return data;
};
export const getReviews = async (type: "movie" | "tv", id: number) => {
  const data = (await http.get(`/3/${type}/${id}/reviews`)).data
    .results as Review[];
  return data;
};
export const getImages = async (type: "movie" | "tv", id: number) => {
  const data = (await http.get(`/3/${type}/${id}/images`)).data as ImagesObject;
  return data;
};
export const getData = async (type: "movie" | "tv", id: number) => {
  const data: TmdbMovieDetails | TmdbTvDetails = (await http.get(`/3/${type}/${id}`)).data;
  return data;
};

export const getLandingPageData = async () => {
  const [
    cover,
    moviesNowPlaying,
    popularMovies,
    popularSeries,
    topRatedSeries,
    topRatedMovies,
    upComingMovies,
    discover,
  ] = await Promise.all([
    getTrending(),
    getMoviesNowPlaying(),
    getPopular("movie"),
    getPopular("tv"),
    getTopRated("tv"),
    getTopRated("movie"),
    getUpComingMovies(),
    getDiscover("tv", null),
  ]);
  const popular = [
    ...popularMovies.map((i) => ({ ...i, media_type: "movie" })),
    ...popularSeries.map((i) => ({ ...i, media_type: "tv" })),
  ]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 5) as TmdbResult[];
  return {
    cover,
    moviesNowPlaying,
    popularMovies,
    popularSeries,
    popular,
    discover,
    upComingMovies,
    topRatedSeries,
    topRatedMovies,
  };
};

export const streamingDetails = async (type: "movie" | "tv", id: number) => {
  const [data, credits, keywords, videos, recommendations, similar, images, reviews] =
    await Promise.all([
      getData(type, id),
      http.get(`/3/${type}/${id}/credits`).then((r) => r.data as Credits),
      http.get(`/3/${type}/${id}/keywords`).then((r) =>
        (type === "movie" ? r.data.keywords : r.data.results) as Genre[]
      ),
      getVideos(type, id),
      getRecommendations(type, id),
      getSimilar(type, id),
      getImages(type, id),
      getReviews(type, id),
    ]);
  return {
    data,
    credits,
    keywords,
    videos,
    recommendations,
    similar,
    images,
    reviews,
  };
};

export const getDiscover = async (
  type: "movie" | "tv",
  genre: number | null
) => {
  const data = (
    await http.get(`/3/discover/${type}${genre ? `?with_genres=${genre}` : ""}`)
  ).data.results as TmdbResult[];
  return data;
};
export const getSeriesAiringToday = async () => {
  const data = (await http.get("/3/tv/airing_today")).data
    .results as TmdbResult[];
  return data;
};
export const getOnTheAir = async () => {
  const data = (await http.get("/3/tv/on_the_air")).data
    .results as TmdbResult[];
  return data;
};

export const getPageData = async (type: "movie" | "tv") => {
  const [trending, nowPlaying, popular, topRated, discover, upComing] =
    await Promise.all([
      getTrending(type),
      type === "movie" ? getMoviesNowPlaying() : getSeriesAiringToday(),
      getPopular(type),
      getTopRated(type),
      getDiscover(type, null),
      type === "movie" ? getUpComingMovies() : getOnTheAir(),
    ]);
  return { trending, nowPlaying, popular, topRated, discover, upComing };
};


export const getEpisodes = async (serie_id: number, season_number: number) => {
  const {
    data: { episodes },
  } = await http.get(`/3/tv/${serie_id}/season/${season_number}`);
  return episodes as Episode[]
};

export const searchMulti = async (query: string) => {
  const data = (
    await http.get(
      `/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false`
    )
  ).data.results as TmdbSearchResult[];
  return data.filter(
    (d): d is TmdbResult => d.media_type === "movie" || d.media_type === "tv"
  );
};
