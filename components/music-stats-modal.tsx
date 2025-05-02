"use client";

import React, { useState, useEffect } from "react";
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
} from "recharts";

interface MusicStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  // Static fallback data for BEST (4)EVER playlist artists
  const topArtistsFallback = [
    { name: "Black Eyed Peas", count: 3 },
    { name: "50 Cent", count: 2 },
    { name: "Kid Cudi", count: 3 },
    { name: "JAY-Z", count: 2 },
    { name: "Justin Timberlake", count: 3 },
    { name: "Alicia Keys", count: 2 },
  ];

  // Static data for release decades
  const decadeData = [
    { name: "2000s", count: 15 },
    { name: "2010s", count: 10 },
    { name: "1990s", count: 4 },
    { name: "1980s", count: 2 },
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
              <TabsTrigger value="tracks" className="flex gap-2 items-center">
                <Music className="h-4 w-4" />
                Top Tracks
              </TabsTrigger>
              <TabsTrigger value="artists" className="flex gap-2 items-center">
                <User className="h-4 w-4" />
                Top Artists
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
                      <p className="text-3xl font-bold">31</p>
                      <p className="text-sm text-muted-foreground">
                        Favorite Songs
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <User className="h-8 w-8 mb-2 text-primary" />
                      <p className="text-3xl font-bold">5</p>
                      <p className="text-sm text-muted-foreground">
                        Favorite Artists
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <ListMusic className="h-8 w-8 mb-2 text-primary" />
                      <p className="text-3xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Playlists</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <Star className="h-8 w-8 mb-2 text-primary" />
                      <p className="text-3xl font-bold">9.2</p>
                      <p className="text-sm text-muted-foreground">
                        Average Rating
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">
                        Top Genres Distribution
                      </h4>
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

                {/* Top Artists */}
                <div>
                  <h4 className="font-medium mb-4">Most Featured Artists</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {topArtistsFallback.map((artist, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                          <p className="text-lg font-bold">{artist.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {artist.count} songs
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tracks">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">My Top Tracks</h3>
                <div className="grid gap-2">
                  {topTracks.length > 0 ? (
                    topTracks.slice(0, 10).map((track, index) => (
                      <div
                        key={track.id || `track-${index}`}
                        className="flex items-center p-2 rounded-md bg-secondary/20"
                      >
                        <div className="mr-4 w-6 text-muted-foreground font-medium">
                          {index + 1}
                        </div>
                        <div className="relative w-10 h-10 mr-4">
                          <Image
                            src={
                              track.album?.images[0]?.url || "/placeholder.svg"
                            }
                            alt={track.name}
                            fill
                            className="object-cover rounded-sm"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-medium truncate">{track.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {track.artists?.map((a) => a.name).join(", ")}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground ml-2">
                          {track.duration_ms
                            ? formatDuration(track.duration_ms)
                            : ""}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          asChild
                        >
                          <a
                            href={track.external_urls?.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Music className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No track data available</p>
                      <p className="text-sm mt-2">
                        Check your Spotify credentials or try again later
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="artists">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">My Top Artists</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {topArtists.length > 0 ? (
                    topArtists.slice(0, 12).map((artist, index) => (
                      <a
                        key={artist.id || `artist-${index}`}
                        href={artist.external_urls?.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group transition-all hover:scale-[1.02]"
                      >
                        <div className="aspect-square mb-2 relative rounded-md overflow-hidden">
                          <Image
                            src={artist.images?.[0]?.url || "/placeholder.svg"}
                            alt={artist.name}
                            fill
                            className="object-cover transition-all group-hover:scale-105"
                          />
                        </div>
                        <p className="font-medium truncate">{artist.name}</p>
                        {artist.genres?.length > 0 && (
                          <p className="text-xs text-muted-foreground truncate">
                            {artist.genres.slice(0, 2).join(", ")}
                            {artist.genres.length > 2 && "..."}
                          </p>
                        )}
                      </a>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground col-span-full">
                      <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No artist data available</p>
                      <p className="text-sm mt-2">
                        Using fallback data instead
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="genres">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Genre Analysis</h3>

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
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
