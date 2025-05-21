const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_ENDPOINT = "/api/spotify?type=token";

// These would normally be environment variables
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN || "";

// User data endpoints with proper formatting
const USER_TOP_TRACKS_ENDPOINT =
  "/me/top/tracks?limit=50&time_range=medium_term";
const USER_TOP_ARTISTS_ENDPOINT =
  "/me/top/artists?limit=50&time_range=medium_term";
const USER_PLAYLISTS_ENDPOINT = "/me/playlists?limit=50";
const USER_SAVED_ALBUMS_ENDPOINT = "/me/albums?limit=50";

// Types for Spotify API responses
export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; height: number; width: number }[];
  popularity: number;
  followers: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    images: { url: string; height: number; width: number }[];
    release_date: string;
  };
  artists: {
    id: string;
    name: string;
    external_urls: { spotify: string };
  }[];
  duration_ms: number;
  popularity: number;
  external_urls: { spotify: string };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string; height: number; width: number }[];
  external_urls: { spotify: string };
  owner: {
    display_name: string;
  };
  public: boolean;
  tracks: {
    total: number;
    items: {
      track: SpotifyTrack;
    }[];
    next?: string | null;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: {
    id: string;
    name: string;
    external_urls: { spotify: string };
  }[];
  images: { url: string; height: number; width: number }[];
  release_date: string;
  total_tracks: number;
  external_urls: { spotify: string };
  genres: string[];
}

// Interface for music collection entry - similar to your Movie interface
export interface MusicItem {
  spotifyUrl: string;
  type: "track" | "album" | "artist" | "playlist";
  rating: number; // 0-10 with one decimal
  review?: string;
  isFavorite?: boolean;
  rank?: number; // Ranking position for favorite artists
  // These fields will be populated by the Spotify API
  name?: string;
  artists?: string[];
  coverUrl?: string;
  releaseDate?: string;
  releaseYear?: number;
  genres?: string[];
  popularity?: number;
}

// Add a simple in-memory cache for API responses
const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache expiration
const LOCALSTORAGE_PREFIX = "spotify_cache_";
const LOCALSTORAGE_TTL = 24 * 60 * 60 * 1000; // 24 hour localStorage cache

// Load cached data from localStorage on startup
function loadCachedDataFromStorage() {
  try {
    if (typeof window !== "undefined") {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(LOCALSTORAGE_PREFIX))
        .forEach((key) => {
          try {
            const cached = JSON.parse(localStorage.getItem(key) || "");
            if (cached && cached.timestamp && cached.data) {
              // Check if the cached data is still valid
              if (Date.now() - cached.timestamp < LOCALSTORAGE_TTL) {
                const endpoint = key.replace(LOCALSTORAGE_PREFIX, "");
                apiCache[endpoint] = cached;
                console.log(
                  `Loaded cached data for ${endpoint} from localStorage`
                );
              } else {
                // Remove expired cache
                localStorage.removeItem(key);
              }
            }
          } catch (e) {
            console.warn("Error parsing cached data:", e);
            localStorage.removeItem(key);
          }
        });
    }
  } catch (e) {
    console.warn("Error loading cached data from localStorage:", e);
  }
}

// Initialize cache from localStorage
if (typeof window !== "undefined") {
  loadCachedDataFromStorage();
}

// Save cache to localStorage
function saveCacheToStorage(endpoint: string, data: any) {
  try {
    if (typeof window !== "undefined") {
      // Don't store excessive data in localStorage - skip large playlist responses
      if (
        endpoint.includes("/playlists/") &&
        data &&
        data.tracks &&
        data.tracks.items &&
        data.tracks.items.length > 20
      ) {
        // For playlists, store a lightweight version with just basic info and first 20 tracks
        const lightPlaylist = {
          ...data,
          tracks: {
            ...data.tracks,
            items: data.tracks.items.slice(0, 20),
          },
        };

        localStorage.setItem(
          `${LOCALSTORAGE_PREFIX}${endpoint}`,
          JSON.stringify({ data: lightPlaylist, timestamp: Date.now() })
        );
      } else {
        localStorage.setItem(
          `${LOCALSTORAGE_PREFIX}${endpoint}`,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      }
    }
  } catch (e) {
    console.warn("Error saving cache to localStorage:", e);
    // If we hit storage limits, clear all our caches
    clearAllSpotifyCache();
  }
}

// Clear all Spotify cache from localStorage
function clearAllSpotifyCache() {
  try {
    if (typeof window !== "undefined") {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(LOCALSTORAGE_PREFIX))
        .forEach((key) => localStorage.removeItem(key));
    }
  } catch (e) {
    console.warn("Error clearing Spotify cache:", e);
  }
}

