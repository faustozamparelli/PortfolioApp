import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Book } from "@/types/books";
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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BookStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  topBooks: Book[];
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

export function BookStatsModal({
  isOpen,
  onClose,
  books,
  topBooks,
}: BookStatsModalProps) {
  // Calculate basic statistics
  const totalBooks = books.length + topBooks.length;

  // Calculate average rating with proper handling
  const avgRating =
    [...books, ...topBooks].reduce((acc, book) => {
      const rating = book.rating || 0;
      return acc + (isNaN(rating) ? 0 : rating);
    }, 0) / (totalBooks || 1);

  // Calculate rating distribution
  const getRatingDistribution = (items: Book[]) => {
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
  const getGenreDistribution = (items: Book[]) => {
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
  const getYearDistribution = (items: Book[]) => {
    const yearCount: Record<number, number> = {};
    items.forEach((item) => {
      if (item.year) {
        const decade = Math.floor(item.year / 10) * 10;
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
  const getReviewStats = (items: Book[]) => {
    const total = items.length;
    const withReviews = items.filter((item) => item.review).length;
    return {
      total,
      withReviews,
      percentage: (withReviews / total) * 100,
    };
  };

  const ratingDistribution = getRatingDistribution([...books, ...topBooks]);
  const genreDistribution = getGenreDistribution([...books, ...topBooks]);
  const yearDistribution = getYearDistribution([...books, ...topBooks]);
  const reviewStats = getReviewStats([...books, ...topBooks]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Book Collection Statistics
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
                  <p className="text-sm text-muted-foreground">Total Books</p>
                  <p className="text-2xl font-bold">{totalBooks}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Top Picks</p>
                  <p className="text-2xl font-bold">{topBooks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Rating */}
          <Card>
            <CardHeader>
              <CardTitle>Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Books</span>
                    <span className="text-sm font-medium">
                      {avgRating.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={avgRating * 10} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistribution}>
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

          {/* Genre Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Genre Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreDistribution}
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
                      {genreDistribution.map((entry, index) => (
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
              <CardTitle>Publication Decades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearDistribution}>
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
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Reviewed Books</span>
                    <span className="text-sm font-medium">
                      {reviewStats.withReviews}/{reviewStats.total}
                    </span>
                  </div>
                  <Progress value={reviewStats.percentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
