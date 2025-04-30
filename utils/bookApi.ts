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

export async function getBookDetailsFromIsbn(
  isbn: string
): Promise<BookDetails | null> {
  try {
    // Using Open Library API
    const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Get author details
    let author = "";
    if (data.authors && data.authors[0] && data.authors[0].key) {
      const authorResponse = await fetch(
        `https://openlibrary.org${data.authors[0].key}.json`
      );
      if (authorResponse.ok) {
        const authorData = await authorResponse.json();
        author = authorData.name || "";
      }
    }

    // Get cover image
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

    return {
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
  } catch (error) {
    console.error(`Error fetching book details for ISBN ${isbn}:`, error);
    return null;
  }
}