// API request queue to prevent too many simultaneous requests
const requestQueue: Array<{
  endpoint: string;
  accessToken: string;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];
let isProcessingQueue = false;

// Process one request from the queue
async function processNextRequest() {
  if (requestQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }

  isProcessingQueue = true;
  const { endpoint, accessToken, resolve, reject } = requestQueue.shift()!;

  try {
    // Check if the endpoint is a full URL or a relative path
    const isFullUrl = endpoint.startsWith("http");
    let response;

    if (isFullUrl) {
      // For full URLs, use fetch directly
      response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } else {
      // For relative paths, use our server-side proxy
      response = await fetch(
        `/api/spotify?type=api&endpoint=${encodeURIComponent(
          endpoint
        )}&token=${accessToken}`
      );
    }

    // Handle rate limiting
    if (response.status === 429) {
      // Get retry-after header or use default delay
      const retryAfter = parseInt(
        response.headers.get("Retry-After") || "2",
        10
      );
      console.warn(
        `Rate limit exceeded. Waiting ${retryAfter}s before continuing...`
      );

      // Wait for the specified delay and push the request back to the front of the queue
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      requestQueue.unshift({ endpoint, accessToken, resolve, reject });

      // Wait a bit before processing the next request
      setTimeout(processNextRequest, 1000);
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: { message: errorText || "Unknown error" } };
      }

      console.error(`Spotify API request failed for ${endpoint}:`, errorData);

      if (response.status === 401) {
        // Token expired, clear from cache
        console.warn("Access token expired. Getting a new token...");
        const newToken = await getAccessToken(true);
        if (newToken) {
          // Re-add request to queue with new token
          requestQueue.unshift({
            endpoint,
            accessToken: newToken,
            resolve,
            reject,
          });
          setTimeout(processNextRequest, 1000);
          return;
        }
      }

      reject(
        new Error(
          `Spotify API request failed: ${
            errorData.error?.message || errorData.error || "Unknown error"
          }`
        )
      );
    } else {
      const data = await response.json();
      // Store in cache
      apiCache[endpoint] = {
        data,
        timestamp: Date.now(),
      };
      resolve(data);
    }
  } catch (error) {
    console.error(`Error making Spotify API request to ${endpoint}:`, error);
    reject(error);
  }

  // Wait before processing the next request to avoid rate limits
  setTimeout(processNextRequest, 1000);
}

/**
 * Get Spotify access token using client credentials
 */
async function getAccessToken(forceRefresh = false): Promise<string> {
  // Use cached token unless force refresh is requested
  if (!forceRefresh && apiCache["access_token"]?.data?.access_token) {
    const cache = apiCache["access_token"];
    const expiryTime =
      cache.timestamp + (cache.data.expires_in * 1000 || CACHE_TTL);
    if (Date.now() < expiryTime) {
      return cache.data.access_token;
    }
  }

  try {
    console.log("Making token request to Spotify via proxy...");
    // Use our server-side proxy instead of direct API calls
    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Spotify token request failed:", errorData);
      throw new Error(
        `Spotify token request failed: ${
          errorData.error_description || errorData.error
        }`
      );
    }

    const data = await response.json();
    // Cache the token
    apiCache["access_token"] = {
      data,
      timestamp: Date.now(),
    };
    console.log("Token request successful:", !!data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    throw error;
  }
}

/**
 * Make an authenticated request to the Spotify API
 */
