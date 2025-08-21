export interface TmdbResult {
  adult: boolean; // Defaults to true
  backdrop_path: string;
  id: number; // Defaults to 0
  original_language: string;
  name?: string;
  title?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string;
  media_type: "movie" | "tv";
  genre_ids: number[];
  popularity: number; // Defaults to 0
  release_date: string;
  video: boolean; // Defaults to true
  vote_average: number; // Defaults to 0
  vote_count: number; // Defaults to 0
}

// Supporting interfaces for detailed movie data
export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// Extended interface for detailed movie information
export interface TmdbMovieDetails extends TmdbResult {
  belongs_to_collection: string;
  budget: number;
  genres: Genre[]; // Replaces genre_ids with full genre objects
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
}

// Supporting interfaces for TV series
interface CreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

interface LastEpisodeToAir {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

// Extended interface for detailed TV series information
export interface TmdbTvDetails extends TmdbResult {
  created_by: CreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[]; // Replaces genre_ids with full genre objects
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: LastEpisodeToAir;
  next_episode_to_air: string;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
}

export interface PersonBase {
  adult?: boolean; // Defaults to true
  gender?: number; // Defaults to 0
  id?: number; // Defaults to 0
  known_for_department?: string;
  name: string;
  original_name: string;
  popularity?: number; // Defaults to 0
  profile_path: string;
  credit_id: string;
}

export interface CastMember extends PersonBase {
  cast_id: number; // Defaults to 0
  character: string;
  order?: number; // Defaults to 0
}

export interface CrewMember extends PersonBase {
  department?: string;
  job?: string;
}

export interface Credits {
  id: number; // Defaults to 0
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number; // default: 0
  type: string;
  official: boolean; // default: true
  published_at: string;
  id: string;
}

export type ImageType = {
  aspect_ratio: number;
  height: number;
  iso_639_1: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
};

export interface ImagesObject {
  id: number;
  backdrops: ImageType[];
  logos: ImageType[];
  posters: ImageType[];
}

export interface Review {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number;
  };
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface Episode {
  air_date: string;
  episode_number: number; // default: 0
  id: number; // default: 0
  name: string;
  overview: string;
  production_code: string;
  runtime: number; // default: 0
  season_number: number; // default: 0
  show_id: number; // default: 0
  still_path: string;
  vote_average: number; // default: 0
  vote_count: number; // default: 0
  crew: CrewMember[];
  guest_stars: any[]; // Assuming guest_stars is an array of any type
}
