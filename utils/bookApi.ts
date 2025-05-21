interface BookDetails {
  title?: string;
  author?: string;
  year?: number;
  genres?: string[];
  coverUrl?: string;
  description?: string;
  pages?: number;
  publisher?: string;
}

// Book metadata for fallback - this information is pre-populated to avoid excessive API calls
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
  // Add more fallback data for common books
};

// Cache for book data to avoid repeated API calls
const bookCache: Record<string, BookDetails> = {};

export async function getBookDetailsFromIsbn(
  isbn: string
): Promise<BookDetails | null> {
  try {
    // Check if we have this book in our fallback data
    if (bookMetadata[isbn]) {
      console.log(`Using fallback data for book ${isbn}`);
      return bookMetadata[isbn];
    }

    // Check if we have this book in our cache
    if (bookCache[isbn]) {
      console.log(`Using cached data for book ${isbn}`);
      return bookCache[isbn];
    }

    // Using our proxy API route to avoid CORS issues
    const response = await fetch(
      `/api/books?url=${encodeURIComponent(
        `https://openlibrary.org/isbn/${isbn}.json`
      )}`
    );

    // If there's an error, try to at least get the cover image
    if (!response.ok) {
      console.warn(`HTTP error for book ${isbn}: ${response.status}`);

      // Provide a minimal fallback with just the cover
      const fallback: BookDetails = {
        title: `Book (ISBN: ${isbn})`,
        coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
      };

      // Cache this minimal response to avoid repeated failed calls
      bookCache[isbn] = fallback;
      return fallback;
    }

    const data = await response.json();

    // Get author details
    let author = "";
    try {
      if (data.authors && data.authors[0] && data.authors[0].key) {
        const authorResponse = await fetch(
          `/api/books?url=${encodeURIComponent(
            `https://openlibrary.org${data.authors[0].key}.json`
          )}`
        );
        if (authorResponse.ok) {
          const authorData = await authorResponse.json();
          author = authorData.name || "";
        }
      }
    } catch (authorError) {
      console.warn(`Error fetching author for book ${isbn}:`, authorError);
      // Continue with empty author if there's an error
    }

    // Get cover image - no need to proxy this as it's just an image
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

    const bookDetails = {
      title: data.title,
      author,
      year: data.publish_date
        ? parseInt(data.publish_date.split("-")[0])
        : undefined,
      genres: data.subjects || [],
      coverUrl,
      description: data.description?.value || data.description,
      pages: data.number_of_pages,
      publisher: data.publishers?.[0],
    };

    // Cache successful responses
    bookCache[isbn] = bookDetails;

    return bookDetails;
  } catch (error) {
    console.error(`Error fetching book details for ISBN ${isbn}:`, error);

    // Return a minimal fallback with just the ISBN and cover URL
    const fallback: BookDetails = {
      title: `Book (ISBN: ${isbn})`,
      coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
    };

    // Cache this minimal response to avoid repeated failed calls
    bookCache[isbn] = fallback;
    return fallback;
  }
}
