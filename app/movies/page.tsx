"use client";

import Image from "next/image";
import { Star, StarHalf, ExternalLink, Filter, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getMoviePoster,
  getMovieDetails,
  getMovieDetailsFromImdbUrl,
} from "@/utils/movieApi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MovieReviewModal } from "@/components/movie-review-modal";

// Sample data
const topMovies: Movie[] = [
  {
    imdbUrl: "https://www.imdb.com/title/tt1285016/",
    rating: 11,
    title: "The Social Network",
    director: "David Fincher",
    year: 2010,
    posterUrl: "/placeholder.svg",
    review:
      "The BEST biopic ever made. Realistic events and details, a fire soundtrack, great acting... Coudn't have been executed better.",
    notes:
      "A brilliant portrayal of the founding of Facebook and the complex relationships behind it. The screenplay by Aaron Sorkin is razor-sharp.",
    isTopMovie: true,
  },
];

const movies: Movie[] = [
  {
    imdbUrl: "https://www.imdb.com/title/tt0111161/",
    rating: 9.5,
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
    posterUrl: "/placeholder.svg",
    review:
      "This film changed how I view storytelling. The performances by Tim Robbins and Morgan Freeman are extraordinary, and the narrative structure is perfect. A true masterpiece that I revisit every year.",
    notes:
      "A timeless tale of hope and redemption. The character development and storytelling are masterful.",
  },
  {
    imdbUrl: "https://www.imdb.com/title/tt1375666/",
    rating: 8.8,
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    posterUrl: "/placeholder.svg",
    review:
      "A perfect blend of blockbuster spectacle and intellectual depth. The concept is brilliantly executed, and the visuals are stunning. Hans Zimmer's score elevates every scene.",
    notes:
      "A mind-bending journey through dreams within dreams. The visual effects and score are outstanding.",
  },
  {
    imdbUrl: "https://www.imdb.com/title/tt0068646/",
    rating: 9.3,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: 1972,
    posterUrl: "/placeholder.svg",
    notes:
      "A masterpiece of cinema that defined the gangster genre. Brando's performance is legendary.",
  },
  {
    imdbUrl: "https://www.imdb.com/title/tt0110912/",
    rating: 9.0,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: 1994,
    posterUrl: "/placeholder.svg",
    notes:
      "Revolutionary non-linear storytelling with unforgettable characters and dialogue.",
  },
  {
    imdbUrl: "https://www.imdb.com/title/tt0468569/",
    rating: 9.0,
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    posterUrl: "/placeholder.svg",
    notes:
      "Redefined superhero films with Heath Ledger's iconic performance as the Joker.",
  },
  {
    imdbUrl: "https://www.imdb.com/title/tt6751668/",
    rating: 8.5,
    title: "Parasite",
    director: "Bong Joon-ho",
    year: 2019,
    posterUrl: "/placeholder.svg",
    notes:
      "A brilliant social commentary with unexpected twists and perfect pacing.",
  },
];

const watchlist: Movie[] = [
  {
    imdbUrl: "https://www.imdb.com/title/tt1160419/",
    rating: 0,
    title: "Dune",
    director: "Denis Villeneuve",
    year: 2021,
    posterUrl: "/placeholder.svg",
    notes: "Heard great things about the visual effects and storytelling.",
  },
  {
    imdbUrl: "https://www.imdb.com/title/tt6710474/",
    rating: 0,
    title: "Everything Everywhere All at Once",
    director: "Daniel Kwan, Daniel Scheinert",
    year: 2022,
    posterUrl: "/placeholder.svg",
    notes:
      "Won multiple Academy Awards and has an intriguing multiverse concept.",
  },
  {
    imdbUrl: "https://www.imdb.com/title/tt8847712/",
    rating: 0,
    title: "The French Dispatch",
    director: "Wes Anderson",
    year: 2021,
    posterUrl: "/placeholder.svg",
    notes: "Love Wes Anderson's unique visual style and storytelling.",
  },
];

const recentlyWatched: Movie[] = [
  {
    imdbUrl: "https://www.imdb.com/title/tt15398776/",
    rating: 8.5,
    title: "Oppenheimer",
    director: "Christopher Nolan",
    year: 2023,
    posterUrl: "/placeholder.svg",
    review:
      "Nolan's most mature work to date. The way he balances the personal story with the historical significance is masterful. Cillian Murphy deserves every award for his performance.",
    notes:
      "A powerful portrayal of the father of the atomic bomb. Cillian Murphy's performance is outstanding.",
  },
  {
    imdbUrl: "https://www.imdb.com/title/tt1877830/",
    rating: 7.8,
    title: "The Batman",
    director: "Matt Reeves",
    year: 2022,
    posterUrl: "/placeholder.svg",
    notes:
      "A dark and gritty take on Batman with excellent cinematography and atmosphere.",
  },
  {
    imdbUrl: "https://www.imdb.com/title/tt1745960/",
    rating: 8.2,
    title: "Top Gun: Maverick",
    director: "Joseph Kosinski",
    year: 2022,
    posterUrl: "/placeholder.svg",
    notes:
      "A thrilling sequel that honors the original while pushing the boundaries of aerial cinematography.",
  },
];

