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
  const cover = await getTrending();
  const moviesNowPlaying = await getMoviesNowPlaying();
  const popularMovies = await getPopular("movie");
  const popularSeries = await getPopular("tv");
  const popular = [
    ...popularMovies.map((i) => ({ ...i, media_type: "movie" })),
    ...popularSeries.map((i) => ({ ...i, media_type: "tv" })),
  ]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 5) as TmdbResult[];
  const topRatedSeries = await getTopRated("tv");
  const topRatedMovies = await getTopRated("movie");
  const upComingMovies = await getUpComingMovies();
  const discover = await getDiscover("tv", null);
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
  const data= await getData(type, id);
  const credits: Credits = (await http.get(`/3/${type}/${id}/credits`)).data;
  const keywords = (await http.get(`/3/${type}/${id}/keywords`)).data[
    type === "movie" ? "keywords" : "results"
  ] as Genre[];
  const videos = await getVideos(type, id);
  const recommendations = await getRecommendations(type, id);
  const similar = await getSimilar(type, id);
  const images = await getImages(type, id);
  const reviews = await getReviews(type, id);
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
  const trending = await getTrending(type);
  const nowPlaying =
    type === "movie"
      ? await getMoviesNowPlaying()
      : await getSeriesAiringToday();
  const popular = await getPopular(type);
  const topRated = await getTopRated(type);
  const discover = await getDiscover(type, null);
  const upComing =
    type === "movie" ? await getUpComingMovies() : await getOnTheAir();
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