async function spotifyApiRequest(
  endpoint: string,
  accessToken?: string,
  skipCache = false
): Promise<any> {
  try {
    // Check cache first if not skipping cache
    if (!skipCache && apiCache[endpoint]) {
      const cache = apiCache[endpoint];
      // Use cached response if it's not expired
      if (Date.now() - cache.timestamp < CACHE_TTL) {
        console.log(`Using cached response for ${endpoint}`);
        return cache.data;
      }
    }

    // Get access token if not provided
    const token = accessToken || (await getAccessToken());

    if (!token) {
      throw new Error("No access token available");
    }

    // Use our server-side proxy instead of direct API calls to avoid CORS
    // For endpoints that are full URLs, use them directly
    const isFullUrl = endpoint.startsWith("http");

    // Add request to queue and wait for result
    const result = await new Promise((resolve, reject) => {
      requestQueue.push({
        endpoint,
        accessToken: token,
        resolve,
        reject,
      });

      // Start processing queue if not already running
      if (!isProcessingQueue) {
        processNextRequest();
      }
    });

    // Save successful responses to both in-memory cache and localStorage
    apiCache[endpoint] = {
      data: result,
      timestamp: Date.now(),
    };

    // Save to localStorage for persistence
    saveCacheToStorage(endpoint, result);

    return result;
  } catch (error) {
    console.error(`Error making Spotify API request to ${endpoint}:`, error);

    // If rate limited, try to return cached data even if expired as fallback
    if (
      error instanceof Error &&
      error.message.includes("rate limit") &&
      apiCache[endpoint]
    ) {
      console.log(
        `Using expired cached data for ${endpoint} due to rate limiting`
      );
      return apiCache[endpoint].data;
    }

    throw error;
  }
}

// Function to extract Spotify ID and type from URL
export function extractSpotifyIdAndType(
  url: string
): { id: string; type: string } | null {
  try {
    const regex = /spotify\.com\/(track|album|artist|playlist)\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);

    if (match && match.length >= 3) {
      return {
        type: match[1],
        id: match[2],
      };
    }
    return null;
  } catch (error) {
    console.error("Error extracting Spotify ID and type:", error);
    return null;
  }
}

/**
 * Get details for a track, album, artist or playlist from Spotify API
 */
