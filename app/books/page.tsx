"use client";

import Image from "next/image";
import {
  BookOpen,
  ExternalLink,
  Search,
  Star,
  StarHalf,
  Filter,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getBookDetailsFromIsbn } from "@/utils/bookApi";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookReviewModal } from "@/components/book-review-modal";
import { BookStatsModal } from "@/components/book-stats-modal";
import { Book } from "@/types/books";

export default function BooksPage() {
  const [booksWithCovers, setBooksWithCovers] = useState<Book[]>([]);
  const [topBooksWithCovers, setTopBooksWithCovers] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>("highest-rating");
  const [originalOrder, setOriginalOrder] = useState<Book[]>([]);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"fiction" | "non-fiction">(
    "fiction"
  );

  useEffect(() => {
    async function fetchBookData() {
      setIsLoading(true);
      try {
        // Fetch data for regular books
        const updatedBooks = await Promise.all(
          books.map(async (book) => {
            const bookDetails = await getBookDetailsFromIsbn(book.isbn);
            if (bookDetails) {
              return {
                ...book,
                title: bookDetails.title || book.title,
                author: bookDetails.author || book.author,
                year: bookDetails.year || book.year,
                genres: bookDetails.genres || book.genres,
                coverUrl: bookDetails.coverUrl || "/placeholder.svg",
                description: bookDetails.description || "",
                pages: bookDetails.pages,
                publisher: bookDetails.publisher,
              };
            }
            return book;
          })
        );

        // Fetch data for top books
        const updatedTopBooks = await Promise.all(
          topBooks.map(async (book) => {
            const bookDetails = await getBookDetailsFromIsbn(book.isbn);
            if (bookDetails) {
              return {
                ...book,
                title: bookDetails.title || book.title,
                author: bookDetails.author || book.author,
                year: bookDetails.year || book.year,
                genres: bookDetails.genres || book.genres,
                coverUrl: bookDetails.coverUrl || "/placeholder.svg",
                description: bookDetails.description || "",
                pages: bookDetails.pages,
                publisher: bookDetails.publisher,
                isTopBook: true,
              };
            }
            return { ...book, isTopBook: true };
          })
        );

        // Store the original order
        setOriginalOrder(updatedBooks);

        // Sort books by rating (highest first) initially
        const sortedBooks = [...updatedBooks].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
        setBooksWithCovers(sortedBooks);
        setTopBooksWithCovers(updatedTopBooks);
      } catch (error) {
        console.error("Error fetching book data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookData();
  }, []);

  const openBookReviewModal = (book: Book) => {
    setSelectedBook(book);
    setIsBookModalOpen(true);
  };

  const closeBookReviewModal = () => {
    setIsBookModalOpen(false);
  };

  const sortBooks = (option: string) => {
    setSortOption(option);
    let sortedBooks = [...booksWithCovers];

    switch (option) {
      case "highest-rating":
        sortedBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "lowest-rating":
        sortedBooks.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "newest-book":
        sortedBooks.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case "oldest-book":
        sortedBooks.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case "newest-read":
        sortedBooks = [...originalOrder].reverse();
        break;
      case "oldest-read":
        sortedBooks = [...originalOrder];
        break;
      default:
        sortedBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setBooksWithCovers(sortedBooks);
  };

  // Filter books by type
  const fictionBooks = booksWithCovers.filter((book) =>
    book.genres?.some((genre) =>
      [
        "Fiction",
        "Fantasy",
        "Science Fiction",
        "Mystery",
        "Romance",
        "Thriller",
        "Horror",
      ].includes(genre)
    )
  );
  const nonFictionBooks = booksWithCovers.filter((book) =>
    book.genres?.some((genre) =>
      [
        "Non-Fiction",
        "Biography",
        "History",
        "Science",
        "Business",
        "Self-Help",
        "Psychology",
      ].includes(genre)
    )
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-[98%] mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">My Book Collection</h1>
          <Button onClick={() => setIsStatsModalOpen(true)}>
            View Statistics
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">
          A curated collection of books I have read with personal ratings and
          reviews. From classics to contemporary works, these are the books that
          have shaped my thinking and perspective.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Top Books Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Favourite Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topBooksWithCovers.map((book, index) => (
                  <TopBookCard
                    key={`${book.title}-${book.year}`}
                    book={book}
                    rank={index + 1}
                    onReviewClick={openBookReviewModal}
                  />
                ))}
              </div>
            </section>

            {/* All Books Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">All Books</h2>
                  <div className="px-2 py-1 bg-muted rounded-md text-sm">
                    {booksWithCovers.length + topBooksWithCovers.length}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Sort by:
                  </span>
                  <Select value={sortOption} onValueChange={sortBooks}>
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
                      <SelectItem value="newest-read">Newest Read</SelectItem>
                      <SelectItem value="oldest-read">Oldest Read</SelectItem>
                      <SelectItem value="newest-book">Newest Book</SelectItem>
                      <SelectItem value="oldest-book">Oldest Book</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "fiction" | "non-fiction")
                }
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fiction">Fiction</TabsTrigger>
                  <TabsTrigger value="non-fiction">Non-Fiction</TabsTrigger>
                </TabsList>
                <TabsContent value="fiction">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {fictionBooks.map((book) => (
                      <div key={book.isbn} className="h-full">
                        <BookCard
                          book={book}
                          onReviewClick={openBookReviewModal}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="non-fiction">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {nonFictionBooks.map((book) => (
                      <div key={book.isbn} className="h-full">
                        <BookCard
                          book={book}
                          onReviewClick={openBookReviewModal}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          </>
        )}
      </div>

      {/* Stats Modal */}
      <BookStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        books={booksWithCovers}
        topBooks={topBooksWithCovers}
      />

      {/* Book Review Modal */}
      {selectedBook && (
        <BookReviewModal
          isOpen={isBookModalOpen}
          onClose={closeBookReviewModal}
          book={selectedBook}
        />
      )}
    </div>
  );
}

function FavoriteBookCard({
  book,
  rank,
}: {
  book: (typeof favoriteBooks)[0];
  rank: number;
}) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <div className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
          {rank}
        </div>
        <div className="relative h-48 w-full">
          <Image
            src={book.coverUrl || "/placeholder.svg"}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{book.title}</CardTitle>
        <CardDescription>{book.author}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center mb-2">
          <div className="text-lg font-bold mr-2">{book.rating}/10</div>
          <div className="flex">
            {[...Array(Math.floor(book.rating / 2))].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
            {book.rating % 2 !== 0 && (
              <StarHalf className="h-4 w-4 fill-primary text-primary" />
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {book.notes}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={book.goodreadsUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Goodreads
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

function BookCard({
  book,
  onReviewClick,
}: {
  book: Book;
  onReviewClick: (book: Book) => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="p-4">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md">
          <Image
            src={book.coverUrl || "/placeholder.svg"}
            alt={book.title || "Book cover"}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
        <CardDescription className="mt-1">
          {book.author} • {book.year}
        </CardDescription>
        <div className="mt-2 flex items-center gap-1">
          <div className={getRatingColor(book.rating)}>
            <div className="flex items-center gap-1 px-2 py-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">
                {book.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onReviewClick(book)}
          >
            Review
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a
              href={`https://www.goodreads.com/book/isbn/${book.isbn}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function TopBookCard({
  book,
  rank,
  onReviewClick,
}: {
  book: Book;
  rank: number;
  onReviewClick: (book: Book) => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="p-4">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md">
          <Image
            src={book.coverUrl || "/placeholder.svg"}
            alt={book.title || "Book cover"}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {rank}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
        <CardDescription className="mt-1">
          {book.author} • {book.year}
        </CardDescription>
        <div className="mt-2 flex items-center gap-1">
          <div className={getRatingColor(book.rating)}>
            <div className="flex items-center gap-1 px-2 py-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">
                {book.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onReviewClick(book)}
          >
            Review
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a
              href={`https://www.goodreads.com/book/isbn/${book.isbn}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function getRatingColor(rating: number) {
  if (rating >= 9) return "bg-green-500/20 text-green-500";
  if (rating >= 7) return "bg-blue-500/20 text-blue-500";
  if (rating >= 5) return "bg-yellow-500/20 text-yellow-500";
  return "bg-red-500/20 text-red-500";
}

// Sample data
const favoriteBooks = [
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    type: "Non-Fiction",
    genres: ["Psychology", "Economics"],
    rating: 9.5,
    notes:
      "A fascinating look at the two systems that drive the way we think and make decisions.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl:
      "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow",
    review:
      "This book completely changed how I understand human decision making. Kahneman's insights into cognitive biases are profound and applicable to everyday life.",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    type: "Non-Fiction",
    genres: ["History", "Science"],
    rating: 9.2,
    notes:
      "A thought-provoking exploration of human history and our species' impact on the world.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/23692271-sapiens",
    review:
      "Harari has a gift for making complex historical concepts accessible and engaging. His perspective on human evolution and society is eye-opening.",
  },
  {
    title: "1984",
    author: "George Orwell",
    type: "Fiction",
    genres: ["Dystopian", "Classic"],
    rating: 9.0,
    notes:
      "A chilling portrayal of a totalitarian future that feels increasingly relevant today.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/5470.1984",
    review:
      "Orwell's vision of the future remains as powerful and disturbing today as when it was written. The concepts of doublethink and thoughtcrime are brilliant literary inventions.",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    type: "Non-Fiction",
    genres: ["Self-Help", "Psychology"],
    rating: 8.8,
    notes:
      "A practical guide to building good habits and breaking bad ones through small changes.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/40121378-atomic-habits",
    review:
      "The most practical book on habit formation I've ever read. Clear's 1% improvement concept has transformed how I approach personal development.",
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    type: "Fiction",
    genres: ["Fantasy", "Adventure"],
    rating: 9.3,
    notes:
      "The epic fantasy that defined the genre and created a richly detailed world.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl:
      "https://www.goodreads.com/book/show/33.The_Lord_of_the_Rings",
    review:
      "The gold standard for world-building in fiction. Tolkien's attention to detail and mythological depth created a universe that feels completely real.",
  },
];

const topBooks: Book[] = [
  {
    isbn: "9780062315007", // The Alchemist
    rating: 11,
    review:
      "A timeless masterpiece that teaches the importance of following your dreams and listening to your heart. The story of Santiago's journey to find his Personal Legend is both simple and profound, making it a book that can be read multiple times with new insights each time.",
    isTopBook: true,
  },
  {
    isbn: "9780061120084", // To Kill a Mockingbird
    rating: 10.5,
    review:
      "A powerful exploration of racial injustice and moral growth through the eyes of a child. Harper Lee's masterpiece remains relevant today, teaching important lessons about empathy, courage, and standing up for what's right.",
    isTopBook: true,
  },
  {
    isbn: "9780743273565", // The Great Gatsby
    rating: 10,
    review:
      "Fitzgerald's portrayal of the American Dream and the Jazz Age is both beautiful and tragic. The novel's themes of wealth, love, and the pursuit of happiness resonate deeply, making it a must-read for understanding American literature.",
    isTopBook: true,
  },
];

const books: Book[] = [
  {
    isbn: "9780140283334", // The Catcher in the Rye
    rating: 8.5,
    review:
      "Holden Caulfield's journey through New York City is a powerful exploration of teenage alienation and the search for authenticity in a world that often feels phony.",
  },
  {
    isbn: "9780141439518", // Pride and Prejudice
    rating: 9.0,
    review:
      "Jane Austen's witty social commentary and the development of Elizabeth Bennet and Mr. Darcy's relationship make this a timeless classic of English literature.",
  },
  {
    isbn: "9780141182605", // 1984
    rating: 9.5,
    review:
      "Orwell's dystopian masterpiece remains chillingly relevant, offering a stark warning about totalitarianism, surveillance, and the manipulation of truth.",
  },
];
