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
import { useState, useEffect, useCallback, useMemo } from "react";
import { getBookDetailsFromIsbn } from "@/utils/bookApi";
import { useDataPreload } from "@/hooks/use-data-preload";

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

// Book metadata - this information is pre-populated to avoid excessive API calls
const bookMetadata: Record<
  string,
  {
    title: string;
    author: string;
    year: number;
    genres: string[];
    coverUrl: string;
    description: string;
  }
> = {
  "9780060850524": {
    title: "Brave New World",
    author: "Aldous Huxley",
    year: 1932,
    genres: ["Fiction", "Science Fiction", "Dystopian"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg",
    description:
      "Set in a futuristic World State, inhabited by genetically modified citizens and an intelligence-based social hierarchy, the novel anticipates huge scientific advancements in reproductive technology, sleep-learning, psychological manipulation and classical conditioning.",
  },
  "9780141439518": {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 1813,
    genres: ["Fiction", "Romance", "Classic"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    description:
      "The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of the British Regency.",
  },
  "9780316769488": {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    year: 1951,
    genres: ["Fiction", "Coming-of-Age"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg",
    description:
      "The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school. Confused and disillusioned, he searches for truth and rails against the 'phoniness' of the adult world.",
  },
  "9780618640157": {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    year: 1954,
    genres: ["Fiction", "Fantasy", "Adventure"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg",
    description:
      "The Lord of the Rings is an epic high-fantasy novel by English author and scholar J. R. R. Tolkien. Set in Middle-earth, a world inspired by European mythology, the story began as a sequel to Tolkien's 1937 children's book The Hobbit.",
  },
  "9780307474278": {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    year: 2005,
    genres: ["Fiction", "Mystery", "Thriller"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg",
    description:
      "The novel combines murder mystery, family saga, love story, and financial intrigue into a complex and atmospheric novel.",
  },
  "9781400033416": {
    title: "The Road",
    author: "Cormac McCarthy",
    year: 2006,
    genres: ["Fiction", "Post-Apocalyptic", "Dystopian"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781400033416-L.jpg",
    description:
      "The Road is a 2006 post-apocalyptic novel by American writer Cormac McCarthy. The book details the grueling journey of a father and his young son over a period of several months across a landscape blasted by an unspecified cataclysm that has destroyed industrial civilization and almost all life.",
  },
  "9780307277671": {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    year: 2003,
    genres: ["Fiction", "Historical Fiction"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780307277671-L.jpg",
    description:
      "The story is set against a backdrop of tumultuous events, from the fall of Afghanistan's monarchy through the Soviet invasion, the exodus of refugees to Pakistan and the United States, and the rise of the Taliban regime.",
  },
  "9780062315007": {
    title: "The Alchemist",
    author: "Paulo Coelho",
    year: 1988,
    genres: ["Fiction", "Fantasy", "Philosophical"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
    description:
      "The Alchemist follows the journey of an Andalusian shepherd boy named Santiago. Believing a recurring dream to be prophetic, he asks a Gypsy fortune teller in the nearby town about its meaning.",
  },
  "9780679783268": {
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    year: 1866,
    genres: ["Fiction", "Psychological", "Classic"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780679783268-L.jpg",
    description:
      "The novel focuses on the mental anguish and moral dilemmas of Rodion Raskolnikov, an impoverished ex-student in Saint Petersburg who formulates a plan to kill an unscrupulous pawnbroker for her money.",
  },
  "9780141988511": {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    year: 2011,
    genres: ["Non-Fiction", "History", "Science", "Anthropology"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780141988511-L.jpg",
    description:
      "The book surveys the history of humankind from the evolution of archaic human species in the Stone Age up to the twenty-first century, focusing on Homo sapiens.",
  },
  "9780143127550": {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    year: 2011,
    genres: ["Non-Fiction", "Psychology", "Economics"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780143127550-L.jpg",
    description:
      "The book's main thesis is that of a dichotomy between two modes of thought: System 1 is fast, instinctive and emotional; System 2 is slower, more deliberative, and more logical.",
  },
  "9780140449334": {
    title: "Meditations",
    author: "Marcus Aurelius",
    year: 180,
    genres: ["Non-Fiction", "Philosophy", "Stoicism"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg",
    description:
      "Meditations is a series of personal writings by Marcus Aurelius, Roman Emperor from AD 161 to 180, recording his private notes to himself and ideas on Stoic philosophy.",
  },
  "9780143127741": {
    title: "The Power of Habit",
    author: "Charles Duhigg",
    year: 2012,
    genres: ["Non-Fiction", "Psychology", "Self-Help"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780143127741-L.jpg",
    description:
      "The Power of Habit explores the science behind habit creation and reformation. The book takes us to the thrilling edge of scientific discoveries that explain why habits exist and how they can be changed.",
  },
  "9780062316110": {
    title: "Freakonomics",
    author: "Steven D. Levitt, Stephen J. Dubner",
    year: 2005,
    genres: ["Non-Fiction", "Economics", "Sociology"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg",
    description:
      "Freakonomics explores the hidden side of everything. The book examines how the economic approach to human behavior and incentives can explain seemingly counterintuitive outcomes in everyday life.",
  },
  "9780316017930": {
    title: "Outliers: The Story of Success",
    author: "Malcolm Gladwell",
    year: 2008,
    genres: ["Non-Fiction", "Psychology", "Sociology"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780316017930-L.jpg",
    description:
      "Outliers examines the factors that contribute to high levels of success. Throughout the publication, Gladwell repeatedly mentions the '10,000-Hour Rule', claiming that the key to achieving expertise in any skill is practicing the correct way for a total of around 10,000 hours.",
  },
};

// Mock data for books
const books: Book[] = [
  {
    isbn: "9780060850524", // Brave New World
    rating: 8.5,
    review:
      "A dystopian masterpiece that remains eerily relevant. Huxley's vision of a society controlled through pleasure rather than pain is brilliantly realized.",
  },
  {
    isbn: "9780141439518", // Pride and Prejudice
    rating: 9.0,
    review:
      "Austen's wit and social commentary shine through this classic romance. Elizabeth Bennet's journey feels as fresh and relevant as ever.",
  },
  {
    isbn: "9780316769488", // The Catcher in the Rye
    rating: 7.8,
    review:
      "Holden Caulfield's voice is unforgettable. A perfect encapsulation of teenage alienation and rebellion.",
  },
  {
    isbn: "9780618640157", // The Lord of the Rings
    rating: 9.5,
    review:
      "The definitive fantasy epic. Tolkien created not just a story but an entire world with its own history, languages, and mythology.",
  },
  {
    isbn: "9780307474278", // The Girl with the Dragon Tattoo
    rating: 8.2,
    review:
      "A gripping thriller with unforgettable characters. Lisbeth Salander is one of the most compelling protagonists in modern fiction.",
  },
  {
    isbn: "9781400033416", // The Road
    rating: 9.0,
    review:
      "McCarthy's sparse prose creates a hauntingly beautiful post-apocalyptic landscape. A father-son journey that is both devastating and tender.",
  },
  {
    isbn: "9780307277671", // The Kite Runner
    rating: 8.7,
  },
  {
    isbn: "9780062315007", // The Alchemist
    rating: 7.5,
  },
  {
    isbn: "9780679783268", // Crime and Punishment
    rating: 9.2,
  },
  {
    isbn: "9780141988511", // Sapiens
    rating: 9.3,
    review:
      "Harari's sweeping history of humankind is thought-provoking and accessible. His ability to connect disparate ideas and present them clearly is remarkable.",
  },
  {
    isbn: "9780143127550", // Thinking, Fast and Slow
    rating: 8.9,
    review:
      "Kahneman's exploration of the two systems of thinking has changed how I understand decision-making and cognitive biases.",
  },
  {
    isbn: "9780140449334", // Meditations
    rating: 9.1,
  },
  {
    isbn: "9780143127741", // The Power of Habit
    rating: 8.4,
  },
  {
    isbn: "9780062316110", // Freakonomics
    rating: 7.9,
  },
  {
    isbn: "9780316017930", // Outliers
    rating: 8.6,
  },
];

// Top favorite books
const topBooks: Book[] = [
  {
    isbn: "9780618640157", // The Lord of the Rings
    rating: 9.5,
    review:
      "The definitive fantasy epic. Tolkien created not just a story but an entire world with its own history, languages, and mythology.",
  },
  {
    isbn: "9780141988511", // Sapiens
    rating: 9.3,
    review:
      "Harari's sweeping history of humankind is thought-provoking and accessible. His ability to connect disparate ideas and present them clearly is remarkable.",
  },
  {
    isbn: "9780679783268", // Crime and Punishment
    rating: 9.2,
    review:
      "Dostoevsky's psychological depth is unmatched. This exploration of guilt, redemption, and morality continues to resonate powerfully.",
  },
  {
    isbn: "9780140449334", // Meditations
    rating: 9.1,
    review:
      "Marcus Aurelius's timeless wisdom continues to offer practical guidance. Stoic philosophy distilled into accessible reflections.",
  },
  {
    isbn: "9780141439518", // Pride and Prejudice
    rating: 9.0,
    review:
      "Austen's wit and social commentary shine through this classic romance. Elizabeth Bennet's journey feels as fresh and relevant as ever.",
  },
  {
    isbn: "9781400033416", // The Road
    rating: 9.0,
    review:
      "McCarthy's sparse prose creates a hauntingly beautiful post-apocalyptic landscape. A father-son journey that is both devastating and tender.",
  },
];

export default function BooksPage() {
  const { data, preloadBooks } = useDataPreload();
  const [booksWithCovers, setBooksWithCovers] = useState<Book[]>([]);
  const [topBooksWithCovers, setTopBooksWithCovers] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>("highest-rating");
  const [originalOrder, setOriginalOrder] = useState<Book[]>([]);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [bookSortOption, setBookSortOption] = useState("highest-rating");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch detailed book data only when opening modal
  const fetchDetailedBookData = useCallback(
    async (book: Book): Promise<Book> => {
      // If we already have fetched the details, just return the book
      if (book.title && book.author) {
        return book;
      }

      try {
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
      } catch (error) {
        console.error(`Error fetching details for book ${book.isbn}:`, error);
      }

      return book;
    },
    []
  );

  useEffect(() => {
    // Trigger preload data for books
    preloadBooks();

    // Keep existing books loading logic for now
    async function loadBookData() {
      setIsLoading(true);
      try {
        // Use the pre-populated metadata for faster loading
        const enhancedBooks = books.map((book) => {
          const metadata = bookMetadata[book.isbn];
          if (metadata) {
            return {
              ...book,
              ...metadata,
            };
          }
          return book;
        });

        const enhancedTopBooks = topBooks.map((book) => {
          const metadata = bookMetadata[book.isbn];
          if (metadata) {
            return {
              ...book,
              ...metadata,
              isTopBook: true,
            };
          }
          return { ...book, isTopBook: true };
        });

        // Store the original order
        setOriginalOrder(enhancedBooks);

        // Sort books by rating (highest first) initially
        const sortedBooks = [...enhancedBooks].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );

        setBooksWithCovers(sortedBooks);
        setTopBooksWithCovers(enhancedTopBooks);
      } catch (error) {
        console.error("Error loading book data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookData();
  }, [preloadBooks]);

  const openBookReviewModal = async (book: Book) => {
    setIsLoading(true);
    // Fetch detailed data only when opening the modal
    const detailedBook = await fetchDetailedBookData(book);
    setSelectedBook(detailedBook);
    setIsBookModalOpen(true);
    setIsLoading(false);
  };

  const closeBookReviewModal = () => {
    setIsBookModalOpen(false);
  };

  const sortBooks = (option: string) => {
    setBookSortOption(option);
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
        "Dystopian",
        "Adventure",
        "Philosophical",
        "Coming-of-Age",
        "Classic",
        "Historical Fiction",
        "Post-Apocalyptic",
        "Psychological",
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
        "Philosophy",
        "Economics",
        "Sociology",
        "Anthropology",
        "Stoicism",
      ].includes(genre)
    )
  );

  // Filter books based on search query
  const filterBooksBySearchQuery = useCallback(
    (books: Book[], query: string) => {
      if (!query.trim()) {
        return books;
      }
      const lowerCaseQuery = query.toLowerCase();
      return books.filter(
        (book) =>
          (book.title && book.title.toLowerCase().includes(lowerCaseQuery)) ||
          (book.author && book.author.toLowerCase().includes(lowerCaseQuery)) ||
          (book.description &&
            book.description.toLowerCase().includes(lowerCaseQuery)) ||
          (book.genres &&
            book.genres.some((genre) =>
              genre.toLowerCase().includes(lowerCaseQuery)
            ))
      );
    },
    []
  );

  // Filtered books
  const filteredFictionBooks = useMemo(
    () => filterBooksBySearchQuery(fictionBooks, searchQuery),
    [fictionBooks, searchQuery, filterBooksBySearchQuery]
  );
  const filteredNonFictionBooks = useMemo(
    () => filterBooksBySearchQuery(nonFictionBooks, searchQuery),
    [nonFictionBooks, searchQuery, filterBooksBySearchQuery]
  );

  // Combined filtered books for search across all books
  const allFilteredBooks = useMemo(
    () => filterBooksBySearchQuery(booksWithCovers, searchQuery),
    [booksWithCovers, searchQuery, filterBooksBySearchQuery]
  );

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
                    key={`${book.title}-${book.year}-${index}`}
                    book={book}
                    rank={index + 1}
                    onReviewClick={openBookReviewModal}
                  />
                ))}
              </div>
            </section>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search books by title, author, or genre..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Show search results across all books if there's a search query */}
            {searchQuery && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold">Search Results</h2>
                  <div className="px-2 py-1 bg-muted rounded-md text-sm">
                    {allFilteredBooks.length}
                  </div>
                </div>
                {allFilteredBooks.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {allFilteredBooks.map((book, index) => (
                      <div
                        key={`search-${book.isbn}-${index}`}
                        className="h-full"
                      >
                        <BookCard
                          book={book}
                          onReviewClick={openBookReviewModal}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No books found matching "{searchQuery}"
                  </div>
                )}
              </section>
            )}

            {/* Tabs for Non-Fiction and Fiction */}
            <Tabs
              defaultValue="non-fiction"
              className={searchQuery ? "opacity-50" : "w-full"}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="non-fiction">Non-Fiction</TabsTrigger>
                <TabsTrigger value="fiction">Fiction</TabsTrigger>
              </TabsList>

              <TabsContent value="non-fiction">
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">Non-Fiction Books</h2>
                      <div className="px-2 py-1 bg-muted rounded-md text-sm">
                        {nonFictionBooks.length}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Sort by:
                      </span>
                      <Select value={bookSortOption} onValueChange={sortBooks}>
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
                          <SelectItem value="newest-read">
                            Newest Read
                          </SelectItem>
                          <SelectItem value="oldest-read">
                            Oldest Read
                          </SelectItem>
                          <SelectItem value="newest-book">
                            Newest Book
                          </SelectItem>
                          <SelectItem value="oldest-book">
                            Oldest Book
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {!searchQuery &&
                      filteredNonFictionBooks.map((book, index) => (
                        <div key={`${book.isbn}-${index}`} className="h-full">
                          <BookCard
                            book={book}
                            onReviewClick={openBookReviewModal}
                          />
                        </div>
                      ))}
                    {filteredNonFictionBooks.length === 0 && !searchQuery && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        No non-fiction books found
                      </div>
                    )}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="fiction">
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">Fiction Books</h2>
                      <div className="px-2 py-1 bg-muted rounded-md text-sm">
                        {fictionBooks.length}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Sort by:
                      </span>
                      <Select value={bookSortOption} onValueChange={sortBooks}>
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
                          <SelectItem value="newest-read">
                            Newest Read
                          </SelectItem>
                          <SelectItem value="oldest-read">
                            Oldest Read
                          </SelectItem>
                          <SelectItem value="newest-book">
                            Newest Book
                          </SelectItem>
                          <SelectItem value="oldest-book">
                            Oldest Book
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {!searchQuery &&
                      filteredFictionBooks.map((book, index) => (
                        <div key={`${book.isbn}-${index}`} className="h-full">
                          <BookCard
                            book={book}
                            onReviewClick={openBookReviewModal}
                          />
                        </div>
                      ))}
                    {filteredFictionBooks.length === 0 && !searchQuery && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        No fiction books found
                      </div>
                    )}
                  </div>
                </section>
              </TabsContent>
            </Tabs>
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

function BookCard({
  book,
  onReviewClick,
}: {
  book: Book;
  onReviewClick: (book: Book) => void;
}) {
  return (
    <Card
      className={`overflow-hidden h-full flex flex-col ${
        book.review ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
      onClick={() => book.review && onReviewClick(book)}
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={book.coverUrl || "/placeholder.svg"}
          alt={book.title || "Book cover"}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base truncate">
              {book.title || "Loading..."}
            </CardTitle>
            <CardDescription className="text-xs truncate">
              {book.author || "Unknown"} • {book.year || "Unknown Year"}
            </CardDescription>
          </div>
          <div
            className={`px-2 py-1 rounded-md font-medium text-sm shrink-0 ${getRatingColor(
              book.rating
            )}`}
          >
            {Number.isInteger(book.rating)
              ? book.rating
              : book.rating.toFixed(1)}
            /10
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {book.genres?.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-muted text-xs rounded-md"
            >
              {genre}
            </span>
          ))}
          {book.genres && book.genres.length > 2 && (
            <span className="px-1.5 py-0.5 bg-muted text-xs rounded-md">
              +{book.genres.length - 2}
            </span>
          )}
        </div>
        {book.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {book.description}
          </p>
        )}
        {book.review && (
          <div className="mt-1">
            <Button variant="link" size="sm" className="p-0 h-auto text-xs">
              Read my full review
            </Button>
          </div>
        )}
      </CardContent>
      <div className="p-3 pt-0 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-6 w-6"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={`https://www.goodreads.com/book/isbn/${book.isbn}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View on Goodreads"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
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
    <Card
      className={`overflow-hidden h-full flex flex-col ${
        book.review ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
      onClick={() => book.review && onReviewClick(book)}
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={book.coverUrl || "/placeholder.svg"}
          alt={book.title || "Book cover"}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md font-medium text-sm">
          #{rank}
        </div>
      </div>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base truncate">
              {book.title || "Loading..."}
            </CardTitle>
            <CardDescription className="text-xs truncate">
              {book.author || "Unknown"} • {book.year || "Unknown Year"}
            </CardDescription>
          </div>
          <div
            className={`px-2 py-1 rounded-md font-medium text-sm shrink-0 ${getRatingColor(
              book.rating
            )}`}
          >
            {Number.isInteger(book.rating)
              ? book.rating
              : book.rating.toFixed(1)}
            /10
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {book.genres?.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-muted text-xs rounded-md"
            >
              {genre}
            </span>
          ))}
          {book.genres && book.genres.length > 2 && (
            <span className="px-1.5 py-0.5 bg-muted text-xs rounded-md">
              +{book.genres.length - 2}
            </span>
          )}
        </div>
        {book.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {book.description}
          </p>
        )}
        {book.review && (
          <div className="mt-1">
            <Button variant="link" size="sm" className="p-0 h-auto text-xs">
              Read my full review
            </Button>
          </div>
        )}
      </CardContent>
      <div className="p-3 pt-0 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-6 w-6"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={`https://www.goodreads.com/book/isbn/${book.isbn}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View on Goodreads"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </Card>
  );
}

function getRatingColor(rating: number) {
  if (rating >= 10) return "bg-amber-500/20 text-amber-500"; // Gold for 10-11
  if (rating >= 9) return "bg-emerald-500/20 text-emerald-500"; // Emerald for 9-9.9
  if (rating >= 8) return "bg-green-500/20 text-green-500"; // Green for 8-8.9
  if (rating >= 7) return "bg-teal-500/20 text-teal-500"; // Teal for 7-7.9
  if (rating >= 6) return "bg-blue-500/20 text-blue-500"; // Blue for 6-6.9
  if (rating >= 5) return "bg-indigo-500/20 text-indigo-500"; // Indigo for 5-5.9
  if (rating >= 4) return "bg-purple-500/20 text-purple-500"; // Purple for 4-4.9
  if (rating >= 3) return "bg-yellow-500/20 text-yellow-500"; // Yellow for 3-3.9
  if (rating >= 2) return "bg-orange-500/20 text-orange-500"; // Orange for 2-2.9
  return "bg-red-500/20 text-red-500"; // Red for 0-1.9
}
