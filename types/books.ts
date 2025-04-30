export interface Book {
  isbn: string;
  rating: number; // Required field, 0-10 with one decimal
  review?: string;
  isTopBook?: boolean;
  // These fields are populated by the API
  title?: string;
  author?: string;
  year?: number | null;
  description?: string;
  genres?: string[];
  coverUrl?: string;
  pages?: number;
  publisher?: string;
}
