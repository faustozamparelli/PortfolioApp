// utils/movieApi.ts
// Replace the empty API key with a hardcoded one for testing
const TMDB_API_KEY = "1f54bd990f1cdfb230adb312546d765d"; // This is a public API key for testing
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface MovieDetails {
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  releaseYear: number | null;
  runtime: number;
  genres: string[];
  voteAverage: number;
  voteCount: number;
  imdbId: string;
  tmdbId: number;
  director: string;
}

export async function getMoviePoster(
  title: string,
  year?: number
): Promise<string> {
  try {
    // Search for the movie
    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      title
    )}${year ? `&year=${year}` : ""}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results && searchData.results.length > 0) {
      // Get the first result (most relevant)
      const movie = searchData.results[0];
      return movie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
        : "/placeholder.svg";
    }

    return "/placeholder.svg"; // Fallback to placeholder
  } catch (error) {
    console.error("Error fetching movie poster:", error);
    return "/placeholder.svg";
  }
}

export async function getMovieDetails(
  title: string,
  year?: number
): Promise<MovieDetails | null> {
  try {
    // Search for the movie
    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      title
    )}${year ? `&year=${year}` : ""}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results && searchData.results.length > 0) {
      // Get the first result (most relevant)
      const movie = searchData.results[0];

      // Get additional details
      const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      // Get director from credits
      const director =
        detailsData.credits?.crew?.find(
          (person: any) => person.job === "Director"
        )?.name || "Unknown Director";

      // Extract year from release date
      const releaseYear = detailsData.release_date
        ? new Date(detailsData.release_date).getFullYear()
        : year || null;

      return {
        title: detailsData.title || "Unknown Title",
        originalTitle:
          detailsData.original_title || detailsData.title || "Unknown Title",
        overview: detailsData.overview || "",
        posterPath: detailsData.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${detailsData.poster_path}`
          : null,
        backdropPath: detailsData.backdrop_path
          ? `${TMDB_IMAGE_BASE_URL}${detailsData.backdrop_path}`
          : null,
        releaseDate: detailsData.release_date || "",
        releaseYear,
        runtime: detailsData.runtime || 0,
        genres: detailsData.genres?.map((genre: any) => genre.name) || [],
        voteAverage: detailsData.vote_average || 0,
        voteCount: detailsData.vote_count || 0,
        imdbId: detailsData.imdb_id || "",
        tmdbId: detailsData.id || movie.id,
        director,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export async function getMovieDetailsFromImdbUrl(
  imdbUrl: string
): Promise<MovieDetails | null> {
  try {
    // Extract IMDb ID from URL
    const imdbId = imdbUrl.match(/title\/(tt\d+)/)?.[1];
    if (!imdbId) {
      throw new Error("Invalid IMDb URL");
    }

    // Search for the movie using IMDb ID
    const searchUrl = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.movie_results && searchData.movie_results.length > 0) {
      const movie = searchData.movie_results[0];

      // Get additional details
      const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      // Get director from credits
      const director =
        detailsData.credits?.crew?.find(
          (person: any) => person.job === "Director"
        )?.name || "Unknown Director";

      // Extract year from release date
      const releaseYear = detailsData.release_date
        ? new Date(detailsData.release_date).getFullYear()
        : null;

      return {
        title: detailsData.title || "Unknown Title",
        originalTitle:
          detailsData.original_title || detailsData.title || "Unknown Title",
        overview: detailsData.overview || "",
        posterPath: detailsData.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${detailsData.poster_path}`
          : null,
        backdropPath: detailsData.backdrop_path
          ? `${TMDB_IMAGE_BASE_URL}${detailsData.backdrop_path}`
          : null,
        releaseDate: detailsData.release_date || "",
        releaseYear,
        runtime: detailsData.runtime || 0,
        genres: detailsData.genres?.map((genre: any) => genre.name) || [],
        voteAverage: detailsData.vote_average || 0,
        voteCount: detailsData.vote_count || 0,
        imdbId: detailsData.imdb_id || imdbId,
        tmdbId: detailsData.id || movie.id,
        director,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching movie details from IMDb URL:", error);
    return null;
  }
}
