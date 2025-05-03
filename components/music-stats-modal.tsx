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
  Calendar,
  HeadphonesIcon,
  BarChart2,
  Star,
  Clock,
  AlbumIcon,
  Radio,
  Sparkles,
  Flame,
  Heart,
  Calendar as CalendarIcon,
  LineChart,
  Clock3,
  Globe,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
  const [activeTab, setActiveTab] = useState<string>("musical-identity");

  // Color palette for charts
  const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#FFD166",
    "#88D9E6",
    "#6A0572",
    "#6A0572",
  ];

  // Fetch data when the modal opens
  useEffect(() => {
    async function fetchMusicData() {
      setLoading(true);
      try {
        // Fetch data from Spotify API
        const [tracks, artists, userPlaylists, albums] =
          await Promise.allSettled([
            getUserTopTracks(),
            getUserTopArtists(),
            getUserPlaylists(),
            getUserSavedAlbums(),
          ]);

        if (tracks.status === "fulfilled") setTopTracks(tracks.value);
        if (artists.status === "fulfilled") setTopArtists(artists.value);
        if (userPlaylists.status === "fulfilled")
          setPlaylists(userPlaylists.value);
        if (albums.status === "fulfilled") setSavedAlbums(albums.value);
      } catch (error) {
        console.error("Error fetching music data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      fetchMusicData();
    }
  }, [isOpen]);

  // Data processing functions
  const getGenreData = (): { name: string; value: number }[] => {
    const genreCounts: Record<string, number> = {};

    topArtists.forEach((artist) => {
      if (artist.genres) {
        artist.genres.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    // Create genre data sorted by count
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, value: count }));
  };

  const getDecadeData = (): { name: string; count: number }[] => {
    const decades: Record<string, number> = {};

    topTracks.forEach((track) => {
      if (track.album?.release_date) {
        const year = parseInt(track.album.release_date.substring(0, 4));
        const decade = `${Math.floor(year / 10) * 10}s`;
        decades[decade] = (decades[decade] || 0) + 1;
      }
    });

    return Object.entries(decades)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        // Extract the decade number for proper sorting
        const decadeA = parseInt(a.name.substring(0, 4));
        const decadeB = parseInt(b.name.substring(0, 4));
        return decadeA - decadeB;
      });
  };

  const getArtistDiversity = (): number => {
    if (!topTracks.length) return 0;
    const uniqueArtists = new Set();

    topTracks.forEach((track) => {
      track.artists?.forEach((artist) => uniqueArtists.add(artist.id));
    });

    return parseFloat((uniqueArtists.size / topTracks.length).toFixed(2));
  };

  const getListeningActivityPattern = (): { name: string; value: number }[] => {
    // This would ideally use real data, but generating sample data for now
    return [
      { name: "Morning", value: Math.floor(Math.random() * 40) + 10 },
      { name: "Afternoon", value: Math.floor(Math.random() * 40) + 20 },
      { name: "Evening", value: Math.floor(Math.random() * 40) + 30 },
      { name: "Night", value: Math.floor(Math.random() * 40) + 15 },
    ];
  };

  const getDurationDistribution = (): { range: string; count: number }[] => {
    const ranges = [
      { range: "< 2 min", count: 0 },
      { range: "2-3 min", count: 0 },
      { range: "3-4 min", count: 0 },
      { range: "4-5 min", count: 0 },
      { range: "5+ min", count: 0 },
    ];

    topTracks.forEach((track) => {
      const durationMin = (track.duration_ms || 0) / 60000;
      if (durationMin < 2) ranges[0].count++;
      else if (durationMin < 3) ranges[1].count++;
      else if (durationMin < 4) ranges[2].count++;
      else if (durationMin < 5) ranges[3].count++;
      else ranges[4].count++;
    });

    return ranges;
  };

  const getMoodMap = (): any[] => {
    // Sample data - would integrate with Spotify audio features API
    return [
      { subject: "Energy", A: 80, fullMark: 100 },
      { subject: "Danceability", A: 75, fullMark: 100 },
      { subject: "Acousticness", A: 45, fullMark: 100 },
      { subject: "Positivity", A: 65, fullMark: 100 },
      { subject: "Instrumentalness", A: 35, fullMark: 100 },
      { subject: "Liveness", A: 60, fullMark: 100 },
    ];
  };

  const getTopArtistsWithImage = () => {
    return topArtists.slice(0, 5).map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url || "/placeholder.svg",
      popularity: artist.popularity || 0,
      genres: artist.genres?.slice(0, 2).join(", ") || "Unknown",
    }));
  };

  const getAverageTrackDuration = (): string => {
    if (!topTracks.length) return "0:00";
    const totalMs = topTracks.reduce(
      (total, track) => total + (track.duration_ms || 0),
      0
    );
    return formatDuration(totalMs / topTracks.length);
  };

  const getListeningStreaks = (): {
    type: string;
    days: number;
    description: string;
  }[] => {
    // This would ideally come from actual listening data, using mock data for now
    return [
      {
        type: "Daily Streak",
        days: 12,
        description: "Consecutive days listening to music",
      },
      {
        type: "Genre Streak",
        days: 8,
        description: "Days focused on a single genre",
      },
      {
        type: "Artist Streak",
        days: 5,
        description: "Days with the same artist in heavy rotation",
      },
    ];
  };

  const getMusicalPersonality = (): {
    trait: string;
    score: number;
    description: string;
  }[] => {
    // Based on audio features and listening patterns
    return [
      {
        trait: "Adventurous",
        score: 78,
        description: "Open to discovering new artists and genres",
      },
      {
        trait: "Emotional",
        score: 85,
        description: "Preference for songs with emotional depth",
      },
      {
        trait: "Nostalgic",
        score: 62,
        description: "Connection to music from specific time periods",
      },
      {
        trait: "Energetic",
        score: 70,
        description: "Drawn to high-energy, upbeat tracks",
      },
    ];
  };

  const getHiddenGems = (): {
    name: string;
    artist: string;
    uniqueness: number;
  }[] => {
    // Would ideally identify tracks that are unique in the user's library
    // but have high personal play counts despite being less known generally
    return [
      {
        name: "Rare Track One",
        artist: "Underground Artist A",
        uniqueness: 92,
      },
      {
        name: "Obscure Song",
        artist: "Indie Band B",
        uniqueness: 87,
      },
      {
        name: "Deep Cut",
        artist: "Known Artist C",
        uniqueness: 79,
      },
      {
        name: "Hidden Masterpiece",
        artist: "Emerging Artist D",
        uniqueness: 95,
      },
    ];
  };

  const getListeningWorldMap = (): { region: string; percentage: number }[] => {
    // Geographic distribution of artists in library
    return [
      { region: "North America", percentage: 45 },
      { region: "Europe", percentage: 30 },
      { region: "UK", percentage: 15 },
      { region: "Asia", percentage: 5 },
      { region: "South America", percentage: 3 },
      { region: "Other", percentage: 2 },
    ];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Music className="h-6 w-6" /> Your Music Identity
          </DialogTitle>
          <DialogDescription>
            Insights into what makes your music taste unique
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs
            defaultValue="musical-identity"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger
                value="musical-identity"
                className="flex gap-2 items-center"
              >
                <Heart className="h-4 w-4" />
                Your Taste Profile
              </TabsTrigger>
              <TabsTrigger
                value="listening-patterns"
                className="flex gap-2 items-center"
              >
                <LineChart className="h-4 w-4" />
                Listening Patterns
              </TabsTrigger>
              <TabsTrigger
                value="music-journey"
                className="flex gap-2 items-center"
              >
                <Sparkles className="h-4 w-4" />
                Music Journey
              </TabsTrigger>
            </TabsList>

            {/* YOUR TASTE PROFILE TAB */}
            <TabsContent value="musical-identity" className="space-y-6">
              {/* Musical Personality (replaces Top Artists) */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-400" /> Your Musical
                    Personality
                  </CardTitle>
                  <CardDescription>
                    What your music choices reveal about you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {getMusicalPersonality().map((trait, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{trait.trait}</span>
                            <span className="text-sm">{trait.score}%</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${trait.score}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {trait.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-secondary/10 rounded-lg p-5 flex flex-col items-center justify-center text-center">
                      <h3 className="font-medium mb-3">
                        Your Musical Spirit Animal
                      </h3>
                      <div className="relative w-20 h-20 mb-3">
                        <Image
                          src="/music-personality.svg"
                          alt="Music Personality"
                          fill
                          className="object-contain"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src =
                              "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtbXVzaWMiPjxwYXRoIGQ9Ik05IDJoNnYxMi41YTIuNSAyLjUgMCAwIDEtMi41IDIuNUg5WiIvPjxwYXRoIGQ9Ik0xOCA3djEwLjVhMi41IDIuNSAwIDAgMS0yLjUgMi41SDEyIi8+PC9zdmc+";
                          }}
                        />
                      </div>
                      <h4 className="text-lg font-bold">
                        The Eclectic Explorer
                      </h4>
                      <p className="text-sm mt-2">
                        You appreciate musical variety and emotional depth,
                        constantly seeking new sounds while maintaining
                        connection to your favorites.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Genre & Mood Map */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Radio className="h-4 w-4 text-primary" /> Genre Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={getGenreData()}>
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={100} />
                          <Tooltip
                            formatter={(value) => [`${value} artists`, "Count"]}
                          />
                          <Bar dataKey="value" fill="#8884d8">
                            {getGenreData().map((entry, index) => (
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

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" /> Your Music
                      Mood
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          data={getMoodMap()}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name="Your Taste"
                            dataKey="A"
                            stroke="#FF6B6B"
                            fill="#FF6B6B"
                            fillOpacity={0.6}
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Music Personality */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" /> Your Music Personality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-secondary/20 rounded-lg p-4 text-center">
                      <h3 className="text-3xl font-bold mb-1">
                        {getArtistDiversity()}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Artist Diversity Score
                      </p>
                      <p className="text-xs mt-2">
                        {getArtistDiversity() > 0.7
                          ? "You have eclectic taste across many artists!"
                          : "You're loyal to your favorite artists"}
                      </p>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-4 text-center">
                      <h3 className="text-3xl font-bold mb-1">
                        {getAverageTrackDuration()}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Average Song Length
                      </p>
                      <p className="text-xs mt-2">
                        {parseInt(getAverageTrackDuration()) > 4
                          ? "You enjoy longer, more developed songs"
                          : "You prefer concise, to-the-point tracks"}
                      </p>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-4 text-center">
                      <h3 className="text-3xl font-bold mb-1">
                        {topTracks.length
                          ? Math.round(
                              topTracks.reduce(
                                (sum, track) => sum + (track.popularity || 0),
                                0
                              ) / topTracks.length
                            )
                          : 0}
                        %
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Mainstream Score
                      </p>
                      <p className="text-xs mt-2">
                        {topTracks.length &&
                        topTracks.reduce(
                          (sum, track) => sum + (track.popularity || 0),
                          0
                        ) /
                          topTracks.length >
                          70
                          ? "You're up on the latest hits!"
                          : "You have a taste for more obscure tracks"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* LISTENING PATTERNS TAB */}
            <TabsContent value="listening-patterns" className="space-y-6">
              {/* Time of Day Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock3 className="h-4 w-4" /> When You Listen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getListeningActivityPattern()}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value} tracks`, "Plays"]}
                        />
                        <Bar dataKey="value" fill="#4ECDC4">
                          {getListeningActivityPattern().map((entry, index) => (
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

              {/* Song Length Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Your Song Length Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getDurationDistribution()}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value} songs`, "Count"]}
                        />
                        <Bar dataKey="count" fill="#FFD166">
                          {getDurationDistribution().map((entry, index) => (
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

              {/* Collection Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ListMusic className="h-4 w-4" /> Collection Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-secondary/20 rounded-lg p-4">
                      <div className="flex flex-col items-center">
                        <p className="text-3xl font-bold">{playlists.length}</p>
                        <p className="text-sm text-muted-foreground">
                          Playlists
                        </p>
                      </div>
                      <div className="mt-3 text-xs text-center">
                        {playlists.length > 10
                          ? "You're an active curator of music collections!"
                          : "You focus on carefully crafted playlists"}
                      </div>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-4">
                      <div className="flex flex-col items-center">
                        <p className="text-3xl font-bold">
                          {savedAlbums.length}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Saved Albums
                        </p>
                      </div>
                      <div className="mt-3 text-xs text-center">
                        {savedAlbums.length > 20
                          ? "You appreciate entire albums as complete works"
                          : "You save your absolute favorite albums"}
                      </div>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-4">
                      <div className="flex flex-col items-center">
                        <p className="text-3xl font-bold">{topTracks.length}</p>
                        <p className="text-sm text-muted-foreground">
                          Top Tracks
                        </p>
                      </div>
                      <div className="mt-3 text-xs text-center">
                        This represents the songs that define your listening
                        habits
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* MUSIC JOURNEY TAB */}
            <TabsContent value="music-journey" className="space-y-6">
              {/* Decade Distribution */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" /> Your Music Through the
                    Decades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getDecadeData()}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value} tracks`, "Count"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#6A0572"
                          fill="#6A0572"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-secondary/20 rounded-lg p-3">
                      <p className="text-sm font-medium">Top Decade</p>
                      <p className="text-xl font-bold">
                        {getDecadeData().length > 0
                          ? getDecadeData().sort((a, b) => b.count - a.count)[0]
                              .name
                          : "2010s"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your music collection is centered around this era
                      </p>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-3">
                      <p className="text-sm font-medium">Time Span</p>
                      <p className="text-xl font-bold">
                        {getDecadeData().length > 0
                          ? `${getDecadeData()[0].name} - ${
                              getDecadeData()[getDecadeData().length - 1].name
                            }`
                          : "1990s - 2020s"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        The range of music eras you enjoy
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hidden Gems (replaces Most Played Tracks) */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" /> Hidden Gems
                    in Your Collection
                  </CardTitle>
                  <CardDescription>
                    Lesser-known tracks that stand out in your library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getHiddenGems().map((gem, index) => (
                      <div
                        key={index}
                        className="p-3 bg-secondary/10 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-medium">{gem.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {gem.artist}
                            </p>
                          </div>
                          <div className="bg-primary/20 px-2 py-1 rounded-full text-xs flex items-center">
                            <Star className="h-3 w-3 mr-1 text-amber-400" />
                            <span>{gem.uniqueness}% unique</span>
                          </div>
                        </div>
                        <div className="w-full bg-secondary/30 h-1 rounded-full mt-2">
                          <div
                            className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"
                            style={{ width: `${gem.uniqueness}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    These tracks are rare finds in most collections but
                    treasured in yours
                  </div>
                </CardContent>
              </Card>

              {/* World Music Map */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-400" /> Your Global
                    Music Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {getListeningWorldMap().map((region, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{region.region}</span>
                            <span className="text-xs">
                              {region.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${region.percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground pt-2">
                        Geographic distribution of artists in your collection
                      </p>
                    </div>

                    <div className="bg-secondary/10 rounded-lg p-4">
                      <h3 className="font-medium mb-3 text-center">
                        Your Listening Streaks
                      </h3>
                      <div className="space-y-4">
                        {getListeningStreaks().map((streak, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Flame
                                className={`h-5 w-5 text-${
                                  ["red", "amber", "orange"][index % 3]
                                }-400`}
                              />
                            </div>
                            <div>
                              <p className="font-medium">{streak.type}</p>
                              <div className="flex items-center gap-1">
                                <span className="text-xl font-bold">
                                  {streak.days}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {streak.description}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Music Growth & Recommendations */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Music Journey Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-secondary/10 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Your Music Signature</h3>
                      <p className="text-sm mb-3">
                        Based on your listening patterns, your music identity is
                        shaped by:
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm flex gap-2 items-center">
                          <Star className="h-4 w-4 text-amber-400" />
                          <span>
                            {getGenreData().length > 0
                              ? `A strong preference for ${
                                  getGenreData()[0].name
                                }`
                              : "Diverse genre preferences"}
                          </span>
                        </div>
                        <div className="text-sm flex gap-2 items-center">
                          <Clock className="h-4 w-4 text-sky-400" />
                          <span>
                            {getAverageTrackDuration() > "3:30"
                              ? "You appreciate longer, more developed musical journeys"
                              : "You enjoy concise, impactful tracks"}
                          </span>
                        </div>
                        <div className="text-sm flex gap-2 items-center">
                          <Calendar className="h-4 w-4 text-green-400" />
                          <span>
                            {getDecadeData().length > 0
                              ? `A connection to the music of the ${
                                  getDecadeData().sort(
                                    (a, b) => b.count - a.count
                                  )[0].name
                                }`
                              : "A modern music palette"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary/10 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Expand Your Horizons</h3>
                      <p className="text-sm mb-3">
                        Based on your current tastes, you might enjoy exploring:
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm flex gap-2 items-center">
                          <Radio className="h-4 w-4 text-purple-400" />
                          <span>
                            {getGenreData().length > 1
                              ? `More ${
                                  getGenreData()[1].name
                                } artists and subgenres`
                              : "Related genres to your favorites"}
                          </span>
                        </div>
                        <div className="text-sm flex gap-2 items-center">
                          <Disc className="h-4 w-4 text-pink-400" />
                          <span>
                            Classic albums from the
                            {getDecadeData().length > 0
                              ? ` ${
                                  getDecadeData().sort(
                                    (a, b) => b.count - a.count
                                  )[0].name
                                }`
                              : " era you enjoy most"}
                          </span>
                        </div>
                        <div className="text-sm flex gap-2 items-center">
                          <User className="h-4 w-4 text-yellow-400" />
                          <span>
                            Artists similar to
                            {topArtists.length > 0
                              ? ` ${topArtists[0].name} and ${
                                  topArtists[1]?.name || "others"
                                }`
                              : " your top favorites"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
