import axios from "axios";

export const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
  },
});
