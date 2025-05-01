import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Movie, TVShow } from "@/types/media";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  topMovies: Movie[];
  shows: TVShow[];
  topShows: TVShow[];
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
  "#ff8042",
  "#ea5545",
  "#f46a9b",
  "#ef9b20",
  "#edbf33",
];

export function MediaStatsModal({
  isOpen,
  onClose,
  movies,
  topMovies,
  shows,
  topShows,
}: MediaStatsModalProps) {
  // Calculate basic statistics
  const totalMovies = movies.length + topMovies.length;
  const totalShows = shows.length + topShows.length;
  const totalMedia = totalMovies + totalShows;

  // Calculate average ratings with proper handling
  const avgMovieRating =
    [...movies, ...topMovies].reduce((acc, movie) => {
      const rating = movie.rating || 0;
      return acc + (isNaN(rating) ? 0 : rating);
    }, 0) / (totalMovies || 1);

  const avgShowRating =
    [...shows, ...topShows].reduce((acc, show) => {
      const rating = show.rating || 0;
      return acc + (isNaN(rating) ? 0 : rating);
    }, 0) / (totalShows || 1);

  // Calculate rating distribution
  const getRatingDistribution = (items: (Movie | TVShow)[]) => {
    const distribution = Array(11).fill(0);
    items.forEach((item) => {
      const rating = Math.floor(item.rating || 0);
      if (!isNaN(rating) && rating >= 0 && rating <= 10) {
        distribution[rating]++;
      }
    });
    return distribution.map((count, rating) => ({
      rating: rating.toString(),
      count,
    }));
  };

  // Calculate genre distribution
  const getGenreDistribution = (items: (Movie | TVShow)[]) => {
    const genreCount: Record<string, number> = {};
    items.forEach((item) => {
      item.genres?.forEach((genre) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });
    return Object.entries(genreCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  // Calculate genre ratings
  const getGenreRatings = (items: (Movie | TVShow)[]) => {
    const genreRatings: Record<string, { sum: number; count: number }> = {};

    items.forEach((item) => {
      item.genres?.forEach((genre) => {
        if (!genreRatings[genre]) {
          genreRatings[genre] = { sum: 0, count: 0 };
        }
        genreRatings[genre].sum += item.rating || 0;
        genreRatings[genre].count += 1;
      });
    });

    return Object.entries(genreRatings)
      .filter(([_, values]) => values.count >= 2) // Only include genres with at least 2 items
      .map(([name, values]) => ({
        name,
        value: values.sum / values.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  // Calculate year distribution
  const getYearDistribution = (items: (Movie | TVShow)[]) => {
    const yearCount: Record<number, number> = {};
    items.forEach((item) => {
      const year = (item as Movie).year || (item as TVShow).firstAirYear;
      if (year) {
        const decade = Math.floor(year / 10) * 10;
        yearCount[decade] = (yearCount[decade] || 0) + 1;
      }
    });
    return Object.entries(yearCount)
      .map(([decade, count]) => ({
        decade: `${decade}s`,
        count,
      }))
      .sort((a, b) => parseInt(a.decade) - parseInt(b.decade));
  };

  // Calculate year vs rating data for scatter plot
  const getYearRatingData = (items: (Movie | TVShow)[]) => {
    return items
      .filter((item) => {
        const year = (item as Movie).year || (item as TVShow).firstAirYear;
        return year !== undefined && item.rating !== undefined;
      })
      .map((item) => {
        const year = (item as Movie).year || (item as TVShow).firstAirYear;
        return {
          year: year as number,
          rating: item.rating,
          title: (item as Movie).title || (item as TVShow).title || "Unknown",
          type: "movie" in item ? "Movie" : "TV Show",
        };
      });
  };

  // Calculate review statistics
  const getReviewStats = (items: (Movie | TVShow)[]) => {
    const total = items.length;
    const withReviews = items.filter((item) => item.review).length;
    return {
      total,
      withReviews,
      percentage: (withReviews / total) * 100,
    };
  };

  // Calculate creators/directors statistics
  const getCreatorStats = (items: (Movie | TVShow)[]) => {
    const creatorCount: Record<string, number> = {};

    items.forEach((item) => {
      const creator =
        "director" in item
          ? (item as Movie).director
          : (item as TVShow).creator;

      if (creator) {
        creatorCount[creator] = (creatorCount[creator] || 0) + 1;
      }
    });

    return Object.entries(creatorCount)
      .filter(([_, count]) => count > 1) // Creators with more than 1 item
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const movieRatingDistribution = getRatingDistribution([
    ...movies,
    ...topMovies,
  ]);
  const showRatingDistribution = getRatingDistribution([...shows, ...topShows]);
  const movieGenreDistribution = getGenreDistribution([
    ...movies,
    ...topMovies,
  ]);
  const showGenreDistribution = getGenreDistribution([...shows, ...topShows]);
  const allGenreDistribution = getGenreDistribution([
    ...movies,
    ...topMovies,
    ...shows,
    ...topShows,
  ]);
  const movieGenreRatings = getGenreRatings([...movies, ...topMovies]);
  const showGenreRatings = getGenreRatings([...shows, ...topShows]);
  const movieYearDistribution = getYearDistribution([...movies, ...topMovies]);
  const showYearDistribution = getYearDistribution([...shows, ...topShows]);
  const allYearDistribution = getYearDistribution([
    ...movies,
    ...topMovies,
    ...shows,
    ...topShows,
  ]);
  const yearRatingData = getYearRatingData([
    ...movies,
    ...topMovies,
    ...shows,
    ...topShows,
  ]);
  const movieReviewStats = getReviewStats([...movies, ...topMovies]);
  const showReviewStats = getReviewStats([...shows, ...topShows]);
  const movieDirectorStats = getCreatorStats([...movies, ...topMovies]);
  const showCreatorStats = getCreatorStats([...shows, ...topShows]);
  const allMediaData = [...movies, ...topMovies, ...shows, ...topShows];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Media Collection Statistics
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="tvshows">TV Shows</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* Overview Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Collection Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Total Media
                      </p>
                      <p className="text-2xl font-bold">{totalMedia}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Movies</p>
                      <p className="text-2xl font-bold">{totalMovies}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">TV Shows</p>
                      <p className="text-2xl font-bold">{totalShows}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Top Picks</p>
                      <p className="text-2xl font-bold">
                        {topMovies.length + topShows.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Average Ratings */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">All Media</span>
                        <span className="text-sm font-medium">
                          {(
                            (avgMovieRating * totalMovies +
                              avgShowRating * totalShows) /
                            totalMedia
                          ).toFixed(1)}
                          /10
                        </span>
                      </div>
                      <Progress
                        value={
                          ((avgMovieRating * totalMovies +
                            avgShowRating * totalShows) /
                            totalMedia) *
                          10
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Movies</span>
                        <span className="text-sm font-medium">
                          {avgMovieRating.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress value={avgMovieRating * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">TV Shows</span>
                        <span className="text-sm font-medium">
                          {avgShowRating.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress value={avgShowRating * 10} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Movies vs TV Shows Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Movies vs TV Shows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Movies", value: totalMovies },
                            { name: "TV Shows", value: totalShows },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          <Cell fill="#8884d8" />
                          <Cell fill="#82ca9d" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Genres Overall */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Genres Overall</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={allGenreDistribution.slice(0, 8)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Ratings Distribution Comparison */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Rating Distribution Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                          (rating) => ({
                            rating: rating.toString(),
                            movies:
                              movieRatingDistribution.find(
                                (m) => m.rating === rating.toString()
                              )?.count || 0,
                            shows:
                              showRatingDistribution.find(
                                (s) => s.rating === rating.toString()
                              )?.count || 0,
                          })
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="movies" name="Movies" fill="#8884d8" />
                        <Bar dataKey="shows" name="TV Shows" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Movies Tab */}
          <TabsContent value="movies">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* Movie Distribution by Ratings */}
              <Card>
                <CardHeader>
                  <CardTitle>Movie Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={movieRatingDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Movie Genres Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Movie Genres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={movieGenreDistribution.slice(0, 8)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {movieGenreDistribution
                            .slice(0, 8)
                            .map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Movie Decade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Movies by Decade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={movieYearDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="decade" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Movie Directors */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Directors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={movieDirectorStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={150} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Rated Movie Genres */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Rated Movie Genres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={movieGenreRatings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip
                          formatter={(value) => [
                            Number(value).toFixed(1),
                            "Avg Rating",
                          ]}
                        />
                        <Bar dataKey="value" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Movie Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Movie Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Reviewed Movies</span>
                        <span className="text-sm font-medium">
                          {movieReviewStats.withReviews}/
                          {movieReviewStats.total}
                        </span>
                      </div>
                      <Progress
                        value={movieReviewStats.percentage}
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      You've written reviews for{" "}
                      {movieReviewStats.percentage.toFixed(1)}% of your movies.
                      {movieReviewStats.percentage < 50
                        ? " Consider adding more reviews!"
                        : " Great job documenting your watching experience!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TV Shows Tab */}
          <TabsContent value="tvshows">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* TV Show Rating Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>TV Show Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={showRatingDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* TV Show Genres Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>TV Show Genres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={showGenreDistribution.slice(0, 8)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {showGenreDistribution
                            .slice(0, 8)
                            .map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* TV Show Decade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>TV Shows by Decade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={showYearDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="decade" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* TV Show Creators */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Creators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={showCreatorStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={150} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Rated TV Show Genres */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Rated TV Show Genres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={showGenreRatings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip
                          formatter={(value) => [
                            Number(value).toFixed(1),
                            "Avg Rating",
                          ]}
                        />
                        <Bar dataKey="value" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* TV Show Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>TV Show Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Reviewed Shows</span>
                        <span className="text-sm font-medium">
                          {showReviewStats.withReviews}/{showReviewStats.total}
                        </span>
                      </div>
                      <Progress
                        value={showReviewStats.percentage}
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      You've written reviews for{" "}
                      {showReviewStats.percentage.toFixed(1)}% of your TV shows.
                      {showReviewStats.percentage < 50
                        ? " Consider adding more reviews!"
                        : " Great job documenting your watching experience!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* Release Decades Overall */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Release Decades Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={allYearDistribution.map((decade) => {
                          const decadeStart = parseInt(decade.decade);
                          const movieCount =
                            movieYearDistribution.find(
                              (d) => d.decade === decade.decade
                            )?.count || 0;
                          const showCount =
                            showYearDistribution.find(
                              (d) => d.decade === decade.decade
                            )?.count || 0;

                          return {
                            decade: decade.decade,
                            movies: movieCount,
                            shows: showCount,
                          };
                        })}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="decade" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="movies"
                          name="Movies"
                          stackId="a"
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="shows"
                          name="TV Shows"
                          stackId="a"
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Year vs Rating Scatter Plot */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Year vs Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid />
                        <XAxis type="number" dataKey="year" name="Year" />
                        <YAxis
                          type="number"
                          dataKey="rating"
                          name="Rating"
                          domain={[0, 11]}
                        />
                        <ZAxis type="category" dataKey="title" name="Title" />
                        <Tooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border p-2 rounded-md">
                                  <p className="font-medium">
                                    {payload[0].payload.title}
                                  </p>
                                  <p>
                                    {payload[0].payload.type} (
                                    {payload[0].payload.year})
                                  </p>
                                  <p>Rating: {payload[0].payload.rating}/10</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                        <Scatter
                          name="Media"
                          data={yearRatingData}
                          fill="#8884d8"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Rating Trends Over Decades */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Rating Trends Over Decades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={allYearDistribution.map((decade) => {
                          const decadeStart = parseInt(decade.decade);

                          const decadeMovies = [...movies, ...topMovies].filter(
                            (movie) =>
                              movie.year &&
                              Math.floor(movie.year / 10) * 10 === decadeStart
                          );
                          const avgMovieRating = decadeMovies.length
                            ? decadeMovies.reduce(
                                (sum, movie) => sum + (movie.rating || 0),
                                0
                              ) / decadeMovies.length
                            : 0;

                          const decadeShows = [...shows, ...topShows].filter(
                            (show) =>
                              show.firstAirYear &&
                              Math.floor(show.firstAirYear / 10) * 10 ===
                                decadeStart
                          );
                          const avgShowRating = decadeShows.length
                            ? decadeShows.reduce(
                                (sum, show) => sum + (show.rating || 0),
                                0
                              ) / decadeShows.length
                            : 0;

                          return {
                            decade: decade.decade,
                            movieRating: avgMovieRating,
                            showRating: avgShowRating,
                          };
                        })}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="decade" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip
                          formatter={(value) => [
                            Number(value).toFixed(1),
                            "Avg Rating",
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="movieRating"
                          stroke="#8884d8"
                          name="Movie Avg Rating"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="showRating"
                          stroke="#82ca9d"
                          name="TV Show Avg Rating"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
