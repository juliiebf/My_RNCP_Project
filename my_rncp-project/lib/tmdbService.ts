const TMDB_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

interface TMDBParams {
  api_key: string;
  language?: string;
  query?: string;
  page?: number;
  append_to_response?: string;
  include_image_language?: string;
}

async function fetchTMDB(endpoint: string, params: Record<string, any> = {}) {
  const url = new URL(`${TMDB_URL}${endpoint}`);
  
  Object.entries({ api_key: API_KEY, language: "fr-FR", ...params }).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.append(key, String(value));
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
}

export const searchMovies = async (query: string) => {
  const data = await fetchTMDB("/search/movie", { query });
  return data.results;
};

export const searchTVShows = async (query: string) => {
  const data = await fetchTMDB("/search/tv", { query });
  return data.results;
};

export const getMovieDetails = async (movieId: string) => {
  return fetchTMDB(`/movie/${movieId}`, { append_to_response: "images" });
};

export const getTVShowDetails = async (tvShowId: string) => {
  return fetchTMDB(`/tv/${tvShowId}`, {
    append_to_response: "images,credits",
    include_image_language: "fr,null"
  });
};

export const getMovieRecommendations = async (movieId: string) => {
  const data = await fetchTMDB(`/movie/${movieId}/recommendations`, { page: 1 });
  return data.results;
};

export const getTVShowRecommendations = async (tvShowId: string) => {
  const data = await fetchTMDB(`/tv/${tvShowId}/recommendations`, { page: 1 });
  return data.results;
};
