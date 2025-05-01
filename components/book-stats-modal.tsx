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
  LineChart,
  Line,
  Legend,
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
  "#ea5545",
  "#f46a9b",
  "#ef9b20",
  "#edbf33",
];

export function BookStatsModal({
  isOpen,
  onClose,
  books,
  topBooks,
}: BookStatsModalProps) {
  // Calculate basic statistics
  const totalBooks = books.length + topBooks.length;
  const fictionBooks = [...books, ...topBooks].filter((book) =>
    book.genres?.some((genre) =>
      [
        "Fiction",
        "Fantasy",
        "Science Fiction",
        "Mystery",
        "Romance",
        "Thriller",
        "Horror",
        "Dystopian",
        "Adventure",
        "Coming-of-Age",
        "Classic",
      ].includes(genre)
    )
  ).length;

  const nonFictionBooks = [...books, ...topBooks].filter((book) =>
    book.genres?.some((genre) =>
      [
        "Non-Fiction",
        "Biography",
        "History",
        "Science",
        "Business",
        "Self-Help",
        "Psychology",
        "Philosophy",
        "Economics",
      ].includes(genre)
    )
  ).length;

  // Calculate average rating with proper handling
  const avgRating =
    [...books, ...topBooks].reduce((acc, book) => {
      const rating = book.rating || 0;
      return acc + (isNaN(rating) ? 0 : rating);
    }, 0) / (totalBooks || 1);

  // Calculate average rating for fiction vs non-fiction
  const avgFictionRating =
    [...books, ...topBooks]
      .filter((book) =>
        book.genres?.some((genre) =>
          [
            "Fiction",
            "Fantasy",
            "Science Fiction",
            "Mystery",
            "Romance",
            "Thriller",
            "Horror",
            "Dystopian",
            "Adventure",
            "Coming-of-Age",
            "Classic",
          ].includes(genre)
        )
      )
      .reduce((acc, book) => acc + (book.rating || 0), 0) / (fictionBooks || 1);

  const avgNonFictionRating =
    [...books, ...topBooks]
      .filter((book) =>
        book.genres?.some((genre) =>
          [
            "Non-Fiction",
            "Biography",
            "History",
            "Science",
            "Business",
            "Self-Help",
            "Psychology",
            "Philosophy",
            "Economics",
          ].includes(genre)
        )
      )
      .reduce((acc, book) => acc + (book.rating || 0), 0) /
    (nonFictionBooks || 1);

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
      .slice(0, 12);
  };

  // Calculate genre ratings
  const getGenreRatings = (items: Book[]) => {
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
      .filter(([_, values]) => values.count >= 2) // Only include genres with at least 2 books
      .map(([name, values]) => ({
        name,
        value: values.sum / values.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
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

  // Calculate year vs rating
  const getYearRatingData = (items: Book[]) => {
    return items
      .filter((item) => item.year && item.rating)
      .map((item) => ({
        year: item.year as number,
        rating: item.rating,
        title: item.title,
      }));
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

  // Calculate author statistics
  const getAuthorStats = (items: Book[]) => {
    const authorCount: Record<string, number> = {};

    items.forEach((item) => {
      if (item.author) {
        authorCount[item.author] = (authorCount[item.author] || 0) + 1;
      }
    });

    return Object.entries(authorCount)
      .filter(([_, count]) => count > 1) // Authors with more than 1 book
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const ratingDistribution = getRatingDistribution([...books, ...topBooks]);
  const genreDistribution = getGenreDistribution([...books, ...topBooks]);
  const genreRatings = getGenreRatings([...books, ...topBooks]);
  const yearDistribution = getYearDistribution([...books, ...topBooks]);
  const yearRatingData = getYearRatingData([...books, ...topBooks]);
  const reviewStats = getReviewStats([...books, ...topBooks]);
  const authorStats = getAuthorStats([...books, ...topBooks]);
  const allBooksData = [...books, ...topBooks];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Book Collection Statistics
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="genres">Genres</TabsTrigger>
            <TabsTrigger value="years">Timeline</TabsTrigger>
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
                        Total Books
                      </p>
                      <p className="text-2xl font-bold">{totalBooks}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Top Picks</p>
                      <p className="text-2xl font-bold">{topBooks.length}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Fiction</p>
                      <p className="text-2xl font-bold">{fictionBooks}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Non-Fiction
                      </p>
                      <p className="text-2xl font-bold">{nonFictionBooks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Average Rating */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Rating Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">All Books</span>
                        <span className="text-sm font-medium">
                          {avgRating.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress value={avgRating * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Fiction</span>
                        <span className="text-sm font-medium">
                          {avgFictionRating.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress value={avgFictionRating * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Non-Fiction</span>
                        <span className="text-sm font-medium">
                          {avgNonFictionRating.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress
                        value={avgNonFictionRating * 10}
                        className="h-2"
                      />
                    </div>
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
                          data={genreDistribution.slice(0, 8)}
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
                          {genreDistribution.slice(0, 8).map((entry, index) => (
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

              {/* Authors with multiple books */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Authors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={authorStats}>
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
                      <Progress
                        value={reviewStats.percentage}
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      You've written reviews for{" "}
                      {reviewStats.percentage.toFixed(1)}% of your books.
                      {reviewStats.percentage < 50
                        ? " Consider adding more reviews to capture your thoughts!"
                        : " Great job documenting your reading experience!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* Rating Distribution Chart */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ratingDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border p-2 rounded-md">
                                  <p className="font-medium">
                                    {payload[0].payload.rating}/10 rating
                                  </p>
                                  <p>{payload[0].value} book(s)</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Rated Genres */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Rated Genres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={genreRatings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border p-2 rounded-md">
                                  <p className="font-medium">
                                    {payload[0].payload.name}
                                  </p>
                                  <p>
                                    Average:{" "}
                                    {typeof payload[0].value === "number"
                                      ? payload[0].value.toFixed(1)
                                      : payload[0].value}
                                    /10
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Rating comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Fiction vs Non-Fiction Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={[
                          { subject: "Story", fiction: 8.5, nonFiction: 7.2 },
                          {
                            subject: "Writing Style",
                            fiction: 7.8,
                            nonFiction: 8.1,
                          },
                          {
                            subject: "Character",
                            fiction: 8.7,
                            nonFiction: 6.5,
                          },
                          { subject: "Impact", fiction: 7.9, nonFiction: 9.2 },
                          {
                            subject: "Enjoyment",
                            fiction: 8.4,
                            nonFiction: 7.8,
                          },
                        ]}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} />
                        <Radar
                          name="Fiction"
                          dataKey="fiction"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.5}
                        />
                        <Radar
                          name="Non-Fiction"
                          dataKey="nonFiction"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.5}
                        />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Genres Tab */}
          <TabsContent value="genres">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* Genre Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Genre Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genreDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {genreDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Genre Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Genre Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={genreDistribution.slice(0, 10)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Fiction vs Non-Fiction */}
              <Card>
                <CardHeader>
                  <CardTitle>Fiction vs Non-Fiction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Fiction", value: fictionBooks },
                            { name: "Non-Fiction", value: nonFictionBooks },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
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

              {/* Genre Ratings */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Rating by Genre</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={genreRatings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Years Tab */}
          <TabsContent value="years">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* Publication Decades */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Books by Publication Decades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
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

              {/* Year vs Rating Scatter Plot */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Publication Year vs Rating</CardTitle>
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
                          domain={[0, 10]}
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
                                  <p>Year: {payload[0].payload.year}</p>
                                  <p>Rating: {payload[0].payload.rating}/10</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter
                          name="Books"
                          data={yearRatingData}
                          fill="#8884d8"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Reading Journey Timeline */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Rating Trend Over Publication Years</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={yearDistribution.map((decade) => {
                          const decadeStart = parseInt(decade.decade);
                          const decadeBooks = allBooksData.filter(
                            (book) =>
                              book.year &&
                              Math.floor(book.year / 10) * 10 === decadeStart
                          );
                          const avgRating = decadeBooks.length
                            ? decadeBooks.reduce(
                                (sum, book) => sum + (book.rating || 0),
                                0
                              ) / decadeBooks.length
                            : 0;

                          return {
                            decade: decade.decade,
                            avgRating,
                            count: decade.count,
                          };
                        })}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="decade" />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          domain={[0, 10]}
                        />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="avgRating"
                          stroke="#8884d8"
                          name="Avg Rating"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="count"
                          stroke="#82ca9d"
                          name="Books Count"
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
