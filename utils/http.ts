import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const MAX_RETRIES = 2;

type RetriableConfig = InternalAxiosRequestConfig & { _retryCount?: number };

export const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
  },
});

tmdbApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    if (!config) return Promise.reject(error);

    const retriable =
      error.code === "ECONNRESET" ||
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT" ||
      (error.response?.status ?? 0) >= 500 ||
      (!error.response && !!error.request);

    const attempt = config._retryCount ?? 0;
    if (!retriable || attempt >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    config._retryCount = attempt + 1;
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    return tmdbApi(config);
  }
);