export async function getMusicDetailsFromSpotifyUrl(
  spotifyUrl: string
): Promise<MusicItem | null> {
  try {
    const extracted = extractSpotifyIdAndType(spotifyUrl);
    if (!extracted) {
      throw new Error("Invalid Spotify URL");
    }

    const { id, type } = extracted;

    // If we have valid Spotify credentials, try to use the real API
    const accessToken = await getAccessToken();

    if (accessToken) {
      try {
        // Make the appropriate API call based on item type
        let endpoint = "";
        let data;

        switch (type) {
          case "track":
            endpoint = `/tracks/${id}`;
            data = await spotifyApiRequest(endpoint, accessToken);

            // If data is null (404 occurred), fall back to sample data
            if (!data) break;

            return {
              spotifyUrl,
              type: "track",
              rating: 0,
              name: data.name,
              artists: data.artists.map((a: any) => a.name),
              coverUrl: data.album.images[0]?.url,
              releaseDate: data.album.release_date,
              releaseYear: new Date(data.album.release_date).getFullYear(),
              popularity: data.popularity,
            };

          case "album":
            endpoint = `/albums/${id}`;
            data = await spotifyApiRequest(endpoint, accessToken);

            // If data is null (404 occurred), fall back to sample data
            if (!data) break;

            return {
              spotifyUrl,
              type: "album",
              rating: 0,
              name: data.name,
              artists: data.artists.map((a: any) => a.name),
              coverUrl: data.images[0]?.url,
              releaseDate: data.release_date,
              releaseYear: new Date(data.release_date).getFullYear(),
              genres: data.genres,
              popularity: data.popularity,
            };

          case "artist":
            endpoint = `/artists/${id}`;
            data = await spotifyApiRequest(endpoint, accessToken);

            // If data is null (404 occurred), fall back to sample data
            if (!data) break;

            return {
              spotifyUrl,
              type: "artist",
              rating: 0,
              name: data.name,
              coverUrl: data.images[0]?.url,
              genres: data.genres,
              popularity: data.popularity,
            };

          case "playlist":
            endpoint = `/playlists/${id}`;
            data = await spotifyApiRequest(endpoint, accessToken);

            // If data is null (404 occurred), fall back to sample data
            if (!data) break;

            return {
              spotifyUrl,
              type: "playlist",
              rating: 0,
              name: data.name,
              coverUrl: data.images[0]?.url,
              popularity: 0,
            };
        }
      } catch (error) {
        console.warn(
          `Error fetching from Spotify API: ${error}. Falling back to sample data.`
        );
        // Fall back to sample data if the API call fails
      }
    }

    // If we don't have credentials or the API call failed, use sample data
    if (type === "track") {
      // Try to find the track in sample data
      const track =
        sampleTopTracks.find((t) => t.id === id) ||
        sampleTopTracks.find((t) => t.external_urls.spotify.includes(id));

      if (track) {
        return {
          spotifyUrl: track.external_urls.spotify,
          type: "track",
          rating: 0,
          name: track.name,
          artists: track.artists.map((a) => a.name),
          coverUrl: track.album.images[0].url,
          releaseDate: track.album.release_date,
          releaseYear: new Date(track.album.release_date).getFullYear(),
          popularity: track.popularity,
        };
      }
    } else if (type === "album") {
      // Try to find the album in sample data
      const album =
        sampleAlbums.find((a) => a.id === id) ||
        sampleAlbums.find((a) => a.external_urls.spotify.includes(id));

      if (album) {
        return {
          spotifyUrl: album.external_urls.spotify,
          type: "album",
          rating: 0,
          name: album.name,
          artists: album.artists.map((a) => a.name),
          coverUrl: album.images[0].url,
          releaseDate: album.release_date,
          releaseYear: new Date(album.release_date).getFullYear(),
          genres: album.genres,
          popularity: 0, // Albums don't have popularity in our sample data
        };
      }
    } else if (type === "artist") {
      // Try to find the artist in sample data
      const artist =
        sampleTopArtists.find((a) => a.id === id) ||
        sampleTopArtists.find((a) => a.external_urls.spotify.includes(id));

      if (artist) {
        return {
          spotifyUrl: artist.external_urls.spotify,
          type: "artist",
          rating: 0,
          name: artist.name,
          coverUrl: artist.images[0].url,
          genres: artist.genres,
          popularity: artist.popularity,
        };
      }
    } else if (type === "playlist") {
      // Try to find the playlist in sample data
      const playlist =
        samplePlaylists.find((p) => p.id === id) ||
        samplePlaylists.find((p) => p.external_urls.spotify.includes(id));

      if (playlist) {
        return {
          spotifyUrl: playlist.external_urls.spotify,
          type: "playlist",
          rating: 0,
          name: playlist.name,
          coverUrl: playlist.images[0].url,
          popularity: 0, // Playlists don't have popularity in our sample data
        };
      } else {
        // Create a placeholder for playlists not found in sample data
        return {
          spotifyUrl,
          type: "playlist",
          rating: 0,
          name: `Playlist (ID: ${id.substring(0, 6)}...)`,
          coverUrl: "/placeholder.svg",
          popularity: 0,
        };
      }
    }

    console.log(`Item not found in sample data: ${type} ${id}`);
    // Return a placeholder item as a fallback
    return {
      spotifyUrl,
      type: type as "track" | "album" | "artist" | "playlist",
      rating: 0,
      name: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } (ID: ${id.substring(0, 6)}...)`,
      coverUrl: "/placeholder.svg",
      popularity: 0,
    };
  } catch (error) {
    console.error("Error fetching details from Spotify URL:", error);
    return null;
  }
}

// Sample data for top artists
export const sampleTopArtists: SpotifyArtist[] = [
  {
    id: "6MDME20pz9RveH9rEXvrOM",
    name: "The Weeknd",
    genres: ["canadian contemporary r&b", "canadian pop", "pop"],
    images: [
      {
        url: "https://i.scdn.co/image/ab6761610000e5ebb5f9e28219c169fd4b9e8379",
        height: 640,
        width: 640,
      },
    ],
    popularity: 96,
    followers: { total: 52409231 },
    external_urls: {
      spotify: "https://open.spotify.com/artist/6MDME20pz9RveH9rEXvrOM",
    },
  },
  {
    id: "3qiHUAX7zY4Qnjx8TNUzVx",
    name: "ROSÉ",
    genres: ["k-pop", "k-pop girl group"],
    images: [
      {
        url: "https://i.scdn.co/image/ab6761610000e5eb1a9c4daba4fe91de977f0cfb",
        height: 640,
        width: 640,
      },
    ],
    popularity: 76,
    followers: { total: 7902143 },
    external_urls: {
      spotify: "https://open.spotify.com/artist/3qiHUAX7zY4Qnjx8TNUzVx",
    },
  },
  {
    id: "1RyvyyTE3xzB2ZywiAwp0i",
    name: "Future",
    genres: ["atl hip hop", "hip hop", "rap", "trap"],
    images: [
      {
        url: "https://i.scdn.co/image/ab6761610000e5ebe244c4e1f06fb071895b0390",
        height: 640,
        width: 640,
      },
    ],
    popularity: 95,
    followers: { total: 11825277 },
    external_urls: {
      spotify: "https://open.spotify.com/artist/1RyvyyTE3xzB2ZywiAwp0i",
    },
  },
  {
    id: "0TnOYISbd1XYRBk9myaseg",
    name: "Pitbull",
    genres: ["dance pop", "miami hip hop", "pop", "pop rap"],
    images: [
      {
        url: "https://i.scdn.co/image/ab6761610000e5eb0e08ea2c4d6789fbf5cbe0aa",
        height: 640,
        width: 640,
      },
    ],
    popularity: 84,
    followers: { total: 7913246 },
    external_urls: {
      spotify: "https://open.spotify.com/artist/0TnOYISbd1XYRBk9myaseg",
    },
  },
];

// Sample data for top tracks
export const sampleTopTracks: SpotifyTrack[] = [
  {
    id: "2JzZzZUQj3Qff7wapcbKjc",
    name: "Starboy",
    album: {
      id: "2FW0tY7iwNUnKj2xXKRFyQ",
      name: "Starboy",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452",
          height: 640,
          width: 640,
        },
      ],
      release_date: "2016-11-25",
    },
    artists: [
      {
        id: "6MDME20pz9RveH9rEXvrOM",
        name: "The Weeknd",
        external_urls: {
          spotify: "https://open.spotify.com/artist/6MDME20pz9RveH9rEXvrOM",
        },
      },
      {
        id: "4tZwfgrHOc3mvqYlEYSvVi",
        name: "Daft Punk",
        external_urls: {
          spotify: "https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi",
        },
      },
    ],
    duration_ms: 230453,
    popularity: 88,
    external_urls: {
      spotify: "https://open.spotify.com/track/2JzZzZUQj3Qff7wapcbKjc",
    },
  },
  {
    id: "7dt6x5M1jzdTEt8oCbisTK",
    name: "Better Now",
    album: {
      id: "6trNtQUgC8cgbWcqoMYkOR",
      name: "beerbongs & bentleys",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273b1c4b76e23414c9f20242268",
          height: 640,
          width: 640,
        },
      ],
      release_date: "2018-04-27",
    },
    artists: [
      {
        id: "4tjHBiOMJeOcP0otCEk2Y6",
        name: "Post Malone",
        external_urls: {
          spotify: "https://open.spotify.com/artist/4tjHBiOMJeOcP0otCEk2Y6",
        },
      },
    ],
    duration_ms: 231267,
    popularity: 78,
    external_urls: {
      spotify: "https://open.spotify.com/track/7dt6x5M1jzdTEt8oCbisTK",
    },
  },
  {
    id: "7KXjTSCq5nL1LoYtL7XAwS",
    name: "HUMBLE.",
    album: {
      id: "4eLPsYPBmXABThSJ821sqY",
      name: "DAMN.",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699",
          height: 640,
          width: 640,
        },
      ],
      release_date: "2017-04-14",
    },
    artists: [
      {
        id: "2YZyLoL8N0Wb9xBt1NhZWg",
        name: "Kendrick Lamar",
        external_urls: {
          spotify: "https://open.spotify.com/artist/2YZyLoL8N0Wb9xBt1NhZWg",
        },
      },
    ],
    duration_ms: 177000,
    popularity: 85,
    external_urls: {
      spotify: "https://open.spotify.com/track/7KXjTSCq5nL1LoYtL7XAwS",
    },
  },
  {
    id: "5yuShbu70mtHXY0yLzCQLQ",
    name: "Calm Down",
    album: {
      id: "4EPQtdq6vvwxuYeQTrwDVY",
      name: "Rave & Roses Ultra",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b27360be9dce052357daed802dc9",
          height: 640,
          width: 640,
        },
      ],
      release_date: "2023-05-26",
    },
    artists: [
      {
        id: "46pWGuE3dSwY3bMMXGBvVS",
        name: "Rema",
        external_urls: {
          spotify: "https://open.spotify.com/artist/46pWGuE3dSwY3bMMXGBvVS",
        },
      },
      {
        id: "6M2wZ9GZgrQXHCFfjv46we",
        name: "Selena Gomez",
        external_urls: {
          spotify: "https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we",
        },
      },
    ],
    duration_ms: 220078,
    popularity: 83,
    external_urls: {
      spotify: "https://open.spotify.com/track/5yuShbu70mtHXY0yLzCQLQ",
    },
  },
  {
    id: "7zZrZuesfgV5Ivea8BiHFO",
    name: "On My Mama",
    album: {
      id: "6Gg3CjahgqAHIxMK6wMbKC",
      name: "On My Mama",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273b3c59a65b5bd76ed01f71dad",
          height: 640,
          width: 640,
        },
      ],
      release_date: "2023-07-28",
    },
    artists: [
      {
        id: "7tYKF4w9nC0nq9CsPZTHyP",
        name: "Victoria Monét",
        external_urls: {
          spotify: "https://open.spotify.com/artist/7tYKF4w9nC0nq9CsPZTHyP",
        },
      },
    ],
    duration_ms: 212066,
    popularity: 81,
    external_urls: {
      spotify: "https://open.spotify.com/track/7zZrZuesfgV5Ivea8BiHFO",
    },
  },
];

// Sample data for playlists
const samplePlaylists: SpotifyPlaylist[] = [
  {
    id: "sample-playlist-1",
    name: "Sample Playlist 1",
    description: "A sample playlist",
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69",
        height: 640,
        width: 640,
      },
    ],
    owner: {
      display_name: "Sample User",
    },
    public: true,
    tracks: {
      total: 10,
      items: [],
    },
    external_urls: {
      spotify: "https://open.spotify.com/playlist/sample-playlist-1",
    },
  },
  {
    id: "sample-playlist-2",
    name: "Sample Playlist 2",
    description: "Another sample playlist",
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69",
        height: 640,
        width: 640,
      },
    ],
    owner: {
      display_name: "Sample User",
    },
    public: true,
    tracks: {
      total: 15,
      items: [],
    },
    external_urls: {
      spotify: "https://open.spotify.com/playlist/sample-playlist-2",
    },
  },
];

// Sample data for albums
export const sampleAlbums: SpotifyAlbum[] = [
  {
    id: "4yP0hdKOZPNshxUOjY0cZj",
    name: "After Hours",
    artists: [
      {
        id: "6MDME20pz9RveH9rEXvrOM",
        name: "The Weeknd",
        external_urls: {
          spotify: "https://open.spotify.com/artist/6MDME20pz9RveH9rEXvrOM",
        },
      },
    ],
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
        height: 640,
        width: 640,
      },
    ],
    release_date: "2020-03-20",
    total_tracks: 14,
    external_urls: {
      spotify: "https://open.spotify.com/album/4yP0hdKOZPNshxUOjY0cZj",
    },
    genres: ["canadian contemporary r&b", "pop"],
  },
  {
    id: "5MS3MvWHJ3lOZPLiMxzOU6",
    name: "-R- (Deluxe)",
    artists: [
      {
        id: "3qiHUAX7zY4Qnjx8TNUzVx",
        name: "ROSÉ",
        external_urls: {
          spotify: "https://open.spotify.com/artist/3qiHUAX7zY4Qnjx8TNUzVx",
        },
      },
    ],
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d0000b27326550a1e222dd75523302b9f",
        height: 640,
        width: 640,
      },
    ],
    release_date: "2021-03-12",
    total_tracks: 4,
    external_urls: {
      spotify: "https://open.spotify.com/album/5MS3MvWHJ3lOZPLiMxzOU6",
    },
    genres: ["k-pop", "k-pop girl group"],
  },
  {
    id: "2jOJ28t0hDgYRLnVPC3JLN",
    name: "Dreamland (+ Bonus Levels)",
    artists: [
      {
        id: "4yvcSjfu4PC0CYQyLy4wSq",
        name: "Glass Animals",
        external_urls: {
          spotify: "https://open.spotify.com/artist/4yvcSjfu4PC0CYQyLy4wSq",
        },
      },
    ],
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d0000b2732cbfdcb5bfe4de48bc19da2b",
        height: 640,
        width: 640,
      },
    ],
    release_date: "2020-08-06",
    total_tracks: 19,
    external_urls: {
      spotify: "https://open.spotify.com/album/2jOJ28t0hDgYRLnVPC3JLN",
    },
    genres: ["indietronica", "modern rock"],
  },
];

export async function getPlaylistByName(
  name: string
): Promise<SpotifyPlaylist | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.warn("No access token available");
      return null;
    }

    const response = await spotifyApiRequest(
      `${SPOTIFY_API_BASE_URL}/me/playlists?limit=50`,
      accessToken
    );

    if (!response) return null;

    const playlist = response.items.find(
      (p: SpotifyPlaylist) => p.name.toLowerCase() === name.toLowerCase()
    );

    if (!playlist) return null;

    // Fetch full playlist details
    const playlistDetails = await spotifyApiRequest(
      `${SPOTIFY_API_BASE_URL}/playlists/${playlist.id}`,
      accessToken
    );

    return playlistDetails;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return null;
  }
}

export async function getUserTopTracks(): Promise<SpotifyTrack[]> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.warn("No access token available");
      return [];
    }

    // First try to get the BEST (4)EVER playlist
    const bestPlaylist = await getPlaylistByName("BEST (4)EVER");
    if (bestPlaylist) {
      const tracks = bestPlaylist.tracks.items.map((item: any) => item.track);
      return tracks;
    }

    // Fallback to top tracks if playlist not found
    const response = await spotifyApiRequest(
      `${SPOTIFY_API_BASE_URL}/me/top/tracks?time_range=short_term&limit=50`,
      accessToken
    );

    if (!response) return [];

    return response.items;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return [];
  }
}

// Function to get user's top artists (real data from Spotify API)
export async function getUserTopArtists(): Promise<SpotifyArtist[]> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.warn("No access token available. Using sample data.");
      return sampleTopArtists;
    }

    const data = await spotifyApiRequest(
      USER_TOP_ARTISTS_ENDPOINT,
      accessToken
    );
    if (!data || !data.items) {
      console.warn("Failed to get user top artists. Using sample data.");
      return sampleTopArtists;
    }

    return data.items;
  } catch (error) {
    console.error("Error fetching user top artists:", error);
    return sampleTopArtists;
  }
}

// Function to get user's playlists (real data from Spotify API)
export async function getUserPlaylists(): Promise<SpotifyPlaylist[]> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.warn("No access token available. Using sample data.");
      return samplePlaylists;
    }

    const data = await spotifyApiRequest(USER_PLAYLISTS_ENDPOINT, accessToken);
    if (!data || !data.items) {
      console.warn("Failed to get user playlists. Using sample data.");
      return samplePlaylists;
    }

    return data.items;
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    return samplePlaylists;
  }
}

// Function to get user's saved albums (real data from Spotify API)
export async function getUserSavedAlbums(): Promise<SpotifyAlbum[]> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.warn("No access token available. Using sample data.");
      return sampleAlbums;
    }

    const data = await spotifyApiRequest(
      USER_SAVED_ALBUMS_ENDPOINT,
      accessToken
    );
    if (!data || !data.items) {
      console.warn("Failed to get user saved albums. Using sample data.");
      return sampleAlbums;
    }

    // The API returns items with an "album" property
    return data.items.map((item: any) => item.album);
  } catch (error) {
    console.error("Error fetching user saved albums:", error);
    return sampleAlbums;
  }
}

// Helper function to format track duration from milliseconds to MM:SS
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Function to get playlist by ID directly with pagination support
export async function getPlaylistById(
  id: string,
  fetchAllTracks = false
): Promise<SpotifyPlaylist | null> {
  try {
    if (!id) return null;

    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.warn("No access token available");
      return null;
    }

    try {
      // Check if we have this playlist in cache
      const cacheKey = `/playlists/${id}`;
      if (apiCache[cacheKey]) {
        console.log(`Using cached playlist data for ${id}`);

        // If we have cached data but need all tracks and they're not all loaded
        const cachedPlaylist = apiCache[cacheKey].data;
        const hasAllTracks =
          cachedPlaylist?.tracks?.total ===
          cachedPlaylist?.tracks?.items?.length;

        if (fetchAllTracks && !hasAllTracks && cachedPlaylist) {
          console.log(
            `Cached playlist doesn't have all tracks, loading the rest...`
          );
          // We already have basic playlist info, just need to load the rest of the tracks
          return await loadRemainingPlaylistTracks(cachedPlaylist, accessToken);
        }

        return cachedPlaylist;
      }

      // Get initial playlist data
      const endpoint = `/playlists/${id}`;
      let playlist = await spotifyApiRequest(endpoint, accessToken);

      // Only fetch all tracks if specifically requested
      if (
        fetchAllTracks &&
        playlist.tracks.total > playlist.tracks.items.length
      ) {
        return await loadRemainingPlaylistTracks(playlist, accessToken);
      }

      return playlist;
    } catch (error) {
      // If we get rate limited, return a minimal playlist object
      if (error instanceof Error && error.message.includes("rate limit")) {
        console.warn(
          `Rate limited when fetching playlist ${id}, returning minimal object`
        );
        return {
          id,
          name: `Playlist (${id.substring(0, 6)}...)`,
          description: "Loading details...",
          images: [{ url: "/placeholder.svg", height: 300, width: 300 }],
          external_urls: { spotify: `https://open.spotify.com/playlist/${id}` },
          owner: { display_name: "Loading..." },
          public: true,
          tracks: { total: 0, items: [] },
        };
      }

      console.error(`Error fetching playlist ${id}:`, error);
      return null;
    }
  } catch (error) {
    console.error("Error in getPlaylistById:", error);
    return null;
  }
}

