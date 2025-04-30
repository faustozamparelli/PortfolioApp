export interface Movie {
  imdbUrl: string;
  rating: number;
  review?: string;
  isTopMovie?: boolean;
  title?: string;
  director?: string;
  year?: number | null;
  overview?: string;
  genres?: string[];
  posterUrl?: string;
}

export interface TVShow {
  imdbUrl: string;
  rating: number;
  review?: string;
  isTopShow?: boolean;
  title?: string;
  creator?: string;
  firstAirYear?: number | null;
  overview?: string;
  genres?: string[];
  posterUrl?: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
}
