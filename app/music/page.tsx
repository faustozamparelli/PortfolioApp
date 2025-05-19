"use client";

import Image from "next/image";
import {
  Star,
  ExternalLink,
  Music,
  User,
  ListMusic,
  Play,
  BarChart2,
  Clock,
  Disc,
  HeadphonesIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import React from "react";
import { MusicStatsModal } from "@/components/music-stats-modal";
import { ArtistReviewModal } from "@/components/artist-review-modal";
import {
  getMusicDetailsFromSpotifyUrl,
  MusicItem,
  getUserTopTracks,
  getUserTopArtists,
  getUserPlaylists,
  SpotifyTrack,
  SpotifyArtist,
  SpotifyPlaylist,
  getPlaylistById,
} from "@/utils/spotifyApi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// BEST (4)EVER Playlist Songs - Static data from https://open.spotify.com/playlist/3FS5wKeNT7vvadtFYqDLRo
const bestEverSongs = [
  {
    name: "In Da Club",
    artists: [{ name: "50 Cent" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b2739acca45e7b39f2ef7d1c474f",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/7iL6o9tox1zgHpKUfh9vuC",
    },
  },
  {
    name: "Empire State Of Mind",
    artists: [{ name: "JAY-Z" }, { name: "Alicia Keys" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273fec1b815bb3c50a64a90fd10",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/20efeySIfZoiO7ZNjANsJX",
    },
  },
  {
    name: "No One",
    artists: [{ name: "Alicia Keys" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273734309986fc41e88379e0d17",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/1FX5sAXYn96GNXZgaMHsJC",
    },
  },
  {
    name: "Hips Don't Lie",
    artists: [{ name: "Shakira" }, { name: "Wyclef Jean" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273cb4ec52c48a6b071ed2ab6bc",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/3ZFTkvIE7kyPt6Nu3PEa7V",
    },
  },
  {
    name: "This Love",
    artists: [{ name: "Maroon 5" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273963469a897e818f1f4e94be7",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/6ECp64rv50XVz93WvxXMGF",
    },
  },
  {
    name: "I Gotta Feeling",
    artists: [{ name: "Black Eyed Peas" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b27375c38590a496e8f4c876c9c0",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/14AYJFgPfI7mKevBtQKhqT",
    },
  },
  {
    name: "Just Can't Get Enough",
    artists: [{ name: "Black Eyed Peas" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b27375c38590a496e8f4c876c9c0",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/1FDO0PaSWEXgMIhSHFsf9I",
    },
  },
  {
    name: "Meet Me Halfway",
    artists: [{ name: "Black Eyed Peas" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b27375c38590a496e8f4c876c9c0",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/0bV14nkvcQmt8fezDY6GRl",
    },
  },
  {
    name: "Stan",
    artists: [{ name: "Eminem" }, { name: "Dido" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273dbb3dd82da45b7d7f908b3a5",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/3UmaczJpikHgJFyBTAJVoz",
    },
  },
  {
    name: "Halo",
    artists: [{ name: "Beyoncé" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b2732fbd77033247e889cb7d2ac4",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/4JehYebiI9JE8sR8MisGVb",
    },
  },
  {
    name: "Rock with You",
    artists: [{ name: "Michael Jackson" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273de437d960dda1ac0a3586d97",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/1JCCdiru7fhstOIF4N7WJC",
    },
  },
  {
    name: "Put Your Head On My Shoulder",
    artists: [{ name: "Paul Anka" }],
    album: {
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b2736b75d57d2508c5e36d97fa2d",
        },
      ],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/3kiZG32qLKz2l2qD5wmbTO",
    },
  },
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
    spotifyUrl: "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4",
    type: "artist",
    rating: 11,
    review: "test",
    rank: 2,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/4MCBfE4596Uoi2O4DtmEMz",
    type: "artist",
    rating: 11,
    review: "test",
    rank: 3,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/1wxPItEzr7U7rGSMPqZ25r",
    type: "artist",
    rating: 10,
    review: "test",
    rank: 4,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/1QAJqy2dA3ihHBFIHRphZj",
    type: "artist",
    rating: 10,
    review: "test",
    rank: 5,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/6lcwlkAjBPSKnFBZjjZFJs",
    type: "artist",
    rating: 10,
    review: "test",
    rank: 6,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/6EPlBSH2RSiettczlz7ihV",
    type: "artist",
    rating: 9.8,
    review: "test",
    rank: 7,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/15UsOTVnJzReFVN1VCnxy4",
    type: "artist",
    rating: 9.5,
    review: "test",
    rank: 8,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/6FBDaR13swtiWwGhX1WQsP",
    type: "artist",
    rating: 9,
    review: "test",
    rank: 9,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/4O15NlyKLIASxsJ0PrXPfz",
    type: "artist",
    rating: 9,
    review: "test",
    rank: 10,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/5H4yInM5zmHqpKIoMNAx4r",
    type: "artist",
    rating: 8.8,
    review: "test",
    rank: 11,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/4oLeXFyACqeem2VImYeBFe",
    type: "artist",
    rating: 8.5,
    review: "test",
    rank: 12,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/1WaFQSHVGZQJTbf0BdxdNo",
    type: "artist",
    rating: 8.4,
    review: "test",
    rank: 13,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/0z4gvV4rjIZ9wHck67ucSV",
    type: "artist",
    rating: 8,
    review: "test",
    rank: 14,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/0fA0VVWsXO9YnASrzqfmYu",
    type: "artist",
    rating: 8,
    review: "test",
    rank: 15,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/3tlXnStJ1fFhdScmQeLpuG",
    type: "artist",
    rating: 7.8,
    review: "test",
    rank: 16,
  },
  {
    spotifyUrl: "https://open.spotify.com/artist/31TPClRtHm23RisEBtV3X7",
    type: "artist",
    rating: 7,
    review: "test",
    rank: 17,
  },
];

// Manually added playlists - you can add your playlists here
const manualPlaylists = [
  {
    spotifyUrl: "https://open.spotify.com/playlist/3FS5wKeNT7vvadtFYqDLRo",
    name: "BEST (4)EVER",
    description: '"headphones aint enough i need to fuck the song"',
    owner: "Fausto Zamparelli",
    imageUrl:
      "https://mosaic.scdn.co/640/ab67616d0000b273734309986fc41e88379e0d17ab67616d0000b2739acca45e7b39f2ef7d1c474fab67616d0000b273cb4ec52c48a6b071ed2ab6bcab67616d0000b273dbb3dd82da45b7d7f908b3a5",
    trackCount: 374,
  },
  {
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
    name: "RapCaviar",
    description: "New music from hip-hop's biggest names.",
    owner: "Spotify",
    imageUrl:
      "https://i.scdn.co/image/ab67706f000000037d964b29818ef3f1fed62d46",
    trackCount: 50,
  },
  {
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
    name: "Today's Top Hits",
    description: "The hottest tracks right now.",
    owner: "Spotify",
    imageUrl:
      "https://i.scdn.co/image/ab67706f0000000390c8d4e9b56aeda3e6da2e57",
    trackCount: 50,
  },
];

// Helper function to get color based on rating
function getRatingColor(rating: number) {
  if (rating >= 9) return "text-green-500 dark:text-green-400";
  if (rating >= 7) return "text-blue-500 dark:text-blue-400";
  if (rating >= 5) return "text-yellow-500 dark:text-yellow-400";
  if (rating >= 3) return "text-orange-500 dark:text-orange-400";
  return "text-red-500 dark:text-red-400";
}

// The BEST (4)EVER playlist ID
const BEST_EVER_PLAYLIST_ID = "3FS5wKeNT7vvadtFYqDLRo";

export default function MusicPage() {
  const [favoriteSongs, setFavoriteSongs] = useState<SpotifyTrack[]>([]);
  const [favoriteArtistsWithDetails, setFavoriteArtistsWithDetails] = useState<
    MusicItem[]
  >([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<MusicItem | null>(null);
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [genreData, setGenreData] = useState<{ name: string; value: number }[]>(
    [
      { name: "Hip Hop", value: 12 },
      { name: "Pop", value: 8 },
      { name: "R&B", value: 5 },
      { name: "Dance", value: 3 },
      { name: "Rock", value: 3 },
    ]
  );

  // Add pagination state for favorite songs
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 48; // 8 columns * 6 rows

  // Function to handle pagination
  const totalPages = Math.ceil(favoriteSongs.length / songsPerPage);
  const paginatedSongs = favoriteSongs.slice(
    (currentPage - 1) * songsPerPage,
    currentPage * songsPerPage
  );

  // Pagination controls
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const openArtistReviewModal = (artist: MusicItem) => {
    setSelectedArtist(artist);
    setIsArtistModalOpen(true);
  };

  const closeArtistReviewModal = () => {
    setIsArtistModalOpen(false);
  };

  // Handle image loading errors
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "/placeholder.svg";
  };

  useEffect(() => {
    async function fetchMusicData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch details for favorite artists from Spotify
        const updatedFavoriteArtists = await Promise.all(
          favoriteArtists.map(async (artist) => {
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
          })
        );

        // Helper function to delay between API calls
        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        // Try to fetch the BEST (4)EVER playlist first
        let bestEverTracksFormatted = [] as SpotifyTrack[];
        try {
          const bestEverPlaylist = await getPlaylistById(BEST_EVER_PLAYLIST_ID);
          if (bestEverPlaylist && bestEverPlaylist.tracks?.items?.length > 0) {
            bestEverTracksFormatted = bestEverPlaylist.tracks.items.map(
              (item) => item.track
            );
            console.log(
              "Successfully fetched BEST (4)EVER playlist with",
              bestEverTracksFormatted.length,
              "tracks"
            );
          } else {
            console.log("Fallback to static BEST (4)EVER data");
            // Fallback to static data if API fails
            bestEverTracksFormatted = bestEverSongs.map((song, index) => ({
              id: `best-ever-${index}`,
              name: song.name,
              artists: song.artists,
              album: song.album,
              external_urls: song.external_urls,
            })) as SpotifyTrack[];
          }
        } catch (err) {
          console.error("Error fetching BEST (4)EVER playlist:", err);
          // Fallback to static data
          bestEverTracksFormatted = bestEverSongs.map((song, index) => ({
            id: `best-ever-${index}`,
            name: song.name,
            artists: song.artists,
            album: song.album,
            external_urls: song.external_urls,
          })) as SpotifyTrack[];
        }

        // Set initial data with what we have so far
        setFavoriteSongs(bestEverTracksFormatted);
        setFavoriteArtistsWithDetails(updatedFavoriteArtists);

        // Try to fetch from Spotify API, but use sample data if it fails
        let recentTracks = [] as SpotifyTrack[];
        let recentArtists = [] as SpotifyArtist[];
        let userPlaylists = [] as SpotifyPlaylist[];

        // Stagger API calls with delays to avoid rate limits
        try {
          // First API call
          await delay(500);
          recentTracks = await getUserTopTracks().catch((err) => {
            console.error("Error fetching recent tracks:", err);
            return bestEverTracksFormatted.slice(0, 8);
          });
          setTopTracks(recentTracks);

          // Second API call
          await delay(1000);
          recentArtists = await getUserTopArtists().catch((err) => {
            console.error("Error fetching recent artists:", err);
            return [];
          });
          setTopArtists(recentArtists);

          // Third API call
          await delay(1000);
          userPlaylists = await getUserPlaylists().catch((err) => {
            console.error("Error fetching user playlists:", err);
            // Fallback to manual playlists
            return manualPlaylists.map((playlist) => ({
              id: playlist.spotifyUrl.split("/").pop() || "",
              name: playlist.name,
              description: playlist.description,
              owner: { display_name: playlist.owner },
              images: [{ url: playlist.imageUrl, height: 640, width: 640 }],
              tracks: {
                total: playlist.trackCount,
                items: [], // Empty array since we don't have the actual tracks
              },
              external_urls: { spotify: playlist.spotifyUrl },
              public: true,
            }));
          });
          setPlaylists(userPlaylists);
        } catch (err) {
          console.error("Error during staggered API calls:", err);
          // Already handled in the individual catch blocks
        }

        // Calculate genres from all available data
        const genreCounts: Record<string, number> = {};

        // Extract genres from top artists
        recentArtists.forEach((artist) => {
          if (artist.genres) {
            artist.genres.forEach((genre) => {
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
          }
        });

        // Extract genres from favorite artists too
        updatedFavoriteArtists.forEach((artist) => {
          if (artist.genres) {
            artist.genres.forEach((genre) => {
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
          }
        });

        // Create genre data for visualization
        const topGenres = Object.entries(genreCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, value: count }));

        // Store the calculated genre data as a state variable
        if (topGenres.length > 0) {
          setGenreData(topGenres);
        }
      } catch (error) {
        console.error("Error fetching music data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch music data"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchMusicData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      </div>
    );
  }

  // Get music statistics for display
  const totalSongs = favoriteSongs.length;
  const totalArtists = favoriteArtistsWithDetails.length;
  const topGenres = favoriteArtistsWithDetails
    .flatMap((artist) => artist.genres || [])
    .reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topGenresArray = Object.entries(topGenres)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Music</h1>
        <Button
          variant="outline"
          onClick={() => setIsStatsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <BarChart2 className="h-4 w-4" />
          View Stats
        </Button>
      </div>

      <p className="text-muted-foreground mb-8">
        A curated collection of my favorite songs, artists, and playlists that
        make me who I am. Music is a huge part of my life, it helps me a lot
        letting out bottled up emotions. I like to listen to litterally anything
        as long as it makes me feel a certain way.
      </p>

      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md">
          <p className="font-medium">Error: {error}</p>
          <p>Showing static data as a fallback.</p>
        </div>
      )}

      {/* Favorites Section with Tabs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
        <Tabs defaultValue="songs" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="songs">Songs</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
          </TabsList>

          {/* Songs Tab */}
          <TabsContent value="songs" className="mt-0">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedSongs.length} of {favoriteSongs.length} songs
                (page {currentPage} of {totalPages})
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {/* Numbered pagination */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="px-2"
                        >
                          ...
                        </Button>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="px-3"
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {paginatedSongs.map((track, index) => (
                <a
                  key={track.id || `track-${index}`}
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="aspect-square mb-1 relative rounded-md overflow-hidden shadow-md">
                    <Image
                      src={track.album.images[0]?.url || "/placeholder.svg"}
                      alt={track.name}
                      fill
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12.5vw"
                      className="object-cover transition-all group-hover:scale-105"
                      unoptimized
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-6 w-6 text-white fill-current" />
                    </div>
                  </div>
                  <p className="font-medium text-xs truncate">{track.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                </a>
              ))}
            </div>
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="artists" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favoriteArtistsWithDetails.map((artist) => (
                <Card
                  key={artist.spotifyUrl}
                  className={`overflow-hidden ${
                    artist.review
                      ? "cursor-pointer hover:shadow-lg transition-shadow"
                      : ""
                  }`}
                  onClick={() => artist.review && openArtistReviewModal(artist)}
                >
                  <div className="relative pb-[100%] overflow-hidden">
                    {artist.coverUrl ? (
                      <Image
                        src={artist.coverUrl}
                        alt={artist.name || "Artist"}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        className="object-cover transition-all hover:scale-105"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <User className="h-16 w-16 text-muted-foreground opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      #{artist.rank}
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-bold text-sm line-clamp-1 text-center">
                      {artist.name}
                    </h3>
                    <div className="flex justify-center items-center gap-1 mt-1">
                      <span
                        className={`text-sm font-bold ${getRatingColor(
                          artist.rating
                        )}`}
                      >
                        {artist.rating.toFixed(1)}
                      </span>
                      <Star
                        className={`h-3 w-3 fill-current ${getRatingColor(
                          artist.rating
                        )}`}
                      />
                    </div>
                    {artist.genres && artist.genres.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {artist.genres.slice(0, 2).map((genre, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-muted text-xs rounded-md"
                          >
                            {genre}
                          </span>
                        ))}
                        {artist.genres.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-muted text-xs rounded-md">
                            +{artist.genres.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    {artist.review && (
                      <div className="mt-2 text-center">
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-xs"
                        >
                          Read my review
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-2 pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={artist.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Open in Spotify</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* My Playlists Section */}
      {playlists.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">My Playlists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists.map((playlist) => (
              <a
                key={playlist.id}
                href={playlist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="aspect-square mb-2 relative rounded-md overflow-hidden shadow-md">
                  <Image
                    src={playlist.images[0]?.url || "/placeholder.svg"}
                    alt={playlist.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-all group-hover:scale-105"
                    unoptimized
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-12 w-12 text-white fill-current" />
                  </div>
                </div>
                <p className="font-medium truncate">{playlist.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {playlist.tracks.total} tracks • {playlist.owner.display_name}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Top Genres Section */}
      {genreData.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top Genres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {genreData.map(({ name, value }, index) => (
              <Card key={name} className="overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <div className="bg-primary/10 p-3 rounded-full mb-2">
                    <Disc className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium capitalize">{name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {value} occurrences
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Recently Played Tracks Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recently Played Tracks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {topTracks.slice(0, 12).map((track, index) => (
            <a
              key={track.id || `recent-track-${index}`}
              href={track.external_urls?.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="aspect-square mb-2 relative rounded-md overflow-hidden shadow-md">
                <Image
                  src={track.album?.images[0]?.url || "/placeholder.svg"}
                  alt={track.name}
                  fill
                  className="object-cover transition-all group-hover:scale-105"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-10 w-10 text-white fill-current" />
                </div>
              </div>
              <p className="font-medium text-sm truncate">{track.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {track.artists?.map((a) => a.name).join(", ")}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Recently Played Artists Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recently Played Artists</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {topArtists.slice(0, 16).map((artist, index) => (
            <a
              key={artist.id || `recent-artist-${index}`}
              href={artist.external_urls?.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="aspect-square mb-2 relative rounded-full overflow-hidden shadow-md">
                <Image
                  src={artist.images?.[0]?.url || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  className="object-cover transition-all group-hover:scale-105"
                  onError={handleImageError}
                />
              </div>
              <p className="font-medium text-sm truncate text-center">
                {artist.name}
              </p>
            </a>
          ))}
        </div>
      </section>

      <MusicStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
      />

      {/* Artist Review Modal */}
      {selectedArtist && (
        <ArtistReviewModal
          isOpen={isArtistModalOpen}
          onClose={closeArtistReviewModal}
          artist={selectedArtist}
        />
      )}
    </div>
  );
}
