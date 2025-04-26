import Image from "next/image"
import { Star, StarHalf, ExternalLink, Filter, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function MoviesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Movie Collection</h1>
        <p className="text-muted-foreground mb-8">
          A curated collection of my favorite films with personal ratings and notes. From classics to modern
          masterpieces, these are the movies that have left a lasting impression on me.
        </p>

        {/* Top 5 Movies Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">My Top 5 Movies of All Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {topMovies.map((movie, index) => (
              <TopMovieCard key={index} movie={movie} rank={index + 1} />
            ))}
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-grow">
            <Input placeholder="Search movies..." />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
                <SelectItem value="thriller">Thriller</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="recently-watched">Recently Watched</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies
                .filter((movie) => movie.rating >= 8)
                .map((movie, index) => (
                  <MovieCard key={index} movie={movie} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="watchlist" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlist.map((movie, index) => (
                <WatchlistCard key={index} movie={movie} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recently-watched" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyWatched.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <section>
          <h2 className="text-2xl font-bold mb-4">Movie Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Movies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{movies.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">8.2</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Most Watched Genre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">Sci-Fi</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

function TopMovieCard({ movie, rank }: { movie: (typeof topMovies)[0]; rank: number }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <div className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
          {rank}
        </div>
        <div className="relative h-48 w-full">
          <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{movie.title}</CardTitle>
        <CardDescription>
          {movie.director} • {movie.year}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center mb-2">
          <div className="text-lg font-bold mr-2">{movie.rating}/10</div>
          <div className="flex">
            {[...Array(Math.floor(movie.rating / 2))].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
            {movie.rating % 2 !== 0 && <StarHalf className="h-4 w-4 fill-primary text-primary" />}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{movie.notes}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={movie.imdbUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            IMDb
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function MovieCard({ movie }: { movie: (typeof movies)[0] }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{movie.title}</CardTitle>
            <CardDescription>
              {movie.director} • {movie.year}
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">{movie.rating}/10</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2">
          {movie.genres.map((genre, index) => (
            <span key={index} className="px-2 py-1 bg-muted text-xs rounded-md">
              {genre}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{movie.notes}</p>
        {movie.review && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">My Review:</h4>
            <Textarea readOnly value={movie.review} className="resize-none text-sm h-24 bg-muted/50" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild>
          <a href={movie.imdbUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            IMDb
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function WatchlistCard({ movie }: { movie: (typeof watchlist)[0] }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{movie.title}</CardTitle>
            <CardDescription>
              {movie.director} • {movie.year}
            </CardDescription>
          </div>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2">
          {movie.genres.map((genre, index) => (
            <span key={index} className="px-2 py-1 bg-muted text-xs rounded-md">
              {genre}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{movie.reason}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild>
          <a href={movie.imdbUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            IMDb
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Sample data
const topMovies = [
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
    genres: ["Drama"],
    rating: 9.5,
    notes: "A timeless tale of hope and redemption. The character development and storytelling are masterful.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt0111161/",
    review:
      "This film changed how I view storytelling. The performances by Tim Robbins and Morgan Freeman are extraordinary, and the narrative structure is perfect. A true masterpiece that I revisit every year.",
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: 1972,
    genres: ["Crime", "Drama"],
    rating: 9.3,
    notes: "A masterpiece of cinema that defined the gangster genre. Brando's performance is legendary.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt0068646/",
    review:
      "The definitive crime drama that set the standard for all films that followed. The pacing, acting, and direction are flawless. Every scene is iconic.",
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: 1994,
    genres: ["Crime", "Drama"],
    rating: 9.0,
    notes: "Revolutionary non-linear storytelling with unforgettable characters and dialogue.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt0110912/",
    review:
      "Tarantino's masterpiece that redefined cinema in the 90s. The dialogue is electric, the performances are perfect, and the structure is revolutionary.",
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
    rating: 9.0,
    notes: "Redefined superhero films with Heath Ledger's iconic performance as the Joker.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt0468569/",
    review:
      "Not just a great superhero film, but a great film period. Heath Ledger's Joker is one of the greatest performances in cinema history.",
  },
  {
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genres: ["Sci-Fi", "Action"],
    rating: 8.8,
    notes: "A mind-bending journey through dreams within dreams. The visual effects and score are outstanding.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt1375666/",
    review:
      "A perfect blend of blockbuster spectacle and intellectual depth. The concept is brilliantly executed, and the visuals are stunning. Hans Zimmer's score elevates every scene.",
  },
]

const movies = [
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
    genres: ["Drama"],
    rating: 9.5,
    notes: "A timeless tale of hope and redemption. The character development and storytelling are masterful.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt0111161/",
    review:
      "This film changed how I view storytelling. The performances by Tim Robbins and Morgan Freeman are extraordinary, and the narrative structure is perfect. A true masterpiece that I revisit every year.",
  },
  {
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genres: ["Sci-Fi", "Action"],
    rating: 8.8,
    notes: "A mind-bending journey through dreams within dreams. The visual effects and score are outstanding.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt1375666/",
    review:
      "A perfect blend of blockbuster spectacle and intellectual depth. The concept is brilliantly executed, and the visuals are stunning. Hans Zimmer's score elevates every scene.",
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: 1972,
    genres: ["Crime", "Drama"],
    rating: 9.3,
    notes: "A masterpiece of cinema that defined the gangster genre. Brando's performance is legendary.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt0068646/",
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: 1994,
    genres: ["Crime", "Drama"],
    rating: 9.0,
    notes: "Revolutionary non-linear storytelling with unforgettable characters and dialogue.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt0110912/",
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
    rating: 9.0,
    notes: "Redefined superhero films with Heath Ledger's iconic performance as the Joker.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt0468569/",
  },
  {
    title: "Parasite",
    director: "Bong Joon Ho",
    year: 2019,
    genres: ["Drama", "Thriller"],
    rating: 8.5,
    notes: "A brilliant social commentary with unexpected twists and perfect pacing.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt6751668/",
  },
]

const watchlist = [
  {
    title: "Dune",
    director: "Denis Villeneuve",
    year: 2021,
    genres: ["Sci-Fi", "Adventure"],
    reason: "Heard great things about the visual effects and storytelling.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt1160419/",
  },
  {
    title: "Everything Everywhere All at Once",
    director: "Daniel Kwan, Daniel Scheinert",
    year: 2022,
    genres: ["Action", "Adventure", "Comedy"],
    reason: "Won multiple Academy Awards and has an intriguing multiverse concept.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt6710474/",
  },
  {
    title: "The French Dispatch",
    director: "Wes Anderson",
    year: 2021,
    genres: ["Comedy", "Drama", "Romance"],
    reason: "Love Wes Anderson's unique visual style and storytelling.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt8847712/",
  },
]

const recentlyWatched = [
  {
    title: "Oppenheimer",
    director: "Christopher Nolan",
    year: 2023,
    genres: ["Biography", "Drama", "History"],
    rating: 8.5,
    notes: "A powerful portrayal of the father of the atomic bomb. Cillian Murphy's performance is outstanding.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt15398776/",
    review:
      "Nolan's most mature work to date. The way he balances the personal story with the historical significance is masterful. Cillian Murphy deserves every award for his performance.",
  },
  {
    title: "The Batman",
    director: "Matt Reeves",
    year: 2022,
    genres: ["Action", "Crime", "Drama"],
    rating: 7.8,
    notes: "A dark and gritty take on Batman with excellent cinematography and atmosphere.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt1877830/",
  },
  {
    title: "Top Gun: Maverick",
    director: "Joseph Kosinski",
    year: 2022,
    genres: ["Action", "Drama"],
    rating: 8.2,
    notes: "A thrilling sequel that honors the original while pushing the boundaries of aerial cinematography.",
    posterUrl: "/placeholder.svg?height=192&width=384",
    imdbUrl: "https://www.imdb.com/title/tt1745960/",
  },
]
