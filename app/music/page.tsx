import Image from "next/image"
import { ExternalLink, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MusicPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Music Collection</h1>
        <p className="text-muted-foreground mb-8">
          Music has always been a significant part of my life. Here's a collection of my favorite artists, albums, and
          songs that have shaped my musical journey.
        </p>

        {/* Favorite Artists Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">My Favorite Artists of All Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topArtists.map((artist, index) => (
              <TopArtistCard key={index} artist={artist} />
            ))}
          </div>
        </section>

        {/* Favorite Songs Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">My Favorite Songs of All Time</h2>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Tracks Playlist</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://open.spotify.com/playlist/yourusername/toptracks"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in Spotify
                  </a>
                </Button>
              </div>
              <CardDescription>My all-time favorite songs in one playlist</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topSongs.map((song, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted transition-colors">
                    <div className="text-muted-foreground w-6 text-center">{index + 1}</div>
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={song.coverUrl || "/placeholder.svg"}
                        alt={song.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-sm">{song.title}</h3>
                      <p className="text-xs text-muted-foreground">{song.artist}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Play className="h-4 w-4" />
                      <span className="sr-only">Play</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="playlists" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="playlists">My Playlists</TabsTrigger>
            <TabsTrigger value="artists">All Artists</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
          </TabsList>

          <TabsContent value="playlists" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist, index) => (
                <PlaylistCard key={index} playlist={playlist} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artists" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.map((artist, index) => (
                <ArtistCard key={index} artist={artist} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="albums" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, index) => (
                <AlbumCard key={index} album={album} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function TopArtistCard({ artist }: { artist: (typeof topArtists)[0] }) {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-40 w-full">
        <Image src={artist.imageUrl || "/placeholder.svg"} alt={artist.name} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{artist.name}</CardTitle>
        <CardDescription>{artist.genre}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{artist.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Spotify
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ArtistCard({ artist }: { artist: (typeof artists)[0] }) {
  return (
    <Card>
      <div className="relative h-40 w-full">
        <Image
          src={artist.imageUrl || "/placeholder.svg"}
          alt={artist.name}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <CardHeader>
        <CardTitle>{artist.name}</CardTitle>
        <CardDescription>{artist.genre}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" size="sm" asChild>
          <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Spotify
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function AlbumCard({ album }: { album: (typeof albums)[0] }) {
  return (
    <Card>
      <div className="relative h-40 w-full">
        <Image
          src={album.coverUrl || "/placeholder.svg"}
          alt={album.title}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <CardHeader>
        <CardTitle>{album.title}</CardTitle>
        <CardDescription>
          {album.artist} • {album.year}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{album.genre}</p>
      </CardContent>
    </Card>
  )
}

function PlaylistCard({ playlist }: { playlist: (typeof playlists)[0] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
            <Image src={playlist.coverUrl || "/placeholder.svg"} alt={playlist.name} fill className="object-cover" />
          </div>
          <div>
            <CardTitle>{playlist.name}</CardTitle>
            <CardDescription>
              {playlist.trackCount} tracks • {playlist.duration}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{playlist.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={playlist.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in Spotify
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Sample data
const topArtists = [
  {
    name: "Queen",
    genre: "Rock",
    description: "The legendary British rock band known for their theatrical style and incredible vocal harmonies.",
    imageUrl: "/placeholder.svg?height=160&width=320",
    spotifyUrl: "https://open.spotify.com/artist/1dfeR4HaWDbWqFHLkxsg1d",
  },
  {
    name: "Pink Floyd",
    genre: "Progressive Rock",
    description: "Pioneers of psychedelic and progressive rock known for concept albums and philosophical lyrics.",
    imageUrl: "/placeholder.svg?height=160&width=320",
    spotifyUrl: "https://open.spotify.com/artist/0k17h0D3J5VfsdmQ1iZtE9",
  },
  {
    name: "The Beatles",
    genre: "Rock",
    description: "The most influential band of all time who revolutionized popular music in the 1960s.",
    imageUrl: "/placeholder.svg?height=160&width=320",
    spotifyUrl: "https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2",
  },
  {
    name: "Radiohead",
    genre: "Alternative Rock",
    description: "Experimental rock band known for their innovative sound and evolving musical style.",
    imageUrl: "/placeholder.svg?height=160&width=320",
    spotifyUrl: "https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb",
  },
]

const topSongs = [
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    coverUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    title: "Wish You Were Here",
    artist: "Pink Floyd",
    album: "Wish You Were Here",
    coverUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    title: "Let It Be",
    artist: "The Beatles",
    album: "Let It Be",
    coverUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    title: "Paranoid Android",
    artist: "Radiohead",
    album: "OK Computer",
    coverUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    coverUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    coverUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller",
    coverUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    album: "Nevermind",
    coverUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    coverUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    title: "Like a Rolling Stone",
    artist: "Bob Dylan",
    album: "Highway 61 Revisited",
    coverUrl: "/placeholder.svg?height=40&width=40",
  },
]

const artists = [
  {
    name: "Queen",
    genre: "Rock",
    imageUrl: "/placeholder.svg?height=160&width=320",
    spotifyUrl: "https://open.spotify.com/artist/1dfeR4HaWDbWqFHLkxsg1d",
  },
  {
    name: "Pink Floyd",
    genre: "Progressive Rock",
    imageUrl: "/placeholder.svg?height=160&width=320",
    spotifyUrl: "https://open.spotify.com/artist/0k17h0D3J5VfsdmQ1iZtE9",
  },
  {
    name: "The Beatles",
    genre: "Rock",
    imageUrl: "/placeholder.svg?height=160&width=320",
    spotifyUrl: "https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2",
  },
  {
    name: "Radiohead",
    genre: "Alternative Rock",
    imageUrl: "/placeholder.svg?height=160&width=320",
    spotifyUrl: "https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb",
  },
  {
    name: "Led Zeppelin",
    genre: "Hard Rock",
    imageUrl: "/placeholder.svg?height=160&width=320",
    spotifyUrl: "https://open.spotify.com/artist/36QJpDe2go2KgaRleHCDTp",
  },
  {
    name: "David Bowie",
    genre: "Rock",
    imageUrl: "/placeholder.svg?height=160&width=320",
    spotifyUrl: "https://open.spotify.com/artist/0oSGxfWSnnOXhD2fKuz2Gy",
  },
]

const albums = [
  {
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    year: 1973,
    genre: "Progressive Rock",
    coverUrl: "/placeholder.svg?height=160&width=320",
  },
  {
    title: "Abbey Road",
    artist: "The Beatles",
    year: 1969,
    genre: "Rock",
    coverUrl: "/placeholder.svg?height=160&width=320",
  },
  {
    title: "Thriller",
    artist: "Michael Jackson",
    year: 1982,
    genre: "Pop",
    coverUrl: "/placeholder.svg?height=160&width=320",
  },
  {
    title: "OK Computer",
    artist: "Radiohead",
    year: 1997,
    genre: "Alternative Rock",
    coverUrl: "/placeholder.svg?height=160&width=320",
  },
  {
    title: "A Night at the Opera",
    artist: "Queen",
    year: 1975,
    genre: "Rock",
    coverUrl: "/placeholder.svg?height=160&width=320",
  },
  {
    title: "Led Zeppelin IV",
    artist: "Led Zeppelin",
    year: 1971,
    genre: "Hard Rock",
    coverUrl: "/placeholder.svg?height=160&width=320",
  },
]

const playlists = [
  {
    name: "Coding Focus",
    trackCount: 42,
    duration: "3h 12m",
    description: "Instrumental tracks that help me focus while coding.",
    coverUrl: "/placeholder.svg?height=64&width=64",
    url: "https://open.spotify.com/playlist/yourusername/coding",
  },
  {
    name: "Workout Mix",
    trackCount: 28,
    duration: "1h 45m",
    description: "High-energy tracks for workout sessions.",
    coverUrl: "/placeholder.svg?height=64&width=64",
    url: "https://open.spotify.com/playlist/yourusername/workout",
  },
  {
    name: "Chill Evening",
    trackCount: 35,
    duration: "2h 30m",
    description: "Relaxing tracks for unwinding in the evening.",
    coverUrl: "/placeholder.svg?height=64&width=64",
    url: "https://open.spotify.com/playlist/yourusername/chill",
  },
  {
    name: "Road Trip Classics",
    trackCount: 50,
    duration: "3h 45m",
    description: "Classic hits perfect for long drives.",
    coverUrl: "/placeholder.svg?height=64&width=64",
    url: "https://open.spotify.com/playlist/yourusername/roadtrip",
  },
  {
    name: "90s Nostalgia",
    trackCount: 45,
    duration: "2h 55m",
    description: "The best hits from the 1990s that bring back memories.",
    coverUrl: "/placeholder.svg?height=64&width=64",
    url: "https://open.spotify.com/playlist/yourusername/90s",
  },
  {
    name: "Acoustic Covers",
    trackCount: 32,
    duration: "2h 10m",
    description: "Beautiful acoustic versions of popular songs.",
    coverUrl: "/placeholder.svg?height=64&width=64",
    url: "https://open.spotify.com/playlist/yourusername/acoustic",
  },
]
