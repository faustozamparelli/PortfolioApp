"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  SpotifyTrack,
  SpotifyArtist,
  SpotifyPlaylist,
  MusicItem,
  getPlaylistById,
  getMusicDetailsFromSpotifyUrl,
  getUserTopTracks,
  getUserTopArtists,
  getUserPlaylists,
  fetchPlaylistsInBatch,
} from "@/utils/spotifyApi";
import { Book } from "@/types/books";
import { getBookDetailsFromIsbn } from "@/utils/bookApi";
import { getMovieDetailsFromImdbUrl } from "@/utils/movieApi";
import { getTVDetailsFromImdbUrl } from "@/utils/tvApi";

// Types for media items
interface Movie {
  imdbUrl: string;
  rating: number;
  review?: string;
  isTopMovie?: boolean;
  title?: string;
  director?: string;
  year?: number | null;
  overview?: string;
  genres?: string[];
  posterUrl?: string;
}

interface TVShow {
  imdbUrl: string;
  rating: number;
  review?: string;
  isTopShow?: boolean;
  title?: string;
  creator?: string;
  firstAirYear?: number | null;
  overview?: string;
  genres?: string[];
  posterUrl?: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
}

// Types for the preloaded data
interface PreloadedData {
  music: {
    loaded: boolean;
    loading: boolean;
    error: string | null;
    favoriteSongs: SpotifyTrack[];
    favoriteArtists: MusicItem[];
    topTracks: SpotifyTrack[];
    topArtists: SpotifyArtist[];
    playlists: SpotifyPlaylist[];
    manualPlaylists: any[];
  };
  books: {
    loaded: boolean;
    loading: boolean;
    error: string | null;
    booksList: Book[];
    topBooks: Book[];
  };
  media: {
    loaded: boolean;
    loading: boolean;
    error: string | null;
    moviesList: Movie[];
    tvList: TVShow[];
    topMovies: Movie[];
    topTVShows: TVShow[];
  };
}

// Initial state
const initialState: PreloadedData = {
  music: {
    loaded: false,
    loading: false,
    error: null,
    favoriteSongs: [],
    favoriteArtists: [],
    topTracks: [],
    topArtists: [],
    playlists: [],
    manualPlaylists: [],
  },
  books: {
    loaded: false,
    loading: false,
    error: null,
    booksList: [],
    topBooks: [],
  },
  media: {
    loaded: false,
    loading: false,
    error: null,
    moviesList: [],
    tvList: [],
    topMovies: [],
    topTVShows: [],
  },
};

// Checkpoint storage keys for localStorage
const CHECKPOINT_KEYS = {
  MUSIC: "data_preload_music_checkpoint",
  BOOKS: "data_preload_books_checkpoint",
  MEDIA: "data_preload_media_checkpoint",
};

// Context setup
const DataPreloadContext = createContext<{
  data: PreloadedData;
  preloadMusic: () => Promise<void>;
  preloadBooks: () => Promise<void>;
  preloadMedia: () => Promise<void>;
  preloadAll: () => void;
  resetMusic: () => void;
  resetBooks: () => void;
  resetMedia: () => void;
}>({
  data: initialState,
  preloadMusic: async () => {},
  preloadBooks: async () => {},
  preloadMedia: async () => {},
  preloadAll: () => {},
  resetMusic: () => {},
  resetBooks: () => {},
  resetMedia: () => {},
});

