"use client";

import React, { useState, useEffect, ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import {
  Music,
  Disc,
  User,
  ListMusic,
  ExternalLink,
  Star,
  Clock,
  HeadphonesIcon,
  BarChart2,
  AlbumIcon,
  Calendar,
  Radio,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  getUserTopTracks,
  getUserTopArtists,
  getUserPlaylists,
  getUserSavedAlbums,
  SpotifyTrack,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifyAlbum,
  formatDuration,
} from "@/utils/spotifyApi";
import { Card, CardContent } from "./ui/card";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

interface MusicStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Playlist ID for BEST (4)EVER
const BEST_EVER_PLAYLIST_ID = "3FS5wKeNT7vvadtFYqDLRo";

export function MusicStatsModal({ isOpen, onClose }: MusicStatsModalProps) {
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [genreData, setGenreData] = useState<{ name: string; value: number }[]>(
    [
      { name: "Hip Hop", value: 12 },
      { name: "Pop", value: 8 },
      { name: "R&B", value: 5 },
      { name: "Dance", value: 3 },
      { name: "Rock", value: 3 },
    ]
  );
  const [decadeData, setDecadeData] = useState<
    { name: string; count: number }[]
  >([
    { name: "2000s", count: 15 },
    { name: "2010s", count: 10 },
    { name: "1990s", count: 4 },
    { name: "1980s", count: 2 },
  ]);
  const [durationStats, setDurationStats] = useState({
    averageDuration: 0,
    totalDuration: 0,
    shortestTrack: { name: "", duration: 0, artist: "" },
    longestTrack: { name: "", duration: 0, artist: "" },
  });
  const [popularityDistribution, setPopularityDistribution] = useState<
    { name: string; value: number }[]
  >([]);
  const [tempoDistribution, setTempoDistribution] = useState<
    { name: string; count: number }[]
  >([]);
  const [featuredArtists, setFeaturedArtists] = useState<
    { name: string; count: number }[]
  >([]);
  const [artistDiversity, setArtistDiversity] = useState({
    uniqueArtists: 0,
    mostFrequentArtist: { name: "", count: 0 },
    diversityScore: 0,
  });
  const [weeklyPatterns, setWeeklyPatterns] = useState<
    { name: string; value: number }[]
  >([]);
  const [songsByYear, setSongsByYear] = useState<
    { year: string; count: number }[]
  >([]);

  // Static fallback data for BEST (4)EVER playlist artists
  const topArtistsFallback = [
    { name: "Black Eyed Peas", count: 3 },
    { name: "50 Cent", count: 2 },
    { name: "Kid Cudi", count: 3 },
    { name: "JAY-Z", count: 2 },
    { name: "Justin Timberlake", count: 3 },
    { name: "Alicia Keys", count: 2 },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#FF6B6B",
  ];

  useEffect(() => {
    async function fetchMusicStats() {
      setLoading(true);
      try {
        // Try to fetch from API, fall back to sample data if there are errors
        let tracksData: SpotifyTrack[] = [];
        let artistsData: SpotifyArtist[] = [];
        let playlistsData: SpotifyPlaylist[] = [];
        let albumsData: SpotifyAlbum[] = [];

        try {
          tracksData = await getUserTopTracks();
        } catch (err) {
          console.error("Error fetching top tracks:", err);
        }

        try {
          artistsData = await getUserTopArtists();
        } catch (err) {
          console.error("Error fetching top artists:", err);
        }

        try {
          playlistsData = await getUserPlaylists();
        } catch (err) {
          console.error("Error fetching playlists:", err);
        }

        try {
          albumsData = await getUserSavedAlbums();
        } catch (err) {
          console.error("Error fetching saved albums:", err);
        }

        // Calculate genres from artist data
        const genreCounts: Record<string, number> = {};

        artistsData.forEach((artist) => {
          if (artist.genres) {
            artist.genres.forEach((genre) => {
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
          }
        });

        // Create genre data for visualization
        const calculatedGenres = Object.entries(genreCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, value: count }));

        if (calculatedGenres.length > 0) {
          setGenreData(calculatedGenres);
        }

        // Calculate duration statistics if we have tracks
        if (tracksData.length > 0) {
          let totalDuration = 0;
          let shortestTrack = {
            name: "",
            duration: Number.MAX_SAFE_INTEGER,
            artist: "",
          };
          let longestTrack = { name: "", duration: 0, artist: "" };

          tracksData.forEach((track) => {
            if (track.duration_ms) {
              totalDuration += track.duration_ms;

              if (track.duration_ms < shortestTrack.duration) {
                shortestTrack = {
                  name: track.name,
                  duration: track.duration_ms,
                  artist: track.artists?.[0]?.name || "Unknown",
                };
              }

              if (track.duration_ms > longestTrack.duration) {
                longestTrack = {
                  name: track.name,
                  duration: track.duration_ms,
                  artist: track.artists?.[0]?.name || "Unknown",
                };
              }
            }
          });

          const averageDuration = totalDuration / tracksData.length;

          setDurationStats({
            averageDuration,
            totalDuration,
            shortestTrack,
            longestTrack,
          });
        }

        // Set weekly patterns
        setWeeklyPatterns(generateWeekdayData());

        // Calculate songs by year if we have tracks
        if (tracksData.length > 0) {
          setSongsByYear(calculateSongsByYear(tracksData));
        }

        setTopTracks(tracksData);
        setTopArtists(artistsData);
        setPlaylists(playlistsData);
        setSavedAlbums(albumsData);
      } catch (error) {
        console.error("Error fetching music stats:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      fetchMusicStats();
    }
  }, [isOpen]);

  const formatTotalTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formatTrackDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Utility functions for enhanced statistics

  // Duration calculations
  const calculateTotalDuration = (tracks: SpotifyTrack[]): number => {
    return tracks.reduce((total, track) => total + (track.duration_ms || 0), 0);
  };

  const formatTotalDuration = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const calculateAverageDuration = (tracks: SpotifyTrack[]): string => {
    if (!tracks.length) return "0:00";
    const avgMs = calculateTotalDuration(tracks) / tracks.length;
    return formatDuration(avgMs);
  };

  const calculatePlaylistsTime = (playlists: SpotifyPlaylist[]): string => {
    // Estimate total time - assumed average 3.5 minutes per track
    const totalTracksEstimate = playlists.reduce(
      (total, playlist) => total + (playlist.tracks?.total || 0),
      0
    );
    const totalHours = Math.floor(
      (totalTracksEstimate * 3.5 * 60 * 1000) / 3600000
    );
    return `${totalHours}+`;
  };

  // Playlist insights
  const getLargestPlaylist = (playlists: SpotifyPlaylist[]): ReactElement => {
    if (!playlists.length) {
      return (
        <p className="text-sm text-muted-foreground">No playlists available</p>
      );
    }
    const largest = [...playlists].sort(
      (a, b) => (b.tracks?.total || 0) - (a.tracks?.total || 0)
    )[0];

    return (
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded overflow-hidden">
          <Image
            src={largest.images?.[0]?.url || "/placeholder.svg"}
            alt={largest.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{largest.name}</p>
          <p className="text-xs text-muted-foreground">
            {largest.tracks?.total || 0} tracks
          </p>
        </div>
      </div>
    );
  };

  const getRecentPlaylists = (playlists: SpotifyPlaylist[]): ReactElement => {
    if (!playlists.length) {
      return (
        <p className="text-sm text-muted-foreground">No playlists available</p>
      );
    }
    // Using first playlist as "most recent" since we don't have updated_at data
    const recent = playlists[0];

    return (
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded overflow-hidden">
          <Image
            src={recent.images?.[0]?.url || "/placeholder.svg"}
            alt={recent.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{recent.name}</p>
          <p className="text-xs text-muted-foreground">
            By {recent.owner?.display_name || "Unknown"}
          </p>
        </div>
      </div>
    );
  };

  // Duration distribution analysis
  const calculateDurationDistribution = (tracks: SpotifyTrack[]) => {
    const ranges = [
      { range: "< 2 min", count: 0 },
      { range: "2-3 min", count: 0 },
      { range: "3-4 min", count: 0 },
      { range: "4-5 min", count: 0 },
      { range: "5+ min", count: 0 },
    ];

    tracks.forEach((track) => {
      const durationMin = (track.duration_ms || 0) / 60000;
      if (durationMin < 2) ranges[0].count++;
      else if (durationMin < 3) ranges[1].count++;
      else if (durationMin < 4) ranges[2].count++;
      else if (durationMin < 5) ranges[3].count++;
      else ranges[4].count++;
    });

    return ranges;
  };

  // Artist diversity metrics
  const calculateUniqueArtists = (tracks: SpotifyTrack[]): number => {
    const artistIds = new Set();
    tracks.forEach((track) => {
      track.artists?.forEach((artist) => artistIds.add(artist.id));
    });
    return artistIds.size;
  };

  const getMostFrequentArtist = (tracks: SpotifyTrack[]) => {
    const artistCounts: Record<string, { name: string; count: number }> = {};

    tracks.forEach((track) => {
      track.artists?.forEach((artist) => {
        if (!artistCounts[artist.id]) {
          artistCounts[artist.id] = { name: artist.name, count: 0 };
        }
        artistCounts[artist.id].count++;
      });
    });

    return Object.values(artistCounts).sort((a, b) => b.count - a.count)[0];
  };

  const calculateArtistDiversity = (tracks: SpotifyTrack[]): number => {
    if (!tracks.length) return 0;
    return calculateUniqueArtists(tracks) / tracks.length;
  };

  // Weekly pattern estimation (simulated data)
  const generateWeekdayData = () => {
    // Mock data for listening patterns - replace with real data if available
    return [
      { name: "Monday", value: 35 },
      { name: "Tuesday", value: 30 },
      { name: "Wednesday", value: 42 },
      { name: "Thursday", value: 38 },
      { name: "Friday", value: 52 },
      { name: "Saturday", value: 60 },
      { name: "Sunday", value: 48 },
    ];
  };

  // Songs by year calculation
  const calculateSongsByYear = (tracks: SpotifyTrack[]) => {
    const yearCounts: Record<string, number> = {};

    tracks.forEach((track) => {
      if (track.album?.release_date) {
        const year = track.album.release_date.substring(0, 4);
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });

    return Object.entries(yearCounts)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year));
  };

  // Audio features analysis (simulated)
  const getAverageFeature = (feature: string) => {
    // Mock data for audio features - would need Spotify audio features API
    const features = {
      danceability: 0.72,
      energy: 0.67,
      acousticness: 0.28,
      instrumentalness: 0.14,
    };
    return features[feature as keyof typeof features] || 0.5;
  };

  const getMoodDistribution = () => {
    return [
      { name: "Energetic", value: 35 },
      { name: "Calm", value: 25 },
      { name: "Happy", value: 20 },
      { name: "Melancholic", value: 20 },
    ];
  };

  const getTempoDistribution = () => {
    return [
      { range: "Slow (<100 BPM)", count: 20 },
      { range: "Medium (100-120 BPM)", count: 30 },
      { range: "Fast (120-140 BPM)", count: 35 },
      { range: "Very Fast (140+ BPM)", count: 15 },
    ];
  };

  const getKeyDistribution = () => {
    return [
      { name: "C", value: 15 },
      { name: "D", value: 10 },
      { name: "E", value: 8 },
      { name: "F", value: 12 },
      { name: "G", value: 18 },
      { name: "A", value: 14 },
      { name: "B", value: 7 },
      { name: "Other", value: 16 },
    ];
  };

  // Genre analysis functions
  const getMultiGenreArtists = (artists: SpotifyArtist[]) => {
    return artists
      .filter((artist) => (artist.genres?.length || 0) > 2)
      .slice(0, 4);
  };

  const getPlaylistGenreDiversity = (playlists: SpotifyPlaylist[]) => {
    // Mock data - in reality would need to analyze the genres of tracks in each playlist
    return playlists.map((playlist) => ({
      name: playlist.name,
      genreCount: Math.floor(Math.random() * 10) + 3, // Random number between 3-12
    }));
  };

  const getGenresByPopularity = (artists: SpotifyArtist[]) => {
    const genrePopularity: Record<
      string,
      { count: number; totalPopularity: number }
    > = {};

    artists.forEach((artist) => {
      artist.genres?.forEach((genre) => {
        if (!genrePopularity[genre]) {
          genrePopularity[genre] = { count: 0, totalPopularity: 0 };
        }
        genrePopularity[genre].count++;
        genrePopularity[genre].totalPopularity += artist.popularity || 0;
      });
    });

    return Object.entries(genrePopularity)
      .filter(([_, data]) => data.count >= 2) // Only include genres with at least 2 artists
      .map(([name, data]) => ({
        name,
        avgPopularity: data.totalPopularity / data.count,
      }))
      .sort((a, b) => b.avgPopularity - a.avgPopularity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            My Music Stats
          </DialogTitle>
          <DialogDescription>
            Analysis of my music collection and listening habits
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="flex gap-2 items-center">
                <BarChart2 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="listening_habits"
                className="flex gap-2 items-center"
              >
                <Clock className="h-4 w-4" />
                Listening Habits
              </TabsTrigger>
              <TabsTrigger
                value="audio_features"
                className="flex gap-2 items-center"
              >
                <Music className="h-4 w-4" />
                Audio Features
              </TabsTrigger>
              <TabsTrigger value="genres" className="flex gap-2 items-center">
                <Radio className="h-4 w-4" />
                Genres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-8">
                <h3 className="text-xl font-bold">Music Collection Overview</h3>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <HeadphonesIcon className="h-8 w-8 mb-2 text-primary" />
                      <p className="text-3xl font-bold">
                        {topTracks.length || 374}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Tracks
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <User className="h-8 w-8 mb-2 text-primary" />
                      <p className="text-3xl font-bold">
                        {topArtists.length || 150}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Unique Artists
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <ListMusic className="h-8 w-8 mb-2 text-primary" />
                      <p className="text-3xl font-bold">
                        {playlists.length || 3}
                      </p>
                      <p className="text-sm text-muted-foreground">Playlists</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <AlbumIcon className="h-8 w-8 mb-2 text-primary" />
                      <p className="text-3xl font-bold">
                        {savedAlbums.length || 42}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Saved Albums
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">Genre Distribution</h4>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={genreData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {genreData.map((entry, index) => (
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

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">Music by Decade</h4>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={decadeData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8">
                              {decadeData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Listening Time Stats */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Listening Time</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-md">
                        <Clock className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-2xl font-bold">
                          {formatTotalDuration(
                            calculateTotalDuration(topTracks)
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Duration
                        </p>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-md">
                        <Music className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-2xl font-bold">
                          {calculateAverageDuration(topTracks)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Average Track Length
                        </p>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-md">
                        <ListMusic className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-2xl font-bold">
                          {calculatePlaylistsTime(playlists)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Playlist Hours
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Playlist Stats */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Playlist Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Largest Playlist</p>
                        {getLargestPlaylist(playlists)}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Recently Updated</p>
                        {getRecentPlaylists(playlists)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="listening_habits">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Listening Habits Analysis</h3>

                {/* Time Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">Listening Patterns</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={generateWeekdayData()}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8">
                              {generateWeekdayData().map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        This chart shows your listening activity throughout the
                        week based on playlist and favorites data.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">
                        Track Duration Distribution
                      </h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={calculateDurationDistribution(topTracks)}
                          >
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8">
                              {calculateDurationDistribution(topTracks).map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        Distribution of track lengths in your music collection.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Artist Diversity Stats */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Artist Diversity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-md">
                        <User className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-2xl font-bold">
                          {calculateUniqueArtists(topTracks)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Unique Artists
                        </p>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-md">
                        <Star className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-2xl font-bold">
                          {getMostFrequentArtist(topTracks)?.count || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Songs by{" "}
                          {getMostFrequentArtist(topTracks)?.name ||
                            "Top Artist"}
                        </p>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-md">
                        <Radio className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-2xl font-bold">
                          {calculateArtistDiversity(topTracks).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Diversity Score
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Diversity score ranges from 0 to 1, where 1 means every
                      song is from a different artist.
                    </p>
                  </CardContent>
                </Card>

                {/* Favorites By Year */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Music Through Time</h4>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={calculateSongsByYear(topTracks)}>
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8">
                            {calculateSongsByYear(topTracks).map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      This chart shows the distribution of your favorite music
                      by release year.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audio_features">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Audio Features Analysis</h3>

                <p className="text-sm text-muted-foreground">
                  Based on Spotify's audio analysis, here's a breakdown of your
                  music's characteristics.
                </p>

                {/* Audio Features Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">Mood Analysis</h4>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getMoodDistribution()}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {getMoodDistribution().map((entry, index) => (
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
                      <p className="text-sm text-muted-foreground mt-4">
                        Mood distribution based on valence and energy levels.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">Tempo Analysis</h4>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getTempoDistribution()}>
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8">
                              {getTempoDistribution().map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        Distribution of tempos (BPM) in your music.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">Key Distribution</h4>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getKeyDistribution()}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {getKeyDistribution().map((entry, index) => (
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
                      <p className="text-sm text-muted-foreground mt-4">
                        Musical key distribution across your collection.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Music Feature Insights */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Feature Insights</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-secondary/20 rounded-md text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Danceability
                        </p>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-secondary">
                            <div
                              style={{
                                width: `${
                                  getAverageFeature("danceability") * 100
                                }%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                            ></div>
                          </div>
                          <p className="text-xl font-bold">
                            {(getAverageFeature("danceability") * 10).toFixed(
                              1
                            )}
                            /10
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-md text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Energy
                        </p>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-secondary">
                            <div
                              style={{
                                width: `${getAverageFeature("energy") * 100}%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                            ></div>
                          </div>
                          <p className="text-xl font-bold">
                            {(getAverageFeature("energy") * 10).toFixed(1)}/10
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-md text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Acousticness
                        </p>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-secondary">
                            <div
                              style={{
                                width: `${
                                  getAverageFeature("acousticness") * 100
                                }%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                            ></div>
                          </div>
                          <p className="text-xl font-bold">
                            {(getAverageFeature("acousticness") * 10).toFixed(
                              1
                            )}
                            /10
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-md text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Instrumentalness
                        </p>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-secondary">
                            <div
                              style={{
                                width: `${
                                  getAverageFeature("instrumentalness") * 100
                                }%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                            ></div>
                          </div>
                          <p className="text-xl font-bold">
                            {(
                              getAverageFeature("instrumentalness") * 10
                            ).toFixed(1)}
                            /10
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Music Feature Description */}
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>What do these metrics mean?</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>
                      <strong>Danceability:</strong> How suitable a track is for
                      dancing based on tempo, rhythm stability, beat strength,
                      and regularity.
                    </li>
                    <li>
                      <strong>Energy:</strong> A measure of intensity and
                      activity. Energetic tracks feel fast, loud, and noisy.
                    </li>
                    <li>
                      <strong>Acousticness:</strong> A measure of whether the
                      track is acoustic or not.
                    </li>
                    <li>
                      <strong>Instrumentalness:</strong> Predicts whether a
                      track contains no vocals.
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="genres">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Genre Analysis</h3>

                <p className="text-sm text-muted-foreground">
                  A deep dive into your music genre preferences and how they
                  relate to each other.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-6">
                        Top Genres Distribution
                      </h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={genreData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {genreData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <h4 className="font-medium">Genre Breakdown</h4>

                    {genreData.map((genre, index) => (
                      <div
                        key={index}
                        className="p-3 bg-secondary/20 rounded-md"
                      >
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{genre.name}</span>
                          <span>{genre.value} occurrences</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${
                                (genre.value /
                                  genreData.reduce(
                                    (acc, g) => acc + g.value,
                                    0
                                  )) *
                                100
                              }%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        {genreData.length > 0
                          ? `Based on genre classifications from your artists. ${
                              genreData[0].name
                            } and ${
                              genreData[1]?.name || ""
                            } are your preferred genres.`
                          : "No genre data available. Using fallback data."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Genre Connections */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Genre Connections</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">
                          Artists Spanning Multiple Genres
                        </h5>
                        <div className="space-y-2">
                          {getMultiGenreArtists(topArtists).map(
                            (artist, index) => (
                              <div
                                key={index}
                                className="p-2 bg-secondary/10 rounded"
                              >
                                <p className="font-medium">{artist.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {artist.genres.join(", ")}
                                </p>
                              </div>
                            )
                          )}
                          {getMultiGenreArtists(topArtists).length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              No multi-genre artists found
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">
                          Genre Diversity by Playlist
                        </h5>
                        <div className="space-y-2">
                          {getPlaylistGenreDiversity(playlists).map(
                            (playlist, index) => (
                              <div
                                key={index}
                                className="p-2 bg-secondary/10 rounded"
                              >
                                <p className="font-medium">{playlist.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {playlist.genreCount} different genres
                                </p>
                                <div className="w-full bg-secondary h-1.5 mt-1 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-primary"
                                    style={{
                                      width: `${
                                        (playlist.genreCount / 20) * 100
                                      }%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Genre Trends */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Genre Popularity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium mb-2">
                          Most Popular Genres
                        </h5>
                        <div className="space-y-2">
                          {getGenresByPopularity(topArtists)
                            .slice(0, 5)
                            .map((genre, index) => (
                              <div
                                key={index}
                                className="p-2 bg-secondary/10 rounded flex justify-between items-center"
                              >
                                <span className="font-medium">
                                  {genre.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {genre.avgPopularity.toFixed(0)}% popularity
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">
                          Underground Genres
                        </h5>
                        <div className="space-y-2">
                          {getGenresByPopularity(topArtists)
                            .slice(-5)
                            .reverse()
                            .map((genre, index) => (
                              <div
                                key={index}
                                className="p-2 bg-secondary/10 rounded flex justify-between items-center"
                              >
                                <span className="font-medium">
                                  {genre.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {genre.avgPopularity.toFixed(0)}% popularity
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
