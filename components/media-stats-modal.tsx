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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  const movieYearDistribution = getYearDistribution([...movies, ...topMovies]);
  const showYearDistribution = getYearDistribution([...shows, ...topShows]);
  const movieReviewStats = getReviewStats([...movies, ...topMovies]);
  const showReviewStats = getReviewStats([...shows, ...topShows]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Media Collection Statistics
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overview Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Media</p>
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

          {/* Rating Distribution Charts */}
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

          {/* Genre Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Movie Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={movieGenreDistribution}
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
                      {movieGenreDistribution.map((entry, index) => (
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

          <Card>
            <CardHeader>
              <CardTitle>TV Show Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={showGenreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#82ca9d"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {showGenreDistribution.map((entry, index) => (
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

          {/* Year Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Movie Release Decades</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle>TV Show Release Decades</CardTitle>
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

          {/* Review Statistics */}
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
                      {movieReviewStats.withReviews}/{movieReviewStats.total}
                    </span>
                  </div>
                  <Progress
                    value={movieReviewStats.percentage}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