// Manual playlists URLs from music page
const MY_PLAYLISTS = [
  "https://open.spotify.com/playlist/3FS5wKeNT7vvadtFYqDLRo", // BEST (4)EVER
  "https://open.spotify.com/playlist/07h5SwwXN71WWooHooWXDJ", // Eventually
  "https://open.spotify.com/playlist/5ouJiG6KMFZ5MYNqOd2mMu", // Rotation
  "https://open.spotify.com/playlist/0mBY3992twtb08xkyo82nd", // 100% bops
  "https://open.spotify.com/playlist/1BpQoiUYCmDr2Ey6obvU9r", // Stranger
  "https://open.spotify.com/playlist/3mgsxAN7hma9pWTkJ6NFEs", // DJ7
  "https://open.spotify.com/playlist/6kRYLNLx0UxQBcEU1Uygjp", // Sfascio
  "https://open.spotify.com/playlist/5PpWmuf9v6lYeyIUNwcOsm", // Overthinking
  "https://open.spotify.com/playlist/0RHNS7CWwDpCwyVsYVX8Ts", // Estate
  "https://open.spotify.com/playlist/4wYsuynBL54ixYKPYyNCwE", // Sunset
  "https://open.spotify.com/playlist/1qXWnpCKo3HEqZRDKXLNt9", // hot
  "https://open.spotify.com/playlist/1vWR9KLyirVaAc0tPSm90P", // Manners
  "https://open.spotify.com/playlist/6xIImQekZs49bIsH4wmsgQ", // fregauncazzo
  "https://open.spotify.com/playlist/0KbYxKsExPPf7xuizhIGxx", // uk
  "https://open.spotify.com/playlist/4VOxTdmzrPFT3vQ9XBINoi", // italy
];

// Manually added favorite artists with rankings
const favoriteArtists: MusicItem[] = [
  {
    spotifyUrl: "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x",
    type: "artist",
    rating: 11,
    review:
      "Ok here me out... I'm not even going to defend the person that he has become, I really hope he will find himself again. But his music has really changed my life, he truly is a genious artist and I invite you to listen to some of his less known stuff like 'Roses', 'Only One', 'Never See Me Again with Orchestral Intro', 'Brothers'... Thank me later.",
    rank: 1,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/1wxPItEzr7U7rGSMPqZ25r",
    type: "artist",
    rating: 11,
    review:
      "I am going based soley on the impact and influnce this guy/girl had on the music industry. He is the Satoshi Nakamoto of music.",
    rank: 2,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4",
    type: "artist",
    rating: 10.8,
    review:
      "Greatest rapper of all time, I don't care what anyone says. This guy has released so many bangers, he can't miss. If you are a Kendrick Lamar fan, get a ear transplant I don't know what to tell you.",
    rank: 3,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/6lcwlkAjBPSKnFBZjjZFJs",
    type: "artist",
    rating: 10.5,
    review:
      "I don't know how to describe this style the best thing that comes to mind rewatching an old VHS tape from your childhood and feeling a mix of nostalgia and sadness.",
    rank: 4,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/4MCBfE4596Uoi2O4DtmEMz",
    type: "artist",
    rating: 10,
    review:
      "RIP to the goat, pure talent... go listen to his freestyles. I have to base the ratings also on how many liked songs I have per artist and this guy completely carried my 2017/18/19.",
    rank: 5,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/1QAJqy2dA3ihHBFIHRphZj",
    type: "artist",
    rating: 10,
    review: "If you wanna cry, this is it.",
    rank: 6,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/15UsOTVnJzReFVN1VCnxy4",
    type: "artist",
    rating: 9.5,
    review:
      "RIP, I loved his evolution and how much he changed style, it's a shame that he is not here with us because I 100% believe he would have still been on the top.",
    rank: 8,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/0z4gvV4rjIZ9wHck67ucSV",
    type: "artist",
    rating: 9.5,
    review: "",
    rank: 9
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/6FBDaR13swtiWwGhX1WQsP",
    type: "artist",
    rating: 9.0,
    review: "",
    rank: 10
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/31TPClRtHm23RisEBtV3X7",
    type: "artist",
    rating: 8.8,
    review: "",
    rank: 11
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/4O15NlyKLIASxsJ0PrXPfz",
    type: "artist",
    rating: 8.8,
    review: "",
    rank: 12
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/6EPlBSH2RSiettczlz7ihV",
    type: "artist",
    rating: 8.5,
    review:
      "Kinda controversial, many say that he has only one flow but I have a ton of his songs in my liked, I could hear them on repeat.",
    rank: 13
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/4dpARuHxo51G3z768sgnrY",
    type: "artist",
    rating: 8.5,
    review: "For real men only...",
    rank: 14
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/1WaFQSHVGZQJTbf0BdxdNo",
    type: "artist",
    rating: 8,
    review: "",
    rank: 15
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/4oLeXFyACqeem2VImYeBFe",
    type: "artist",
    rating: 8,
    review: "",
    rank: 16
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/0fA0VVWsXO9YnASrzqfmYu",
    type: "artist",
    rating: 8,
    review: "",
    rank: 17
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/5H4yInM5zmHqpKIoMNAx4r",
    type: "artist",
    rating: 7.5,
    review: "",
    rank: 18
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/3tlXnStJ1fFhdScmQeLpuG",
    type: "artist",
    rating: 7.5,
    review: "",
    rank: 19
  }
]