// Helper function to load remaining tracks for a playlist
async function loadRemainingPlaylistTracks(
  playlist: SpotifyPlaylist,
  accessToken: string
): Promise<SpotifyPlaylist> {
  try {
    console.log(
      `Playlist has ${playlist.tracks.total} tracks but only ${playlist.tracks.items.length} loaded. Fetching all...`
    );

    // Fetch all remaining tracks using pagination
    const allTracks = [...playlist.tracks.items];
    let nextUrl = playlist.tracks.next as string | null;

    while (nextUrl) {
      // Add delay between pagination requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const trackResponse = await spotifyApiRequest(nextUrl, accessToken);
        allTracks.push(...trackResponse.items);
        nextUrl = trackResponse.next;
      } catch (error) {
        // If we hit rate limits during pagination, just return what we have
        if (error instanceof Error && error.message.includes("rate limit")) {
          console.warn(
            "Rate limit hit during playlist pagination, returning partial results"
          );
          break;
        }
        throw error;
      }
    }

    // Replace the tracks in the playlist object
    playlist.tracks.items = allTracks;
    console.log(
      `Successfully loaded ${allTracks.length} tracks for playlist (${playlist.tracks.total} total)`
    );

    return playlist;
  } catch (error) {
    console.error("Error loading remaining playlist tracks:", error);
    // Return the playlist with the tracks we already have
    return playlist;
  }
}

