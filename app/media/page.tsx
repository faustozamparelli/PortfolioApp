"use client";

import Image from "next/image";
import { Star, StarHalf, ExternalLink, Filter, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { getMovieDetailsFromImdbUrl } from "@/utils/movieApi";
import { getTVDetailsFromImdbUrl } from "@/utils/tvApi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MovieReviewModal } from "@/components/movie-review-modal";
import { TVReviewModal } from "@/components/tv-review-modal";

interface Movie {
  imdbUrl: string;
  rating: number; // Required field, 0-10 with one decimal
  review?: string;
  isTopMovie?: boolean;
  // These fields are populated by the API
  title?: string;
  director?: string;
  year?: number | null;
  overview?: string;
  genres?: string[];
  posterUrl?: string;
}

interface TVShow {
  imdbUrl: string;
  rating: number; // Required field, 0-10 with one decimal
  review?: string;
  isTopShow?: boolean;
  // These fields are populated by the API
  title?: string;
  creator?: string;
  firstAirYear?: number | null;
  overview?: string;
  genres?: string[];
  posterUrl?: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
}

// Import your existing movies and topMovies arrays here
const topMovies: Movie[] = [
  {
    // Demolition
    imdbUrl: "https://www.imdb.com/title/tt1172049/",
    rating: 11,
    review:
      "The most UNDERRATED movie OF ALL TIME. I fully relate to the main character; the acting is pure perfection, and the soundtrack features some obscure songs that perfectly match the vibe. What more could you ask for? Jake Gyllenhaal, I love you. Please watch this masterpiece in English and enjoy every second of it. It is a display of human emotions like no other. In chaos and irrationality, it discovers its beauty. It's weird that I do not have a clear reason why I love it so much. I think it is because of how it shaped me to be more impulsive and to fully embrace what I am feeling, no matter how strange it may seem. It makes you appreciate every bit of life, and live in the moment.",
    isTopMovie: true,
  },
  {
    // Forrest Gump
    imdbUrl: "https://www.imdb.com/title/tt0109830/",
    rating: 11,
    review:
      "Truly perfection, a timeless masterpiece. I watched it for the first time when I was a child, and it shaped a part of me. Every time I watch it, it gets better and better. This movie has everything. I truly believe no film will ever be as complete as this one. It has action, history, romance, comedy, and drama all in one, with a powerful message and a beautiful soundtrack behind it. It is rare for a movie to make you better, but I fully believe this one does. Everyone should watch it; its meaning is much deeper and more real than it may seem. I live by it and always will.",
    isTopMovie: true,
  },
  {
    // The Social Network
    imdbUrl: "https://www.imdb.com/title/tt1285016/",
    rating: 11.0,
    review: `My comfort movie, watched it like 10 times. The BEST biopic ever made. Realistic events and details, a fire soundtrack, great acting, 2000s aesthetic... Couldn't have been executed better. Watch it (in English), I guarantee you 2 hours will feel like 2 minutes. Afterwards, read this too since you are at it: <a href="https://faustozamparelliblog.vercel.app/post/depressing/" target="_blank" rel="noopener noreferrer">Depressing</a>.`,
    isTopMovie: true,
  },
  {
    // Interstellar
    imdbUrl: "https://www.imdb.com/title/tt0816692/",
    rating: 10.8,
    review:
      "The best sci-fi movie of all time. A perfect blend between real science and fiction. There are literal books explaining the physics of the movie. Don't get me started on the soundtrack, the visuals, and how well emotions are built up throughout the story. It's a masterpiece. For this movie, I believe that the first watch is where it will either make it or break it. The other top movies in this list could be seen multiple times, but I believe that for this one you NEED to enjoy the first watch. Do not stop — finish it, trust me, it won't disappoint. I watched it with no expectations years ago, and it has left a permanent mark on me. Afterwards, it's really recommended to learn about all the small details and the science behind it.",
    isTopMovie: true,
  },
  {
    // Nightcrawler
    imdbUrl: "https://www.imdb.com/title/tt2872718/",
    rating: 10.5,
    review:
      "Jake Gyllenhaal once again delivers. One of the best portrayals of a psychopath ever made. It is subtle, but as you keep watching, it becomes more and more clear. Pure obsession and dedication to work. It shows you that to reach the top, you often need to sacrifice everything, even your moral values. It also shows that the world is unfair and harsh, and that often the bad guys win, just like in nature. Causing harm is much easier than doing good. It is your choice which side you choose to stand on.",
    isTopMovie: true,
  },
  {
    // La La Land
    imdbUrl: "https://www.imdb.com/title/tt3783958/",
    rating: 10.3,
    review:
      "I had zero expectations for this one. I usually hate musicals and romance, so this was the perfect mix to make me leave a bad review. I was shocked by how well this is done. It is a realistic romantic story, and it is not for the weak. There are so many subtle details. The music and the colors will make you fall in love with this masterpiece. I have to give it a 10 because it objectively could not have been made better in any way.",
    isTopMovie: true,
  },
];

const movies: Movie[] = [
  {
    // The Karate Kid
    imdbUrl: "https://www.imdb.com/title/tt0087538/",
    rating: 0,
    review: "",
  },
  {
    // The Karate Kid Part II
    imdbUrl: "https://www.imdb.com/title/tt0091326/",
    rating: 0,
    review: "",
  },
  {
    // The Karate Kid Part III
    imdbUrl: "https://www.imdb.com/title/tt0097647/",
    rating: 0,
    review: "",
  },
  {
    // Air Bud
    imdbUrl: "https://www.imdb.com/title/tt0118570/",
    rating: 0,
    review: "",
  },
  {
    // Air Buddies
    imdbUrl: "https://www.imdb.com/title/tt0470982/",
    rating: 0,
    review: "",
  },
  {
    // Spy Kids
    imdbUrl: "https://www.imdb.com/title/tt0227538/",
    rating: 0,
    review: "",
  },
  {
    // Spy Kids 2
    imdbUrl: "https://www.imdb.com/title/tt0287717/",
    rating: 0,
    review: "",
  },
  {
    // Spy Kids 3
    imdbUrl: "https://www.imdb.com/title/tt0338459/",
    rating: 0,
    review: "",
  },
  {
    // Sky High
    imdbUrl: "https://www.imdb.com/title/tt0405325/",
    rating: 0,
    review: "",
  },
  {
    // Lucky and Zorba
    imdbUrl: "https://www.imdb.com/title/tt0122735/",
    rating: 0,
    review: "",
  },
  {
    // One Hundred and One Dalmatians
    imdbUrl: "https://www.imdb.com/title/tt0055254/",
    rating: 0,
    review: "",
  },
  {
    // Lady and the Tramp
    imdbUrl: "https://www.imdb.com/title/tt0048280/",
    rating: 0,
    review: "",
  },
  {
    // Balto
    imdbUrl: "https://www.imdb.com/title/tt0112453/",
    rating: 0,
    review: "",
  },
  {
    // Snow White and the Seven Dwarfs
    imdbUrl: "https://www.imdb.com/title/tt0029583/",
    rating: 0,
    review: "",
  },
  {
    // Cinderella
    imdbUrl: "https://www.imdb.com/title/tt0042332/",
    rating: 0,
    review: "",
  },
  {
    // Sleeping Beauty
    imdbUrl: "https://www.imdb.com/title/tt0053285/",
    rating: 0,
    review: "",
  },
  {
    // Alice in Wonderland
    imdbUrl: "https://www.imdb.com/title/tt1014759/",
    rating: 0,
    review: "",
  },
  {
    // Pinocchio
    imdbUrl: "https://www.imdb.com/title/tt0032910/",
    rating: 0,
    review: "",
  },
  {
    // Dumbo
    imdbUrl: "https://www.imdb.com/title/tt0033563/",
    rating: 0,
    review: "",
  },
  {
    // Bambi
    imdbUrl: "https://www.imdb.com/title/tt0034492/",
    rating: 0,
    review: "",
  },
  {
    // Peter Pan
    imdbUrl: "https://www.imdb.com/title/tt0046183/",
    rating: 0,
    review: "",
  },
  {
    // The Jungle Book
    imdbUrl: "https://www.imdb.com/title/tt0061852/",
    rating: 0,
    review: "",
  },
  {
    // Robin Hood
    imdbUrl: "https://www.imdb.com/title/tt0070608/",
    rating: 0,
    review: "",
  },
  {
    // The Fox and the Hound
    imdbUrl: "https://www.imdb.com/title/tt0082406/",
    rating: 0,
    review: "",
  },
  {
    // The Rescuers Down Under
    imdbUrl: "https://www.imdb.com/title/tt0100477/",
    rating: 0,
    review: "",
  },
  {
    // The Lion King
    imdbUrl: "https://www.imdb.com/title/tt0110357/",
    rating: 0,
    review: "",
  },
  {
    // Toy Story
    imdbUrl: "https://www.imdb.com/title/tt0114709/",
    rating: 0,
    review: "",
  },
  {
    // Finding Nemo
    imdbUrl: "https://www.imdb.com/title/tt0266543/",
    rating: 0,
    review: "",
  },
  {
    // Toy Story 2
    imdbUrl: "https://www.imdb.com/title/tt0120363/",
    rating: 0,
    review: "",
  },
  {
    // A Bug's Life
    imdbUrl: "https://www.imdb.com/title/tt0120623/",
    rating: 0,
    review: "",
  },
  {
    // Dinosaur
    imdbUrl: "https://www.imdb.com/title/tt0130623/",
    rating: 0,
    review: "",
  },
  {
    // Monsters, Inc.
    imdbUrl: "https://www.imdb.com/title/tt0198781/",
    rating: 0,
    review: "",
  },
  {
    // The Incredibles
    imdbUrl: "https://www.imdb.com/title/tt0317705/",
    rating: 0,
    review: "",
  },
  {
    // Chicken Little
    imdbUrl: "https://www.imdb.com/title/tt0371606/",
    rating: 0,
    review: "",
  },
  {
    // Cars
    imdbUrl: "https://www.imdb.com/title/tt0317219/",
    rating: 0,
    review: "",
  },
  {
    // Ratatouille
    imdbUrl: "https://www.imdb.com/title/tt0382932/",
    rating: 0,
    review: "",
  },
  {
    // WALL·E
    imdbUrl: "https://www.imdb.com/title/tt0910970/",
    rating: 0,
    review: "",
  },
  {
    // Up
    imdbUrl: "https://www.imdb.com/title/tt1049413/",
    rating: 0,
    review: "",
  },
  {
    // Toy Story 3
    imdbUrl: "https://www.imdb.com/title/tt0435761/",
    rating: 0,
    review: "",
  },
  {
    // Cars 2
    imdbUrl: "https://www.imdb.com/title/tt1216475/",
    rating: 0,
    review: "",
  },
  {
    // Wreck-It Ralph
    imdbUrl: "https://www.imdb.com/title/tt1772341/",
    rating: 0,
    review: "",
  },
  {
    // Frozen
    imdbUrl: "https://www.imdb.com/title/tt2294629/",
    rating: 0,
    review: "",
  },
  {
    // Big Hero 6
    imdbUrl: "https://www.imdb.com/title/tt2245084/",
    rating: 0,
    review: "",
  },
  {
    // Inside Out
    imdbUrl: "https://www.imdb.com/title/tt2096673/",
    rating: 0,
    review: "",
  },
  {
    // The Good Dinosaur
    imdbUrl: "https://www.imdb.com/title/tt1979388/",
    rating: 0,
    review: "",
  },
  {
    // Zootopia
    imdbUrl: "https://www.imdb.com/title/tt2948356/",
    rating: 0,
    review: "",
  },
  {
    // Finding Dory
    imdbUrl: "https://www.imdb.com/title/tt2277860/",
    rating: 0,
    review: "",
  },
  {
    // Cars 3
    imdbUrl: "https://www.imdb.com/title/tt3606752/",
    rating: 0,
    review: "",
  },
  {
    // Coco
    imdbUrl: "https://www.imdb.com/title/tt2380307/",
    rating: 0,
    review: "",
  },
  {
    // Tarzan
    imdbUrl: "https://www.imdb.com/title/tt0120855/",
    rating: 0,
    review: "",
  },
  {
    // Incredibles 2
    imdbUrl: "https://www.imdb.com/title/tt3606756/",
    rating: 0,
    review: "",
  },
  {
    // Toy Story 4
    imdbUrl: "https://www.imdb.com/title/tt1979376/",
    rating: 0,
    review: "",
  },
  {
    // Rocky
    imdbUrl: "https://www.imdb.com/title/tt0075148/",
    rating: 0,
    review: "",
  },
  {
    // Rocky II
    imdbUrl: "https://www.imdb.com/title/tt0079817/",
    rating: 0,
    review: "",
  },
  {
    // Rocky III
    imdbUrl: "https://www.imdb.com/title/tt0084602/",
    rating: 0,
    review: "",
  },
  {
    // Rocky IV
    imdbUrl: "https://www.imdb.com/title/tt0089927/",
    rating: 0,
    review: "",
  },
  {
    // Rocky V
    imdbUrl: "https://www.imdb.com/title/tt0100507/",
    rating: 0,
    review: "",
  },
  {
    // First Blood
    imdbUrl: "https://www.imdb.com/title/tt0083944/",
    rating: 0,
    review: "",
  },
  {
    // Rambo: First Blood Part II
    imdbUrl: "https://www.imdb.com/title/tt0089880/",
    rating: 0,
    review: "",
  },
  {
    // Rambo III
    imdbUrl: "https://www.imdb.com/title/tt0095956/",
    rating: 0,
    review: "",
  },
  {
    // Rambo
    imdbUrl: "https://www.imdb.com/title/tt0462499/",
    rating: 0,
    review: "",
  },
  {
    // Superman
    imdbUrl: "https://www.imdb.com/title/tt0078346/",
    rating: 0,
    review: "",
  },
  {
    // Spider-Man
    imdbUrl: "https://www.imdb.com/title/tt0145487/",
    rating: 0,
    review: "",
  },
  {
    // Spider-Man 2
    imdbUrl: "https://www.imdb.com/title/tt0316654/",
    rating: 0,
    review: "",
  },
  {
    // Spider-Man 3
    imdbUrl: "https://www.imdb.com/title/tt0413300/",
    rating: 0,
    review: "",
  },
  {
    // The Amazing Spider-Man
    imdbUrl: "https://www.imdb.com/title/tt0948470/",
    rating: 0,
    review: "",
  },
  {
    // The Amazing Spider-Man 2
    imdbUrl: "https://www.imdb.com/title/tt1872181/",
    rating: 0,
    review: "",
  },
  {
    // Spider-Man: Homecoming
    imdbUrl: "https://www.imdb.com/title/tt2250912/",
    rating: 0,
    review: "",
  },
  {
    // Spider-Man: Into the Spider-Verse
    imdbUrl: "https://www.imdb.com/title/tt4633694/",
    rating: 0,
    review: "",
  },
  {
    // Spider-Man: Far from Home
    imdbUrl: "https://www.imdb.com/title/tt6320628/",
    rating: 0,
    review: "",
  },
  {
    // Spider-Man: No Way Home
    imdbUrl: "https://www.imdb.com/title/tt10872600/",
    rating: 0,
    review: "",
  },
  {
    // Mr. Magorium's Wonder Emporium
    imdbUrl: "https://www.imdb.com/title/tt0457419/",
    rating: 0,
    review: "",
  },
  {
    // The Karate Kid (2010)
    imdbUrl: "https://www.imdb.com/title/tt1155076/",
    rating: 0,
    review: "",
  },
  {
    // Marmaduke
    imdbUrl: "https://www.imdb.com/title/tt1392197/",
    rating: 0,
    review: "",
  },
  {
    // Beethoven
    imdbUrl: "https://www.imdb.com/title/tt0103786/",
    rating: 0,
    review: "",
  },
  {
    // Marley & Me
    imdbUrl: "https://www.imdb.com/title/tt0822832/",
    rating: 0,
    review: "",
  },
  {
    // Cheaper by the Dozen
    imdbUrl: "https://www.imdb.com/title/tt0349205/",
    rating: 0,
    review: "",
  },
  {
    // Cheaper by the Dozen 2
    imdbUrl: "https://www.imdb.com/title/tt0452598/",
    rating: 0,
    review: "",
  },
  {
    // Fantozzi
    imdbUrl: "https://www.imdb.com/title/tt0071486/",
    rating: 0,
    review: "",
  },
  {
    // Fantozzi 2
    imdbUrl: "https://www.imdb.com/title/tt0075178/",
    rating: 0,
    review: "",
  },
  {
    // Fantozzi contro tutti
    imdbUrl: "https://www.imdb.com/title/tt0080719/",
    rating: 0,
    review: "",
  },
  {
    // Fantozzi subisce ancora
    imdbUrl: "https://www.imdb.com/title/tt0085524/",
    rating: 0,
    review: "",
  },
  {
    // Super Fantozzi
    imdbUrl: "https://www.imdb.com/title/tt0090101/",
    rating: 0,
    review: "",
  },
  {
    // Fantozzi Retires
    imdbUrl: "https://www.imdb.com/title/tt0095134/",
    rating: 0,
    review: "",
  },
  {
    // Fantozzi alla riscossa
    imdbUrl: "https://www.imdb.com/title/tt0099545/",
    rating: 0,
    review: "",
  },
  {
    // Fantozzi in Heaven
    imdbUrl: "https://www.imdb.com/title/tt0106867/",
    rating: 0,
    review: "",
  },
  {
    // Home Alone
    imdbUrl: "https://www.imdb.com/title/tt0099785/",
    rating: 0,
    review: "",
  },
  {
    // Home Alone 2: Lost in New York
    imdbUrl: "https://www.imdb.com/title/tt0104431/",
    rating: 0,
    review: "",
  },
  {
    // Ghostbusters
    imdbUrl: "https://www.imdb.com/title/tt0087332/",
    rating: 0,
    review: "",
  },
  {
    // Christopher Robin
    imdbUrl: "https://www.imdb.com/title/tt4575576/",
    rating: 0,
    review: "",
  },
  {
    // Paddington
    imdbUrl: "https://www.imdb.com/title/tt1109624/",
    rating: 0,
    review: "",
  },
  {
    // Paddington 2
    imdbUrl: "https://www.imdb.com/title/tt4468740/",
    rating: 0,
    review: "",
  },
  {
    // The Best Offer
    imdbUrl: "https://www.imdb.com/title/tt1924396/",
    rating: 0,
    review: "",
  },
  {
    // The Mask
    imdbUrl: "https://www.imdb.com/title/tt0110475/",
    rating: 0,
    review: "",
  },
  {
    // Bruce Almighty
    imdbUrl: "https://www.imdb.com/title/tt0315327/",
    rating: 0,
    review: "",
  },
  {
    // Yes Man
    imdbUrl: "https://www.imdb.com/title/tt1068680/",
    rating: 0,
    review: "",
  },
  {
    // Mr. Bean's Holiday
    imdbUrl: "https://www.imdb.com/title/tt0453451/",
    rating: 0,
    review: "",
  },
  {
    // Johnny English
    imdbUrl: "https://www.imdb.com/title/tt0274166/",
    rating: 0,
    review: "",
  },
  {
    // The Truman Show
    imdbUrl: "https://www.imdb.com/title/tt0120382/",
    rating: 0,
    review: "",
  },
  {
    // Paul Blart: Mall Cop
    imdbUrl: "https://www.imdb.com/title/tt1114740/",
    rating: 0,
    review: "",
  },
  {
    // Paul Blart: Mall Cop 2
    imdbUrl: "https://www.imdb.com/title/tt3450650/",
    rating: 0,
    review: "",
  },
  {
    // Flypaper
    imdbUrl: "https://www.imdb.com/title/tt1541160/",
    rating: 0,
    review: "",
  },
  {
    // Cado dalle nubi
    imdbUrl: "https://www.imdb.com/title/tt1526741/",
    rating: 0,
    review: "",
  },
  {
    // What a Beautiful Day
    imdbUrl: "https://www.imdb.com/title/tt1808015/",
    rating: 0,
    review: "",
  },
  {
    // Sole a catinelle
    imdbUrl: "https://www.imdb.com/title/tt3066270/",
    rating: 0,
    review: "",
  },
  {
    // Quo vado?
    imdbUrl: "https://www.imdb.com/title/tt5290524/",
    rating: 0,
    review: "",
  },
  {
    // Inside Man
    imdbUrl: "https://www.imdb.com/title/tt0454848/",
    rating: 0,
    review: "",
  },
  {
    // No Country for Old Men
    imdbUrl: "https://www.imdb.com/title/tt0477348/",
    rating: 10.5,
    review:
      "Not much I have personally learned from this movie, but it is perfect. It is hard even to describe. The best sociopath ever portrayed in a movie. It has no soundtrack, which should make the movie lose some points, but instead it makes it ten times better. It makes you feel like it is real life, but at the same time it feels so unreal because of its plot. I guarantee you that once you finish it, you will feel like you are inside the movie. There are so many small details that make it sooooo much batter too. The dialogues, the way the script is written and the acting are pure perfection.",
  },
  {
    // Uncut Gems
    imdbUrl: "https://www.imdb.com/it/title/tt5727208/",
    rating: 10.5,
    review:
      "The New York accent, Adam Sandler as the protagonist, and the anxiety-inducing plot that keeps you on the edge of your seat the whole time makes this movie a masterpiece. Uncut Gems shows the true hustler mentality (offering a much more realistic version of The Wolf of Wall Street) and reveals the lengths people are willing to go to achieve their own goals. It proves that true obsession can arise from anything, go all in (literally) in whatever you believe in.",
  },
];

// Add your TV shows data here
// Top shows
const topShows: TVShow[] = [
  {
    // Death Note
    imdbUrl: "https://www.imdb.com/title/tt0877057/",
    rating: 11,
    review: "",
    isTopShow: true,
  },
  {
    // Sherlock
    imdbUrl: "https://www.imdb.com/title/tt1475582/",
    rating: 10.5,
    review: "",
    isTopShow: true,
  },
  {
    // The Office
    imdbUrl: "https://www.imdb.com/title/tt0386676/",
    rating: 10,
    review: "",
    isTopShow: true,
  },
  {
    // Big Little Lies
    imdbUrl: "https://www.imdb.com/title/tt3920596/",
    rating: 10,
    review: "",
    isTopShow: true,
  },
  {
    // Silicon Valley
    imdbUrl: "https://www.imdb.com/title/tt2575988/",
    rating: 9.8,
    review: "",
    isTopShow: true,
  },
  {
    // Mr Robot
    imdbUrl: "https://www.imdb.com/title/tt4158110/",
    rating: 9,
    review: "",
    isTopShow: true,
  },
];

// All shows
const shows: TVShow[] = [
  {
    // Stranger Things
    imdbUrl: "https://www.imdb.com/title/tt4574334/",
    rating: 7.5,
    review: "",
  },
  {
    // Sex Education
    imdbUrl: "https://www.imdb.com/title/tt7767422/",
    rating: 5,
    review: "",
  },
  {
    // Hunter x Hunter
    imdbUrl: "https://www.imdb.com/title/tt2098220/",
    rating: 7.8,
    review: "",
  },
  {
    // Attack On Titan
    imdbUrl: "https://www.imdb.com/title/tt2560140/",
    rating: 6.8,
    review: "",
  },
  {
    // Severance
    imdbUrl: "https://www.imdb.com/title/tt11280740/",
    rating: 8.4,
    review: "",
  },
  {
    // Black Mirror
    imdbUrl: "https://www.imdb.com/title/tt2085059/",
    rating: 8,
    review: "",
  },
  {
    // Adolescence
    imdbUrl: "https://www.imdb.com/title/tt31806037/",
    rating: 6,
    review: "",
  },
];

function getRatingColor(rating: number) {
  if (rating >= 9) return "bg-green-500/20 text-green-500";
  if (rating >= 7) return "bg-blue-500/20 text-blue-500";
  if (rating >= 5) return "bg-yellow-500/20 text-yellow-500";
  return "bg-red-500/20 text-red-500";
}

export default function MediaPage() {
  const [moviesWithPosters, setMoviesWithPosters] = useState<Movie[]>([]);
  const [topMoviesWithPosters, setTopMoviesWithPosters] = useState<Movie[]>([]);
  const [showsWithPosters, setShowsWithPosters] = useState<TVShow[]>([]);
  const [topShowsWithPosters, setTopShowsWithPosters] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShow, setSelectedShow] = useState<TVShow | null>(null);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [isTVModalOpen, setIsTVModalOpen] = useState(false);
  const [movieSortOption, setMovieSortOption] =
    useState<string>("highest-rating");
  const [tvSortOption, setTVSortOption] = useState<string>("highest-rating");
  const [movieOriginalOrder, setMovieOriginalOrder] = useState<Movie[]>([]);
  const [tvOriginalOrder, setTVOriginalOrder] = useState<TVShow[]>([]);

  useEffect(() => {
    async function fetchMediaData() {
      setIsLoading(true);
      try {
        // Fetch data for regular movies
        const updatedMovies = await Promise.all(
          movies.map(async (movie) => {
            const movieDetails = await getMovieDetailsFromImdbUrl(
              movie.imdbUrl
            );
            if (movieDetails) {
              return {
                ...movie,
                title: movieDetails.title || movie.title,
                director: movieDetails.director || movie.director,
                year: movieDetails.releaseYear || movie.year,
                genres: movieDetails.genres || movie.genres,
                posterUrl: movieDetails.posterPath || "/placeholder.svg",
                overview: movieDetails.overview || "",
              };
            }
            return movie;
          })
        );

        // Fetch data for top movies
        const updatedTopMovies = await Promise.all(
          topMovies.map(async (movie) => {
            const movieDetails = await getMovieDetailsFromImdbUrl(
              movie.imdbUrl
            );
            if (movieDetails) {
              return {
                ...movie,
                title: movieDetails.title || movie.title,
                director: movieDetails.director || movie.director,
                year: movieDetails.releaseYear || movie.year,
                genres: movieDetails.genres || movie.genres,
                posterUrl: movieDetails.posterPath || "/placeholder.svg",
                overview: movieDetails.overview || "",
                isTopMovie: true,
              };
            }
            return { ...movie, isTopMovie: true };
          })
        );

        // Fetch data for regular TV shows
        const updatedShows = await Promise.all(
          shows.map(async (show) => {
            console.log("Fetching details for TV show:", show.imdbUrl);
            const showDetails = await getTVDetailsFromImdbUrl(show.imdbUrl);
            console.log("Received TV show details:", showDetails);
            if (showDetails) {
              return {
                ...show,
                title: showDetails.title || show.title,
                creator: showDetails.creator || show.creator,
                firstAirYear: showDetails.firstAirYear || show.firstAirYear,
                genres: showDetails.genres || show.genres,
                posterUrl: showDetails.posterPath || "/placeholder.svg",
                overview: showDetails.overview || "",
                numberOfSeasons: showDetails.numberOfSeasons,
                numberOfEpisodes: showDetails.numberOfEpisodes,
              };
            }
            console.log("No details found for TV show:", show.imdbUrl);
            return show;
          })
        );

        // Fetch data for top TV shows
        const updatedTopShows = await Promise.all(
          topShows.map(async (show) => {
            const showDetails = await getTVDetailsFromImdbUrl(show.imdbUrl);
            if (showDetails) {
              return {
                ...show,
                title: showDetails.title || show.title,
                creator: showDetails.creator || show.creator,
                firstAirYear: showDetails.firstAirYear || show.firstAirYear,
                genres: showDetails.genres || show.genres,
                posterUrl: showDetails.posterPath || "/placeholder.svg",
                overview: showDetails.overview || "",
                numberOfSeasons: showDetails.numberOfSeasons,
                numberOfEpisodes: showDetails.numberOfEpisodes,
                isTopShow: true,
              };
            }
            return { ...show, isTopShow: true };
          })
        );

        // Store the original order
        setMovieOriginalOrder(updatedMovies);
        setTVOriginalOrder(updatedShows);

        // Sort movies by rating (highest first) initially
        const sortedMovies = [...updatedMovies].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
        setMoviesWithPosters(sortedMovies);
        setTopMoviesWithPosters(updatedTopMovies);

        // Sort TV shows by rating (highest first) initially
        const sortedShows = [...updatedShows].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
        setShowsWithPosters(sortedShows);
        setTopShowsWithPosters(updatedTopShows);
      } catch (error) {
        console.error("Error fetching media data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMediaData();
  }, []);

  const openMovieReviewModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsMovieModalOpen(true);
  };

  const closeMovieReviewModal = () => {
    setIsMovieModalOpen(false);
  };

  const openTVReviewModal = (show: TVShow) => {
    setSelectedShow(show);
    setIsTVModalOpen(true);
  };

  const closeTVReviewModal = () => {
    setIsTVModalOpen(false);
  };

  const sortMovies = (option: string) => {
    setMovieSortOption(option);
    let sortedMovies = [...moviesWithPosters];

    switch (option) {
      case "highest-rating":
        sortedMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "lowest-rating":
        sortedMovies.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "newest-movie":
        sortedMovies.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case "oldest-movie":
        sortedMovies.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case "newest-seen":
        sortedMovies = [...movieOriginalOrder].reverse();
        break;
      case "oldest-seen":
        sortedMovies = [...movieOriginalOrder];
        break;
      default:
        sortedMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setMoviesWithPosters(sortedMovies);
  };

  const sortTVShows = (option: string) => {
    setTVSortOption(option);
    let sortedShows = [...showsWithPosters];

    switch (option) {
      case "highest-rating":
        sortedShows.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "lowest-rating":
        sortedShows.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "newest-show":
        sortedShows.sort(
          (a, b) => (b.firstAirYear || 0) - (a.firstAirYear || 0)
        );
        break;
      case "oldest-show":
        sortedShows.sort(
          (a, b) => (a.firstAirYear || 0) - (b.firstAirYear || 0)
        );
        break;
      case "newest-seen":
        sortedShows = [...tvOriginalOrder].reverse();
        break;
      case "oldest-seen":
        sortedShows = [...tvOriginalOrder];
        break;
      default:
        sortedShows.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setShowsWithPosters(sortedShows);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-[98%] mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Media Collection</h1>
        <p className="text-muted-foreground mb-6">
          A curated collection of movies and TV shows I have watched with
          personal ratings and reviews. From classics to modern masterpieces,
          these are the pieces of media that have made me who I am.
        </p>

        <Tabs defaultValue="movies" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="tv">TV Shows</TabsTrigger>
          </TabsList>

          <TabsContent value="movies">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Top Movies Section */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">Favourite Movies</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topMoviesWithPosters.map((movie, index) => (
                      <TopMovieCard
                        key={`${movie.title}-${movie.year}`}
                        movie={movie}
                        rank={index + 1}
                        onReviewClick={openMovieReviewModal}
                      />
                    ))}
                  </div>
                </section>

                {/* All Movies Section */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">All Movies</h2>
                      <div className="px-2 py-1 bg-muted rounded-md text-sm">
                        {moviesWithPosters.length + topMoviesWithPosters.length}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Sort by:
                      </span>
                      <Select
                        value={movieSortOption}
                        onValueChange={sortMovies}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select sorting option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="highest-rating">
                            Highest Rating
                          </SelectItem>
                          <SelectItem value="lowest-rating">
                            Lowest Rating
                          </SelectItem>
                          <SelectItem value="newest-seen">
                            Newest Seen
                          </SelectItem>
                          <SelectItem value="oldest-seen">
                            Oldest Seen
                          </SelectItem>
                          <SelectItem value="newest-movie">
                            Newest Movie
                          </SelectItem>
                          <SelectItem value="oldest-movie">
                            Oldest Movie
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {moviesWithPosters.map((movie) => (
                      <div key={movie.imdbUrl} className="h-full">
                        <MovieCard
                          movie={movie}
                          onReviewClick={openMovieReviewModal}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </TabsContent>

          <TabsContent value="tv">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Top TV Shows Section */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">
                    Favourite TV Shows
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topShowsWithPosters.map((show, index) => (
                      <TopTVShowCard
                        key={`${show.title}-${show.firstAirYear}`}
                        show={show}
                        rank={index + 1}
                        onReviewClick={openTVReviewModal}
                      />
                    ))}
                  </div>
                </section>

                {/* All TV Shows Section */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">All TV Shows</h2>
                      <div className="px-2 py-1 bg-muted rounded-md text-sm">
                        {showsWithPosters.length + topShowsWithPosters.length}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Sort by:
                      </span>
                      <Select value={tvSortOption} onValueChange={sortTVShows}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select sorting option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="highest-rating">
                            Highest Rating
                          </SelectItem>
                          <SelectItem value="lowest-rating">
                            Lowest Rating
                          </SelectItem>
                          <SelectItem value="newest-seen">
                            Newest Seen
                          </SelectItem>
                          <SelectItem value="oldest-seen">
                            Oldest Seen
                          </SelectItem>
                          <SelectItem value="newest-show">
                            Newest Show
                          </SelectItem>
                          <SelectItem value="oldest-show">
                            Oldest Show
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {showsWithPosters.map((show) => (
                      <div key={show.imdbUrl} className="h-full">
                        <TVShowCard
                          show={show}
                          onReviewClick={openTVReviewModal}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Movie Review Modal */}
      {selectedMovie && (
        <MovieReviewModal
          isOpen={isMovieModalOpen}
          onClose={closeMovieReviewModal}
          movie={selectedMovie}
        />
      )}

      {/* TV Show Review Modal */}
      {selectedShow && (
        <TVReviewModal
          isOpen={isTVModalOpen}
          onClose={closeTVReviewModal}
          show={selectedShow}
        />
      )}
    </div>
  );
}

function TopMovieCard({
  movie,
  rank,
  onReviewClick,
}: {
  movie: Movie;
  rank: number;
  onReviewClick: (movie: Movie) => void;
}) {
  return (
    <Card
      className={`overflow-hidden h-full flex flex-col ${
        movie.review ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
      onClick={() => movie.review && onReviewClick(movie)}
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={movie.posterUrl || "/placeholder.svg"}
          alt={movie.title || "Movie poster"}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md font-medium text-sm">
          #{rank}
        </div>
      </div>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base truncate">
              {movie.title || "Loading..."}
            </CardTitle>
            <CardDescription className="text-xs truncate">
              {movie.director || "Unknown"} • {movie.year || "Unknown Year"}
            </CardDescription>
          </div>
          <div
            className={`px-2 py-1 rounded-md font-medium text-sm shrink-0 ${getRatingColor(
              movie.rating
            )}`}
          >
            {Number.isInteger(movie.rating)
              ? movie.rating
              : movie.rating.toFixed(1)}
            /10
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genres?.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-muted text-xs rounded-md"
            >
              {genre}
            </span>
          ))}
          {movie.genres && movie.genres.length > 2 && (
            <span className="px-1.5 py-0.5 bg-muted text-xs rounded-md">
              +{movie.genres.length - 2}
            </span>
          )}
        </div>
        {movie.overview && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {movie.overview}
          </p>
        )}
        {movie.review && (
          <div className="mt-1">
            <Button variant="link" size="sm" className="p-0 h-auto text-xs">
              Read my full review
            </Button>
          </div>
        )}
      </CardContent>
      <div className="p-3 pt-0 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-6 w-6"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={movie.imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View on IMDb"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </Card>
  );
}

function MovieCard({
  movie,
  onReviewClick,
}: {
  movie: Movie;
  onReviewClick: (movie: Movie) => void;
}) {
  return (
    <Card
      className={`overflow-hidden h-full flex flex-col ${
        movie.review ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
      onClick={() => movie.review && onReviewClick(movie)}
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={movie.posterUrl || "/placeholder.svg"}
          alt={movie.title || "Movie poster"}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base truncate">
              {movie.title || "Loading..."}
            </CardTitle>
            <CardDescription className="text-xs truncate">
              {movie.director || "Unknown"} • {movie.year || "Unknown Year"}
            </CardDescription>
          </div>
          <div
            className={`px-2 py-1 rounded-md font-medium text-sm shrink-0 ${getRatingColor(
              movie.rating
            )}`}
          >
            {Number.isInteger(movie.rating)
              ? movie.rating
              : movie.rating.toFixed(1)}
            /10
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genres?.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-muted text-xs rounded-md"
            >
              {genre}
            </span>
          ))}
          {movie.genres && movie.genres.length > 2 && (
            <span className="px-1.5 py-0.5 bg-muted text-xs rounded-md">
              +{movie.genres.length - 2}
            </span>
          )}
        </div>
        {movie.overview && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {movie.overview}
          </p>
        )}
        {movie.review && (
          <div className="mt-1">
            <Button variant="link" size="sm" className="p-0 h-auto text-xs">
              Read my full review
            </Button>
          </div>
        )}
      </CardContent>
      <div className="p-3 pt-0 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-6 w-6"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={movie.imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View on IMDb"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </Card>
  );
}

function TopTVShowCard({
  show,
  rank,
  onReviewClick,
}: {
  show: TVShow;
  rank: number;
  onReviewClick: (show: TVShow) => void;
}) {
  return (
    <Card
      className={`overflow-hidden h-full flex flex-col ${
        show.review ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
      onClick={() => show.review && onReviewClick(show)}
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={show.posterUrl || "/placeholder.svg"}
          alt={show.title || "TV show poster"}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md font-medium text-sm">
          #{rank}
        </div>
      </div>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base truncate">
              {show.title || "Loading..."}
            </CardTitle>
            <CardDescription className="text-xs truncate">
              {show.creator || "Unknown"} •{" "}
              {show.firstAirYear || "Unknown Year"}
            </CardDescription>
          </div>
          <div
            className={`px-2 py-1 rounded-md font-medium text-sm shrink-0 ${getRatingColor(
              show.rating
            )}`}
          >
            {Number.isInteger(show.rating)
              ? show.rating
              : show.rating.toFixed(1)}
            /10
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {show.genres?.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-muted text-xs rounded-md"
            >
              {genre}
            </span>
          ))}
          {show.genres && show.genres.length > 2 && (
            <span className="px-1.5 py-0.5 bg-muted text-xs rounded-md">
              +{show.genres.length - 2}
            </span>
          )}
        </div>
        {show.overview && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {show.overview}
          </p>
        )}
        {show.review && (
          <div className="mt-1">
            <Button variant="link" size="sm" className="p-0 h-auto text-xs">
              Read my full review
            </Button>
          </div>
        )}
      </CardContent>
      <div className="p-3 pt-0 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-6 w-6"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={show.imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View on IMDb"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </Card>
  );
}

function TVShowCard({
  show,
  onReviewClick,
}: {
  show: TVShow;
  onReviewClick: (show: TVShow) => void;
}) {
  return (
    <Card
      className={`overflow-hidden h-full flex flex-col ${
        show.review ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
      onClick={() => show.review && onReviewClick(show)}
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={show.posterUrl || "/placeholder.svg"}
          alt={show.title || "TV show poster"}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base truncate">
              {show.title || "Loading..."}
            </CardTitle>
            <CardDescription className="text-xs truncate">
              {show.creator || "Unknown"} •{" "}
              {show.firstAirYear || "Unknown Year"}
            </CardDescription>
          </div>
          <div
            className={`px-2 py-1 rounded-md font-medium text-sm shrink-0 ${getRatingColor(
              show.rating
            )}`}
          >
            {Number.isInteger(show.rating)
              ? show.rating
              : show.rating.toFixed(1)}
            /10
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {show.genres?.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-muted text-xs rounded-md"
            >
              {genre}
            </span>
          ))}
          {show.genres && show.genres.length > 2 && (
            <span className="px-1.5 py-0.5 bg-muted text-xs rounded-md">
              +{show.genres.length - 2}
            </span>
          )}
        </div>
        {show.overview && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {show.overview}
          </p>
        )}
        {show.review && (
          <div className="mt-1">
            <Button variant="link" size="sm" className="p-0 h-auto text-xs">
              Read my full review
            </Button>
          </div>
        )}
      </CardContent>
      <div className="p-3 pt-0 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-6 w-6"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={show.imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View on IMDb"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </Card>
  );
}
