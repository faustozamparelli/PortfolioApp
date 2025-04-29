const TMDB_API_KEY = "1f54bd990f1cdfb230adb312546d765d"; // This is a public API key for testing
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export interface TVDetails {
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  firstAirDate: string;
  firstAirYear: number | null;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  genres: string[];
  voteAverage: number;
  voteCount: number;
  imdbId: string;
  tmdbId: number;
  creator: string;
}

export async function getTVPoster(
  title: string,
  year?: number
): Promise<string> {
  try {
    // Search for the TV show
    const searchUrl = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      title
    )}${year ? `&first_air_date_year=${year}` : ""}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results && searchData.results.length > 0) {
      // Get the first result (most relevant)
      const show = searchData.results[0];
      return show.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${show.poster_path}`
        : "/placeholder.svg";
    }

    return "/placeholder.svg"; // Fallback to placeholder
  } catch (error) {
    console.error("Error fetching TV show poster:", error);
    return "/placeholder.svg";
  }
}

export async function getTVDetails(
  title: string,
  year?: number
): Promise<TVDetails | null> {
  try {
    // Search for the TV show
    const searchUrl = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      title
    )}${year ? `&first_air_date_year=${year}` : ""}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results && searchData.results.length > 0) {
      const show = searchData.results[0];
      const showId = show.id;

      // Get detailed information about the TV show
      const detailsUrl = `${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      // Extract the creator (usually the first person in the created_by array)
      const creator = detailsData.created_by?.[0]?.name || "Unknown";

      // Extract the year from the first air date
      const firstAirYear = detailsData.first_air_date
        ? new Date(detailsData.first_air_date).getFullYear()
        : null;

      return {
        title: detailsData.name || "Unknown Title",
        originalTitle:
          detailsData.original_name || detailsData.name || "Unknown Title",
        overview: detailsData.overview || "",
        posterPath: detailsData.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${detailsData.poster_path}`
          : null,
        backdropPath: detailsData.backdrop_path
          ? `${TMDB_IMAGE_BASE_URL}${detailsData.backdrop_path}`
          : null,
        firstAirDate: detailsData.first_air_date || "",
        firstAirYear,
        numberOfSeasons: detailsData.number_of_seasons || 0,
        numberOfEpisodes: detailsData.number_of_episodes || 0,
        genres: detailsData.genres?.map((genre: any) => genre.name) || [],
        voteAverage: detailsData.vote_average || 0,
        voteCount: detailsData.vote_count || 0,
        imdbId: detailsData.external_ids?.imdb_id || "",
        tmdbId: detailsData.id,
        creator,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
}

export async function getTVDetailsFromImdbUrl(
  imdbUrl: string
): Promise<TVDetails | null> {
  try {
    // Extract IMDb ID from the URL
    const imdbId = imdbUrl.match(/title\/(tt\d+)/)?.[1];
    if (!imdbId) return null;

    // Search for the TV show using the IMDb ID
    const searchUrl = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.tv_results && searchData.tv_results.length > 0) {
      const show = searchData.tv_results[0];
      const showId = show.id;

      // Get detailed information about the TV show
      const detailsUrl = `${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      // Extract the creator (usually the first person in the created_by array)
      const creator = detailsData.created_by?.[0]?.name || "Unknown";

      // Extract the year from the first air date
      const firstAirYear = detailsData.first_air_date
        ? new Date(detailsData.first_air_date).getFullYear()
        : null;

      return {
        title: detailsData.name || "Unknown Title",
        originalTitle:
          detailsData.original_name || detailsData.name || "Unknown Title",
        overview: detailsData.overview || "",
        posterPath: detailsData.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${detailsData.poster_path}`
          : null,
        backdropPath: detailsData.backdrop_path
          ? `${TMDB_IMAGE_BASE_URL}${detailsData.backdrop_path}`
          : null,
        firstAirDate: detailsData.first_air_date || "",
        firstAirYear,
        numberOfSeasons: detailsData.number_of_seasons || 0,
        numberOfEpisodes: detailsData.number_of_episodes || 0,
        genres: detailsData.genres?.map((genre: any) => genre.name) || [],
        voteAverage: detailsData.vote_average || 0,
        voteCount: detailsData.vote_count || 0,
        imdbId: detailsData.external_ids?.imdb_id || imdbId,
        tmdbId: detailsData.id,
        creator,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching TV show details from IMDb URL:", error);
    return null;
  }
}
