import { MusicItem } from "@/utils/spotifyApi";

// This is where you can manually add your favorite music items
// Each item should have a Spotify URL, type, rating (0-10), and optional review
export const favoriteMusic: MusicItem[] = [
  {
    spotifyUrl: "https://open.spotify.com/track/2JzZzZUQj3Qff7wapcbKjc",
    type: "track",
    rating: 9.5,
    review: "A perfect blend of The Weeknd's vocals and Daft Punk's production",
  },
  // Add more items here...
];