// Provider component
export const DataPreloadProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<PreloadedData>(() => {
    // Try to load initial state from localStorage checkpoints
    if (typeof window !== "undefined") {
      try {
        // Load music checkpoint
        const musicCheckpoint = localStorage.getItem(CHECKPOINT_KEYS.MUSIC);
        const booksCheckpoint = localStorage.getItem(CHECKPOINT_KEYS.BOOKS);
        const mediaCheckpoint = localStorage.getItem(CHECKPOINT_KEYS.MEDIA);

        const initialDataWithCheckpoints = { ...initialState };

        if (musicCheckpoint) {
          try {
            const parsedMusicData = JSON.parse(musicCheckpoint);
            initialDataWithCheckpoints.music = {
              ...initialState.music,
              ...parsedMusicData,
              loaded: true,
              loading: false,
              error: null,
            };
            console.log("Loaded music data from checkpoint");
          } catch (e) {
            console.warn("Error parsing music checkpoint:", e);
          }
        }

        if (booksCheckpoint) {
          try {
            const parsedBooksData = JSON.parse(booksCheckpoint);
            initialDataWithCheckpoints.books = {
              ...initialState.books,
              ...parsedBooksData,
              loaded: true,
              loading: false,
              error: null,
            };
            console.log("Loaded books data from checkpoint");
          } catch (e) {
            console.warn("Error parsing books checkpoint:", e);
          }
        }

        if (mediaCheckpoint) {
          try {
            const parsedMediaData = JSON.parse(mediaCheckpoint);
            initialDataWithCheckpoints.media = {
              ...initialState.media,
              ...parsedMediaData,
              loaded: true,
              loading: false,
              error: null,
            };
            console.log("Loaded media data from checkpoint");
          } catch (e) {
            console.warn("Error parsing media checkpoint:", e);
          }
        }

        return initialDataWithCheckpoints;
      } catch (e) {
        console.warn("Error loading checkpoints:", e);
      }
    }

    return initialState;
  });

  // Extract playlist ID from URL
  const extractPlaylistId = (url: string): string => {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  };

  // Function to save checkpoints to localStorage
  const saveCheckpoint = useCallback(
    (type: "music" | "books" | "media", checkpointData: any) => {
      if (typeof window === "undefined") return;

      try {
        // Skip saving if there's no data or it's loading
        if (!checkpointData || checkpointData.loading) return;

        const key =
          type === "music"
            ? CHECKPOINT_KEYS.MUSIC
            : type === "books"
            ? CHECKPOINT_KEYS.BOOKS
            : CHECKPOINT_KEYS.MEDIA;

        // Don't save the loading and error state
        const { loading, error, ...dataToSave } = checkpointData;

        localStorage.setItem(key, JSON.stringify(dataToSave));
        console.log(`Saved ${type} checkpoint`);
      } catch (e) {
        console.warn(`Error saving ${type} checkpoint:`, e);
      }
    },
    []
  );

  // Function to preload music data
  const preloadMusic = useCallback(async () => {
    // If already loaded or loading, don't do anything
    if (data.music.loaded || data.music.loading) return;

    // Set loading state
    setData((prev) => ({
      ...prev,
      music: {
        ...prev.music,
        loading: true,
      },
    }));

    try {
      // 1. Load favorite artists details - this is a small batch, so do this first
      const artistDetailsPromises = favoriteArtists.map(async (artist) => {
        try {
          const details = await getMusicDetailsFromSpotifyUrl(
            artist.spotifyUrl
          );
          if (details) {
            return {
              ...artist,
              name: details.name || artist.name,
              coverUrl: details.coverUrl || "/placeholder.svg",
              genres: details.genres || [],
              popularity: details.popularity || 0,
            };
          }
          return artist;
        } catch (error) {
          console.error(
            `Error fetching details for artist ${artist.spotifyUrl}:`,
            error
          );
          return artist;
        }
      });

      // Execute artist details requests in parallel (they're cached so this is fast)
      const updatedFavoriteArtists = await Promise.all(artistDetailsPromises);

      // 2. Load the BEST (4)EVER playlist for favorite songs
      let favoriteSongs: SpotifyTrack[] = [];
      try {
        // This specific playlist contains the favorite songs
        const bestEverPlaylist = await getPlaylistById(
          "3FS5wKeNT7vvadtFYqDLRo",
          true
        );
        if (bestEverPlaylist && bestEverPlaylist.tracks?.items?.length > 0) {
          favoriteSongs = bestEverPlaylist.tracks.items.map(
            (item: any) => item.track
          );
        }
      } catch (error) {
        console.error("Error fetching BEST (4)EVER playlist:", error);
      }

      // 3. Load top tracks - this gives us something to show if BEST (4)EVER fails
      let topTracks: SpotifyTrack[] = [];
      try {
        topTracks = await getUserTopTracks();
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }

      // 4. Load playlists in batch with minimal data (name, image, count only)
      let playlists: SpotifyPlaylist[] = [];
      try {
        playlists = await fetchPlaylistsInBatch(MY_PLAYLISTS);
      } catch (error) {
        console.error("Error fetching playlists in batch:", error);
      }

      // 5. Load top artists - not as critical, do this last
      let topArtists: SpotifyArtist[] = [];
      try {
        topArtists = await getUserTopArtists();
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }

      // Create initial music data with what we have so far
      const musicData = {
        loaded: true,
        loading: false,
        error: null,
        favoriteSongs: favoriteSongs.length > 0 ? favoriteSongs : topTracks, // Use top tracks as fallback
        favoriteArtists: updatedFavoriteArtists,
        topTracks,
        topArtists,
        playlists: [],
        manualPlaylists: playlists,
      };

      // Update state
      setData((prev) => ({
        ...prev,
        music: musicData,
      }));

      // Save checkpoint
      saveCheckpoint("music", musicData);
    } catch (error) {
      console.error("Error preloading music data:", error);
      setData((prev) => ({
        ...prev,
        music: {
          ...prev.music,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    }
  }, [data.music.loaded, data.music.loading, saveCheckpoint]);

  // Function to preload books data
  const preloadBooks = useCallback(async () => {
    // If already loaded or loading, don't do anything
    if (data.books.loaded || data.books.loading) return;

    // Set loading state
    setData((prev) => ({
      ...prev,
      books: {
        ...prev.books,
        loading: true,
      },
    }));

    try {
      // Create a queue for API calls similar to the music queue
      const queue = async <T,>(
        tasks: (() => Promise<T>)[],
        concurrency = 1,
        delayMs = 500
      ): Promise<T[]> => {
        const results: T[] = [];
        const runningTasks: Promise<void>[] = [];

        for (let i = 0; i < tasks.length; i++) {
          const task = async () => {
            if (i > 0)
              await new Promise((resolve) => setTimeout(resolve, delayMs));
            try {
              const result = await tasks[i]();
              results.push(result);
            } catch (error) {
              console.error(`Task ${i} failed:`, error);
              // Push null or default value depending on the expected return type
              results.push(null as unknown as T);
            }
          };

          const runningTask = task();
          runningTasks.push(runningTask);

          if (runningTasks.length >= concurrency) {
            await Promise.race(runningTasks);
            // Use a different approach to check which tasks are completed
            const newRunningTasks = [];
            for (const task of runningTasks) {
              // If the Promise is still pending (not settled), keep it in the running tasks
              const isCompleted = await Promise.race([
                task.then(() => true).catch(() => true),
                new Promise((resolve) => setTimeout(() => resolve(false), 0)),
              ]);

              if (!isCompleted) {
                newRunningTasks.push(task);
              }
            }
            // Replace the running tasks array with only pending tasks
            runningTasks.length = 0;
            runningTasks.push(...newRunningTasks);
          }
        }

        await Promise.all(runningTasks);
        return results.filter(Boolean);
      };

      // Books data from the books page
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
        // More books...
      ];

      // Top favorite books
      const topBooks: Book[] = [
        {
          isbn: "9780618640157", // The Lord of the Rings
          rating: 9.5,
          review:
            "The definitive fantasy epic. Tolkien created not just a story but an entire world with its own history, languages, and mythology.",
          isTopBook: true,
        },
        {
          isbn: "9780141988511", // Sapiens
          rating: 9.3,
          review:
            "Harari's sweeping history of humankind is thought-provoking and accessible. His ability to connect disparate ideas and present them clearly is remarkable.",
          isTopBook: true,
        },
        // More top books...
      ];

      // Fetch details for each book
      const bookDetailsTasks = books.map((book) => async () => {
        try {
          const details = await getBookDetailsFromIsbn(book.isbn);
          if (details) {
            return {
              ...book,
              title: details.title,
              author: details.author,
              year: details.year,
              genres: details.genres,
              coverUrl: details.coverUrl,
              description: details.description,
              pages: details.pages,
              publisher: details.publisher,
            };
          }
          return book;
        } catch (error) {
          console.error(`Error fetching details for book ${book.isbn}:`, error);
          return book;
        }
      });

      const topBookDetailsTasks = topBooks.map((book) => async () => {
        try {
          const details = await getBookDetailsFromIsbn(book.isbn);
          if (details) {
            return {
              ...book,
              title: details.title,
              author: details.author,
              year: details.year,
              genres: details.genres,
              coverUrl: details.coverUrl,
              description: details.description,
              pages: details.pages,
              publisher: details.publisher,
            };
          }
          return book;
        } catch (error) {
          console.error(
            `Error fetching details for top book ${book.isbn}:`,
            error
          );
          return book;
        }
      });

      // Process book details in parallel with concurrency limit
      const enhancedBooks = await queue(bookDetailsTasks, 3, 300);
      const enhancedTopBooks = await queue(topBookDetailsTasks, 3, 300);

      // Create the books data object
      const booksData = {
        loaded: true,
        loading: false,
        error: null,
        booksList: enhancedBooks,
        topBooks: enhancedTopBooks,
      };

      // Update state
      setData((prev) => ({
        ...prev,
        books: booksData,
      }));

      // Save checkpoint
      saveCheckpoint("books", booksData);
    } catch (error) {
      console.error("Error preloading books data:", error);
      setData((prev) => ({
        ...prev,
        books: {
          ...prev.books,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    }
  }, [data.books.loaded, data.books.loading, saveCheckpoint]);

  // Function to preload media data
  const preloadMedia = useCallback(async () => {
    // If already loaded or loading, don't do anything
    if (data.media.loaded || data.media.loading) return;

    // Set loading state
    setData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        loading: true,
      },
    }));

    try {
      // Create a queue for API calls
      const queue = async <T,>(
        tasks: (() => Promise<T>)[],
        concurrency = 1,
        delayMs = 500
      ): Promise<T[]> => {
        const results: T[] = [];
        const runningTasks: Promise<void>[] = [];

        for (let i = 0; i < tasks.length; i++) {
          const task = async () => {
            if (i > 0)
              await new Promise((resolve) => setTimeout(resolve, delayMs));
            try {
              const result = await tasks[i]();
              results.push(result);
            } catch (error) {
              console.error(`Task ${i} failed:`, error);
              // Push null or default value depending on the expected return type
              results.push(null as unknown as T);
            }
          };

          const runningTask = task();
          runningTasks.push(runningTask);

          if (runningTasks.length >= concurrency) {
            await Promise.race(runningTasks);
            // Use a different approach to check which tasks are completed
            const newRunningTasks = [];
            for (const task of runningTasks) {
              // If the Promise is still pending (not settled), keep it in the running tasks
              const isCompleted = await Promise.race([
                task.then(() => true).catch(() => true),
                new Promise((resolve) => setTimeout(() => resolve(false), 0)),
              ]);

              if (!isCompleted) {
                newRunningTasks.push(task);
              }
            }
            // Replace the running tasks array with only pending tasks
            runningTasks.length = 0;
            runningTasks.push(...newRunningTasks);
          }
        }

        await Promise.all(runningTasks);
        return results.filter(Boolean);
      };

      // Sample top movies data from the media page
      const topMovies: Movie[] = [
        {
          // Demolition
          imdbUrl: "https://www.imdb.com/title/tt1172049/",
          rating: 11,
          review: "The most UNDERRATED movie OF ALL TIME...",
          isTopMovie: true,
        },
        {
          // Forrest Gump
          imdbUrl: "https://www.imdb.com/title/tt0109830/",
          rating: 11,
          review: "Truly perfection, a timeless masterpiece...",
          isTopMovie: true,
        },
        // More top movies...
      ];

      // Sample movies data
      const movies: Movie[] = [
        {
          // The Karate Kid
          imdbUrl: "https://www.imdb.com/title/tt0087538/",
          rating: 8.5,
          review: "",
        },
        {
          // The Karate Kid Part II
          imdbUrl: "https://www.imdb.com/title/tt0091326/",
          rating: 7.9,
          review: "",
        },
        // More movies...
      ];

      // Sample top TV shows data
      const topTVShows: TVShow[] = [
        {
          // Breaking Bad
          imdbUrl: "https://www.imdb.com/title/tt0903747/",
          rating: 10.5,
          review: "The greatest TV show ever made...",
          isTopShow: true,
        },
        {
          // The Office (US)
          imdbUrl: "https://www.imdb.com/title/tt0386676/",
          rating: 10.2,
          review: "The perfect comedy show...",
          isTopShow: true,
        },
        // More top TV shows...
      ];

      // Sample TV shows data
      const tvShows: TVShow[] = [
        {
          // Friends
          imdbUrl: "https://www.imdb.com/title/tt0108778/",
          rating: 9.0,
          review: "",
        },
        {
          // Game of Thrones
          imdbUrl: "https://www.imdb.com/title/tt0944947/",
          rating: 9.2,
          review: "",
        },
        // More TV shows...
      ];

      // Create tasks to fetch movie details
      const movieDetailsTasks = movies.map((movie) => async () => {
        try {
          const details = await getMovieDetailsFromImdbUrl(movie.imdbUrl);
          if (details) {
            return {
              ...movie,
              title: details.title,
              director: details.director,
              year: details.releaseYear,
              overview: details.overview,
              genres: details.genres,
              posterUrl: details.posterPath || undefined,
            };
          }
          return movie;
        } catch (error) {
          console.error(
            `Error fetching details for movie ${movie.imdbUrl}:`,
            error
          );
          return movie;
        }
      });

      // Create tasks to fetch top movie details
      const topMovieDetailsTasks = topMovies.map((movie) => async () => {
        try {
          const details = await getMovieDetailsFromImdbUrl(movie.imdbUrl);
          if (details) {
            return {
              ...movie,
              title: details.title,
              director: details.director,
              year: details.releaseYear,
              overview: details.overview,
              genres: details.genres,
              posterUrl: details.posterPath || undefined,
            };
          }
          return movie;
        } catch (error) {
          console.error(
            `Error fetching details for top movie ${movie.imdbUrl}:`,
            error
          );
          return movie;
        }
      });

      // Create tasks to fetch TV show details
      const tvShowDetailsTasks = tvShows.map((show) => async () => {
        try {
          const details = await getTVDetailsFromImdbUrl(show.imdbUrl);
          if (details) {
            return {
              ...show,
              title: details.title,
              creator: details.creator,
              firstAirYear: details.firstAirYear,
              overview: details.overview,
              genres: details.genres,
              posterUrl: details.posterPath || undefined,
              numberOfSeasons: details.numberOfSeasons,
              numberOfEpisodes: details.numberOfEpisodes,
            };
          }
          return show;
        } catch (error) {
          console.error(
            `Error fetching details for TV show ${show.imdbUrl}:`,
            error
          );
          return show;
        }
      });

      // Create tasks to fetch top TV show details
      const topTVShowDetailsTasks = topTVShows.map((show) => async () => {
        try {
          const details = await getTVDetailsFromImdbUrl(show.imdbUrl);
          if (details) {
            return {
              ...show,
              title: details.title,
              creator: details.creator,
              firstAirYear: details.firstAirYear,
              overview: details.overview,
              genres: details.genres,
              posterUrl: details.posterPath || undefined,
              numberOfSeasons: details.numberOfSeasons,
              numberOfEpisodes: details.numberOfEpisodes,
            };
          }
          return show;
        } catch (error) {
          console.error(
            `Error fetching details for top TV show ${show.imdbUrl}:`,
            error
          );
          return show;
        }
      });

      // Process movie and TV show details with concurrency limits
      const [
        enhancedMovies,
        enhancedTopMovies,
        enhancedTVShows,
        enhancedTopTVShows,
      ] = await Promise.all([
        queue(movieDetailsTasks, 2, 300),
        queue(topMovieDetailsTasks, 2, 300),
        queue(tvShowDetailsTasks, 2, 300),
        queue(topTVShowDetailsTasks, 2, 300),
      ]);

      // Create the media data object
      const mediaData = {
        loaded: true,
        loading: false,
        error: null,
        moviesList: enhancedMovies,
        topMovies: enhancedTopMovies,
        tvList: enhancedTVShows,
        topTVShows: enhancedTopTVShows,
      };

      // Update state
      setData((prev) => ({
        ...prev,
        media: mediaData,
      }));

      // Save checkpoint
      saveCheckpoint("media", mediaData);
    } catch (error) {
      console.error("Error preloading media data:", error);
      setData((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    }
  }, [data.media.loaded, data.media.loading, saveCheckpoint]);

  // Function to preload all data
  const preloadAll = useCallback(() => {
    // Schedule preloading in sequence to avoid overloading API limits
    // Changed order to media -> music -> books
    const loadSequentially = async () => {
      try {
        // First load media data
        if (!data.media.loaded && !data.media.loading) {
          await preloadMedia();
        }

        // Then load music data
        if (!data.music.loaded && !data.music.loading) {
          await preloadMusic();
        }

        // Finally load books data
        if (!data.books.loaded && !data.books.loading) {
          await preloadBooks();
        }
      } catch (error) {
        console.error("Error during sequential preloading:", error);
      }
    };

    loadSequentially();
  }, [
    preloadMusic,
    preloadBooks,
    preloadMedia,
    data.music.loaded,
    data.media.loaded,
    data.books.loaded,
    data.music.loading,
    data.media.loading,
    data.books.loading,
  ]);

  // Reset functions
  const resetMusic = useCallback(() => {
    setData((prev) => ({
      ...prev,
      music: initialState.music,
    }));

    // Clear music checkpoint
    if (typeof window !== "undefined") {
      localStorage.removeItem(CHECKPOINT_KEYS.MUSIC);
    }
  }, []);

  const resetBooks = useCallback(() => {
    setData((prev) => ({
      ...prev,
      books: initialState.books,
    }));

    // Clear books checkpoint
    if (typeof window !== "undefined") {
      localStorage.removeItem(CHECKPOINT_KEYS.BOOKS);
    }
  }, []);

  const resetMedia = useCallback(() => {
    setData((prev) => ({
      ...prev,
      media: initialState.media,
    }));

    // Clear media checkpoint
    if (typeof window !== "undefined") {
      localStorage.removeItem(CHECKPOINT_KEYS.MEDIA);
    }
  }, []);

  // Effect to preload data when the app starts
  useEffect(() => {
    // Clear existing checkpoints to force a refresh with the updated data
    if (typeof window !== "undefined") {
      localStorage.removeItem(CHECKPOINT_KEYS.MUSIC);
      console.log("Cleared music checkpoint to refresh data");
    }

    // Start preloading after the current page has loaded
    // Use a timeout to ensure we don't interfere with initial page render
    const timer = setTimeout(() => {
      preloadAll();
    }, 2000);

    return () => clearTimeout(timer);
  }, [preloadAll]);

  return (
    <DataPreloadContext.Provider
      value={{
        data,
        preloadMusic,
        preloadBooks,
        preloadMedia,
        preloadAll,
        resetMusic,
        resetBooks,
        resetMedia,
      }}
    >
      {children}
    </DataPreloadContext.Provider>
  );
};

// Hook to use the context
export const useDataPreload = () => {
  const context = useContext(DataPreloadContext);
  if (!context) {
    throw new Error("useDataPreload must be used within a DataPreloadProvider");
  }
  return context;
};