interface Movie {
  imdbUrl: string;
  rating: number;
  title: string;
  director: string;
  year: number | null;
  review?: string;
  notes?: string;
  genres?: string[];
  posterUrl: string;
  isTopMovie?: boolean;
}

function getRatingColor(rating: number) {
  if (rating >= 11) return "bg-yellow-400 text-black";
  if (rating >= 10) return "bg-green-500 text-black";
  if (rating >= 9) return "bg-green-400 text-black";
  if (rating >= 8) return "bg-green-300 text-black";
  if (rating >= 7) return "bg-yellow-400 text-black";
  if (rating >= 6) return "bg-yellow-500 text-black";
  if (rating >= 5) return "bg-orange-400 text-black";
  if (rating >= 4) return "bg-orange-500 text-black";
  if (rating >= 3) return "bg-red-400 text-black";
  return "bg-red-500 text-black";
}

export default function MoviesPage() {
  const [moviesWithPosters, setMoviesWithPosters] = useState<Movie[]>(movies);
  const [topMoviesWithPosters, setTopMoviesWithPosters] =
    useState<Movie[]>(topMovies);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>("highest-rating");

  useEffect(() => {
    async function fetchMovieData() {
      setIsLoading(true);
      try {
        console.log("Fetching movie data...");

        // Fetch data for regular movies
        const updatedMovies = await Promise.all(
          movies.map(async (movie) => {
            console.log(
              `Fetching details for movie with IMDb URL: ${movie.imdbUrl}`
            );
            const movieDetails = await getMovieDetailsFromImdbUrl(
              movie.imdbUrl
            );
            console.log(`Movie details:`, movieDetails);

            if (movieDetails) {
              return {
                ...movie,
                title: movieDetails.title || movie.title,
                director: movieDetails.director || movie.director,
                year: movieDetails.releaseYear || movie.year,
                genres: movieDetails.genres || movie.genres,
                posterUrl: movieDetails.posterPath || "/placeholder.svg",
              };
            }

            console.log(
              `No details found for movie with IMDb URL: ${movie.imdbUrl}`
            );
            return movie;
          })
        );

        // Fetch data for top movies
        const updatedTopMovies = await Promise.all(
          topMovies.map(async (movie) => {
            console.log(
              `Fetching details for top movie with IMDb URL: ${movie.imdbUrl}`
            );
            const movieDetails = await getMovieDetailsFromImdbUrl(
              movie.imdbUrl
            );
            console.log(`Movie details:`, movieDetails);

            if (movieDetails) {
              return {
                ...movie,
                title: movieDetails.title || movie.title,
                director: movieDetails.director || movie.director,
                year: movieDetails.releaseYear || movie.year,
                genres: movieDetails.genres || movie.genres,
                posterUrl: movieDetails.posterPath || "/placeholder.svg",
                isTopMovie: true,
              };
            }

            console.log(
              `No details found for top movie with IMDb URL: ${movie.imdbUrl}`
            );
            return {
              ...movie,
              isTopMovie: true,
            };
          })
        );

        console.log("Updated movies:", updatedMovies);
        console.log("Updated top movies:", updatedTopMovies);
        setMoviesWithPosters(updatedMovies);
        setTopMoviesWithPosters(updatedTopMovies);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovieData();
  }, []);

  const openReviewModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsModalOpen(false);
  };

  const sortMovies = (option: string) => {
    setSortOption(option);
    let sortedMovies = [...moviesWithPosters];

    switch (option) {
      case "highest-rating":
        sortedMovies.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest-rating":
        sortedMovies.sort((a, b) => a.rating - b.rating);
        break;
      case "newest-movie":
        sortedMovies.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case "oldest-movie":
        sortedMovies.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case "newest-seen":
        // Assuming movies are added in order of viewing, newest first
        // No need to sort as they're already in the correct order
        break;
      case "oldest-seen":
        // Reverse the order to show oldest seen first
        sortedMovies.reverse();
        break;
      default:
        sortedMovies.sort((a, b) => b.rating - a.rating);
    }

    setMoviesWithPosters(sortedMovies);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-[95%] mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Movie Collection</h1>
        <p className="text-muted-foreground mb-6">
          A curated collection of my favorite films with personal ratings and
          notes. From classics to modern masterpieces, these are the movies that
          have left a lasting impression on me.
        </p>

        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Top 5 Movies Section */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Top 5 Movies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {topMoviesWithPosters.map((movie, index) => (
                    <TopMovieCard
                      key={movie.title}
                      movie={movie}
                      rank={index + 1}
                      onReviewClick={openReviewModal}
                    />
                  ))}
                </div>
              </section>

              {/* All Movies Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">All Movies</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Sort by:
                    </span>
                    <Select value={sortOption} onValueChange={sortMovies}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select sorting option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="highest-rating">
                          Highest Rating
                        </SelectItem>
                        <SelectItem value="lowest-rating">
                          Lowest Rating
                        </SelectItem>
                        <SelectItem value="newest-seen">Newest Seen</SelectItem>
                        <SelectItem value="oldest-seen">Oldest Seen</SelectItem>
                        <SelectItem value="newest-movie">
                          Newest Movie
                        </SelectItem>
                        <SelectItem value="oldest-movie">
                          Oldest Movie
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
                  {moviesWithPosters.map((movie) => (
                    <div className="scale-90 origin-top h-full">
                      <MovieCard
                        key={movie.title}
                        movie={movie}
                        onReviewClick={openReviewModal}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      {/* Movie Review Modal */}
      {selectedMovie && (
        <MovieReviewModal
          isOpen={isModalOpen}
          onClose={closeReviewModal}
          movie={selectedMovie}
        />
      )}
    </div>
  );
}

function TopMovieCard({
  movie,
  rank,
  onReviewClick,
}: {
  movie: Movie;
  rank: number;
  onReviewClick: (movie: Movie) => void;
}) {
  return (
    <Card
      className={`overflow-hidden h-full flex flex-col ${
        movie.review ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
      onClick={() => movie.review && onReviewClick(movie)}
    >
      <div className="relative">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          width={384}
          height={192}
          className="w-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md font-medium">
          #{rank}
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{movie.title}</CardTitle>
            <CardDescription>
              {movie.director} • {movie.year || "Unknown Year"}
            </CardDescription>
          </div>
          <div
            className={`px-2 py-1 rounded-md font-medium ${getRatingColor(
              movie.rating
            )}`}
          >
            {movie.rating}/10
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-2">
          {movie.genres?.map((genre, index) => (
            <span key={index} className="px-2 py-1 bg-muted text-xs rounded-md">
              {genre}
            </span>
          ))}
        </div>
        {movie.notes && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {movie.notes}
          </p>
        )}
        {movie.review && (
          <div className="mt-2">
            <Button variant="link" size="sm" className="p-0 h-auto">
              Read my full review
            </Button>
          </div>
        )}
      </CardContent>
      <div className="mt-auto p-4 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={movie.imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View on IMDb"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </Card>
  );
}

function MovieCard({
  movie,
  onReviewClick,
}: {
  movie: Movie;
  onReviewClick: (movie: Movie) => void;
}) {
  return (
    <Card
      className={`overflow-hidden h-full flex flex-col ${
        movie.review ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
      onClick={() => movie.review && onReviewClick(movie)}
    >
      <div className="relative">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          width={384}
          height={192}
          className="w-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{movie.title}</CardTitle>
            <CardDescription>
              {movie.director} • {movie.year || "Unknown Year"}
            </CardDescription>
          </div>
          <div
            className={`px-2 py-1 rounded-md font-medium ${getRatingColor(
              movie.rating
            )}`}
          >
            {movie.rating}/10
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-2">
          {movie.genres?.map((genre, index) => (
            <span key={index} className="px-2 py-1 bg-muted text-xs rounded-md">
              {genre}
            </span>
          ))}
        </div>
        {movie.notes && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {movie.notes}
          </p>
        )}
        {movie.review && (
          <div className="mt-2">
            <Button variant="link" size="sm" className="p-0 h-auto">
              Read my full review
            </Button>
          </div>
        )}
      </CardContent>
      <div className="mt-auto p-4 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={movie.imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View on IMDb"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </Card>
  );
}

function WatchlistCard({ movie }: { movie: Movie }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          width={384}
          height={192}
          className="w-full object-cover"
        />
      </div>
      <CardHeader>
        <div>
          <CardTitle>{movie.title}</CardTitle>
          <CardDescription>
            {movie.year || "Unknown Year"} •{" "}
            {movie.genres?.join(", ") || "No genres"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2">
          {movie.genres?.map((genre, index) => (
            <span key={index} className="px-2 py-1 bg-muted text-xs rounded-md">
              {genre}
            </span>
          ))}
        </div>
        {movie.notes && (
          <p className="text-sm text-muted-foreground">{movie.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
