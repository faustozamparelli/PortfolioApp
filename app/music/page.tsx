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
import { useState, useEffect, useCallback, Suspense } from "react";
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
import { useDataPreload } from "@/hooks/use-data-preload";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper function to get color based on rating
function getRatingColor(rating: number) {
  if (rating >= 9) return "text-green-500 dark:text-green-400";
  if (rating >= 7) return "text-blue-500 dark:text-blue-400";
  if (rating >= 5) return "text-yellow-500 dark:text-yellow-400";
  if (rating >= 3) return "text-orange-500 dark:text-orange-400";
  return "text-red-500 dark:text-red-400";
}

// Add a skeleton loader component
const SkeletonCard = () => (
  <div className="flex flex-col gap-2">
    <div className="aspect-square bg-muted animate-pulse rounded-md"></div>
    <div className="h-4 w-2/3 bg-muted animate-pulse rounded-md"></div>
    <div className="h-3 w-1/2 bg-muted animate-pulse rounded-md"></div>
  </div>
);

// Playlist section with lazy loading
const LazyPlaylistSection = ({
  playlists,
  isLoading,
  handleImageError,
}: any) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <SkeletonCard key={i} />
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {playlists.map((playlist: any, index: number) => (
        <a
          key={index}
          href={playlist.external_urls?.spotify || playlist.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="aspect-square mb-2 relative rounded-md overflow-hidden shadow-md">
            <Image
              src={playlist.images?.[0]?.url || "/placeholder.svg"}
              alt={playlist.name || "Playlist"}
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
            {playlist.tracks?.total || 0} tracks
          </p>
        </a>
      ))}
    </div>
  );
};

// Artists section with lazy loading
const LazyArtistsSection = ({
  artists,
  isLoading,
  openArtistReviewModal,
  handleImageError,
}: any) => {
  const [visibleArtists, setVisibleArtists] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && artists.length > 0) {
      // Show all artists immediately instead of just the first 5
      setVisibleArtists(artists);
    }
  }, [isLoading, artists]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <SkeletonCard key={i} />
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {visibleArtists.map((artist) => (
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
                className={`text-sm font-bold ${getRatingColor(artist.rating)}`}
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
                {artist.genres.slice(0, 2).map((genre: string, idx: number) => (
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
                <Button variant="link" size="sm" className="p-0 h-auto text-xs">
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
  );
};

export default function MusicPage() {
  const { data, preloadMusic } = useDataPreload();
  const {
    loaded: dataLoaded,
    loading: dataLoading,
    error: dataError,
    favoriteSongs,
    favoriteArtists,
    topTracks,
    topArtists,
    manualPlaylists,
  } = data.music;

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

  // Load music data if not already loaded
  useEffect(() => {
    if (!dataLoaded && !dataLoading) {
      preloadMusic();
    }
  }, [dataLoaded, dataLoading, preloadMusic]);

  // Calculate genre data from artists
  useEffect(() => {
    if (dataLoaded && favoriteArtists.length > 0 && topArtists.length > 0) {
      // Calculate genres from all available data
      const genreCounts: Record<string, number> = {};

      // Extract genres from top artists
      topArtists.forEach((artist) => {
        if (artist.genres) {
          artist.genres.forEach((genre) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        }
      });

      // Extract genres from favorite artists too
      favoriteArtists.forEach((artist) => {
        if (artist.genres) {
          artist.genres.forEach((genre) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        }
      });

      // Create genre data for visualization - show up to 10 genres instead of just 5
      const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, value: count }));

      // Store the calculated genre data as a state variable
      if (topGenres.length > 0) {
        setGenreData(topGenres);
      }
    }
  }, [dataLoaded, favoriteArtists, topArtists]);

  // Show loading state while data is loading
  if (dataLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (dataError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-md text-red-800 dark:text-red-100">
          <h2 className="text-2xl font-bold mb-2">Error loading music data</h2>
          <p>{dataError}</p>
          <button
            onClick={() => preloadMusic()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get music statistics for display
  const totalSongs = favoriteSongs.length;
  const totalArtists = favoriteArtists.length;
  const topGenres = favoriteArtists
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
            <LazyArtistsSection
              artists={favoriteArtists}
              isLoading={dataLoading}
              openArtistReviewModal={openArtistReviewModal}
              handleImageError={handleImageError}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* My Playlists Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">My Playlists</h2>
        <LazyPlaylistSection
          playlists={manualPlaylists}
          isLoading={dataLoading}
          handleImageError={handleImageError}
        />
      </section>

      {/* Recently Played Tracks Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top Tracks This Month</h2>
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
        <h2 className="text-2xl font-bold mb-6">Top Artists This Month</h2>
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

      {/* Top Genres Section */}
      {genreData.length > 0 && (
        <section className="pt-12 mb-12">
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