// Function to get playlists in batch with minimal data
export async function fetchPlaylistsInBatch(
  playlistIds: string[]
): Promise<SpotifyPlaylist[]> {
  if (!playlistIds || playlistIds.length === 0) {
    return [];
  }

  try {
    // Extract just the playlist IDs from URLs if needed
    const cleanIds = playlistIds.map((id) => {
      // If it's a URL, extract the ID
      if (id.includes("spotify.com/playlist/")) {
        const match = id.match(/playlist\/([a-zA-Z0-9]+)/);
        return match ? match[1] : id;
      }
      return id;
    });

    // Create cache key for this batch request
    const cacheKey = `batch_playlists_${cleanIds.join("_")}`;

    // Check if we have this data in cache
    if (
      apiCache[cacheKey] &&
      Date.now() - apiCache[cacheKey].timestamp < CACHE_TTL
    ) {
      console.log("Using cached batch playlist data");
      return apiCache[cacheKey].data;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.warn("No access token available");
      return [];
    }

    // Use the new batch endpoint
    const response = await fetch(
      `/api/spotify?type=batch-playlists&ids=${cleanIds.join(
        ","
      )}&token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch playlists: ${response.status}`);
    }

    const data = await response.json();

    // Cache the response
    apiCache[cacheKey] = {
      data: data.playlists,
      timestamp: Date.now(),
    };

    // Save to localStorage too
    saveCacheToStorage(cacheKey, data.playlists);

    return data.playlists;
  } catch (error) {
    console.error("Error fetching playlists in batch:", error);
    return [];
  }
}
