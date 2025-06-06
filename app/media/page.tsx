"use client";

import Image from "next/image";
import {
  Star,
  StarHalf,
  ExternalLink,
  Filter,
  Clock,
  Search,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { MediaStatsModal } from "@/components/media-stats-modal";
import { useDataPreload } from "@/hooks/use-data-preload";

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
    // Step Up 3D
    imdbUrl: "https://www.imdb.com/title/tt1193631/",
    rating: 0,
    review: "",
  },
  {
    // Step Up Revolution
    imdbUrl: "https://www.imdb.com/title/tt1800741/",
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
    // Freerunner
    imdbUrl: "https://www.imdb.com/title/tt1579232/",
    rating: 0,
    review: "",
  },
  {
    // Tracers
    imdbUrl: "https://www.imdb.com/title/tt2401097/",
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
  {
    // Magazine Dreams
    imdbUrl: "https://www.imdb.com/title/tt13652142/",
    rating: 9.2,
    review:
      "Holy shit. This movie hits hard. Just imagine if The Joker and Whiplash had a baby,this is it. It left a mark on me during the fake gun scene in the car; it really gave me a perspective shift on how mass murders happen. If we truly put ourselves in the shoes of people in these positions, we can start to feel bad for them instead of just calling them monsters. I don't feel like this is just another Taxi Driver spinoff. In my opinion, it has more. It has darkness mixed with humor, mixed with cringe, mixed with determination and obsession. I liked the ending, but I expected a little more from it. That's why it's not a 10, but it came really close.",
  },
  {
    // On the count of three
    imdbUrl: "https://www.imdb.com/title/tt11160650/",
    rating: 7,
    review: "",
  },
  { imdbUrl: "https://www.imdb.com/title/tt0166813/", rating: 0, review: "" }, // Spirit: Stallion of the Cimarron
  { imdbUrl: "https://www.imdb.com/title/tt0475293/", rating: 0, review: "" }, // High School Musical
  { imdbUrl: "https://www.imdb.com/title/tt0126029/", rating: 0, review: "" }, // Shrek
  { imdbUrl: "https://www.imdb.com/title/tt0046705/", rating: 0, review: "" }, // An American in Rome
  { imdbUrl: "https://www.imdb.com/title/tt0298148/", rating: 0, review: "" }, // Shrek II
  { imdbUrl: "https://www.imdb.com/title/tt0448694/", rating: 0, review: "" }, // Puss in Boots
  { imdbUrl: "https://www.imdb.com/title/tt3915174/", rating: 0, review: "" }, // Puss in Boots: The Last Wish
  { imdbUrl: "https://www.imdb.com/title/tt0103639/", rating: 0, review: "" }, // Aladin
  { imdbUrl: "https://www.imdb.com/title/tt0120762/", rating: 0, review: "" }, // Mulan
  { imdbUrl: "https://www.imdb.com/title/tt0398286/", rating: 0, review: "" }, // Tangled
  { imdbUrl: "https://www.imdb.com/title/tt0119654/", rating: 0, review: "" }, // Men in Black
  { imdbUrl: "https://www.imdb.com/title/tt0480249/", rating: 0, review: "" }, // I Am Legend
  { imdbUrl: "https://www.imdb.com/title/tt0241527/", rating: 0, review: "" }, // Harry Potter and the Sorcerer's Stone
  { imdbUrl: "https://www.imdb.com/title/tt0295297/", rating: 0, review: "" }, // Harry Potter and the Chamber of Secrets
  { imdbUrl: "https://www.imdb.com/title/tt0304141/", rating: 0, review: "" }, // Harry Potter and the Prisoner of Azkaban
  { imdbUrl: "https://www.imdb.com/title/tt0330373/", rating: 0, review: "" }, // Harry Potter and the Goblet of Fire
  { imdbUrl: "https://www.imdb.com/title/tt0417741/", rating: 0, review: "" }, // Harry Potter and the Half-Blood Prince
  { imdbUrl: "https://www.imdb.com/title/tt0926084/", rating: 0, review: "" }, // Harry Potter and the Deathly Hallows – Part 1
  { imdbUrl: "https://www.imdb.com/title/tt1201607/", rating: 0, review: "" }, // Harry Potter and the Deathly Hallows – Part 2
  { imdbUrl: "https://www.imdb.com/title/tt0448157/", rating: 0, review: "" }, // Hancock
  { imdbUrl: "https://www.imdb.com/title/tt0454921/", rating: 0, review: "" }, // The Pursuit of Happyness
  { imdbUrl: "https://www.imdb.com/title/tt0814314/", rating: 0, review: "" }, // Seven Pounds
  { imdbUrl: "https://www.imdb.com/title/tt1502397/", rating: 0, review: "" }, // Bad Boys for Life
  { imdbUrl: "https://www.imdb.com/title/tt1211837/", rating: 0, review: "" }, // Doctor Strange
  { imdbUrl: "https://www.imdb.com/title/tt1213641/", rating: 0, review: "" }, // First Man
  { imdbUrl: "https://www.imdb.com/title/tt0780504/", rating: 0, review: "" }, // Drive
  { imdbUrl: "https://www.imdb.com/title/tt2582802/", rating: 0, review: "" }, // Whiplash
  { imdbUrl: "https://www.imdb.com/title/tt7293698/", rating: 0, review: "" }, // Breaking Two
  { imdbUrl: "https://www.imdb.com/title/tt0162222/", rating: 0, review: "" }, // Cast Away
  { imdbUrl: "https://www.imdb.com/title/tt7775622/", rating: 0, review: "" }, // Free Solo
  { imdbUrl: "https://www.imdb.com/title/tt4550098/", rating: 0, review: "" }, // Nocturnal Animals
  { imdbUrl: "https://www.imdb.com/title/tt1817273/", rating: 0, review: "" }, // The Place Beyond the Pines
  { imdbUrl: "https://www.imdb.com/title/tt0120667/", rating: 0, review: "" }, // Fantastic Four
  { imdbUrl: "https://www.imdb.com/title/tt0338013/", rating: 0, review: "" }, // Eternal Sunshine of the Spotless Mind
  { imdbUrl: "https://www.imdb.com/title/tt6751668/", rating: 0, review: "" }, // Parasite
  { imdbUrl: "https://www.imdb.com/title/tt2278388/", rating: 0, review: "" }, // The Grand Budapest Hotel
  { imdbUrl: "https://www.imdb.com/title/tt0993846/", rating: 0, review: "" }, // The Wolf of Wall Street
  { imdbUrl: "https://www.imdb.com/title/tt7322224/", rating: 0, review: "" }, // Triangle of Sadness
  { imdbUrl: "https://www.imdb.com/title/tt7286456/", rating: 0, review: "" }, // Joker
  { imdbUrl: "https://www.imdb.com/title/tt0099653/", rating: 0, review: "" }, // Ghost
  { imdbUrl: "https://www.imdb.com/title/tt1424432/", rating: 0, review: "" }, // Senna
  { imdbUrl: "https://www.imdb.com/title/tt5727282/", rating: 0, review: "" }, // Borg vs McEnroe
  { imdbUrl: "https://www.imdb.com/title/tt0808279/", rating: 0, review: "" }, // Funny Games
  { imdbUrl: "https://www.imdb.com/title/tt19801404/", rating: 0, review: "" }, // Untrapped: The Story of Lil Baby
  { imdbUrl: "https://www.imdb.com/title/tt1659337/", rating: 0, review: "" }, // The Perks of Being a Wallflower
  { imdbUrl: "https://www.imdb.com/title/tt0114369/", rating: 0, review: "" }, // Se7en
  { imdbUrl: "https://www.imdb.com/title/tt0361748/", rating: 0, review: "" }, // Inglourious Basterds
  { imdbUrl: "https://www.imdb.com/title/tt0113247/", rating: 0, review: "" }, // La Haine (L'odio)
  { imdbUrl: "https://www.imdb.com/title/tt0947798/", rating: 0, review: "" }, // Black Swan
  { imdbUrl: "https://www.imdb.com/title/tt4846232/", rating: 0, review: "" }, // Good Time
  { imdbUrl: "https://www.imdb.com/title/tt1375666/", rating: 0, review: "" }, // Inception
  { imdbUrl: "https://www.imdb.com/title/tt1130884/", rating: 0, review: "" }, // Shutter Island
  { imdbUrl: "https://www.imdb.com/title/tt2693580/", rating: 0, review: "" }, // Miss Stevens
  { imdbUrl: "https://www.imdb.com/title/tt16426418/", rating: 0, review: "" }, // Challengers
  { imdbUrl: "https://www.imdb.com/title/tt5726616/", rating: 0, review: "" }, // Call Me by Your Name
  { imdbUrl: "https://www.imdb.com/title/tt1120985/", rating: 0, review: "" }, // Blue Valentine
  { imdbUrl: "https://www.imdb.com/title/tt2267998/", rating: 0, review: "" }, // Gone Girl
  { imdbUrl: "https://www.imdb.com/title/tt4537896/", rating: 0, review: "" }, // White Boy Rick
  { imdbUrl: "https://www.imdb.com/title/tt14230458/", rating: 0, review: "" }, // Poor Things
  { imdbUrl: "https://www.imdb.com/title/tt4516162/", rating: 0, review: "" }, // Martin Eden
  { imdbUrl: "https://www.imdb.com/title/tt0272338/", rating: 0, review: "" }, // Punch-Drunk Love
  { imdbUrl: "https://www.imdb.com/title/tt9764362/", rating: 0, review: "" }, // The Menu
  { imdbUrl: "https://www.imdb.com/title/tt0364569/", rating: 0, review: "" }, // Oldboy
  { imdbUrl: "https://www.imdb.com/title/tt5247192/", rating: 0, review: "" }, // Piuma (2016)
  { imdbUrl: "https://www.imdb.com/title/tt1877830/", rating: 0, review: "" }, // The Batman (2022)
  { imdbUrl: "https://www.imdb.com/title/tt0468569/", rating: 0, review: "" }, // The Dark Knight
  { imdbUrl: "https://www.imdb.com/title/tt0119217/", rating: 0, review: "" }, // Good Will Hunting
  { imdbUrl: "https://www.imdb.com/title/tt2005151/", rating: 0, review: "" }, // War Dogs
  { imdbUrl: "https://www.imdb.com/title/tt1232829/", rating: 0, review: "" }, // Jump Street
  { imdbUrl: "https://www.imdb.com/title/tt1700841/", rating: 0, review: "" }, // Sausage Party
  { imdbUrl: "https://www.imdb.com/title/tt1001526/", rating: 0, review: "" }, // Megamind
  { imdbUrl: "https://www.imdb.com/title/tt0462538/", rating: 0, review: "" }, // The Simpsons Movie
  { imdbUrl: "https://www.imdb.com/title/tt0892769/", rating: 0, review: "" }, // How to Train Your Dragon
  { imdbUrl: "https://www.imdb.com/title/tt21819228/", rating: 0, review: "" }, // Stutz
  { imdbUrl: "https://www.imdb.com/title/tt2273657/", rating: 0, review: "" }, // True Story
  { imdbUrl: "https://www.imdb.com/title/tt1895587/", rating: 0, review: "" }, // Spotlight
  { imdbUrl: "https://www.imdb.com/title/tt3774114/", rating: 0, review: "" }, // Snowden
  { imdbUrl: "https://www.imdb.com/title/tt4044364/", rating: 0, review: "" }, // Citizenfour
  { imdbUrl: "https://www.imdb.com/title/tt1821597/", rating: 0, review: "" }, // Scialla – Stai Sereno
  { imdbUrl: "https://www.imdb.com/title/tt0469494/", rating: 0, review: "" }, // There Will Be Blood
  { imdbUrl: "https://www.imdb.com/title/tt10272386/", rating: 0, review: "" }, // The Father
  { imdbUrl: "https://www.imdb.com/title/tt0264464/", rating: 0, review: "" }, // Catch Me If You Can
  { imdbUrl: "https://www.imdb.com/title/tt0441773/", rating: 0, review: "" }, // Kung Fu Panda
  { imdbUrl: "https://www.imdb.com/title/tt1022603/", rating: 0, review: "" }, // (500) Days of Summer
  { imdbUrl: "https://www.imdb.com/title/tt0066921/", rating: 0, review: "" }, // A Clockwork Orange
  { imdbUrl: "https://www.imdb.com/title/tt0118694/", rating: 0, review: "" }, // In the Mood for Love
  { imdbUrl: "https://www.imdb.com/title/tt4034228/", rating: 0, review: "" }, // Manchester by the Sea
  { imdbUrl: "https://www.imdb.com/title/tt3031654/", rating: 0, review: "" }, // Ennio
  { imdbUrl: "https://www.imdb.com/title/tt0081505/", rating: 0, review: "" }, // The Shining
  { imdbUrl: "https://www.imdb.com/title/tt0054215/", rating: 0, review: "" }, // Psycho
  { imdbUrl: "https://www.imdb.com/title/tt5715874/", rating: 0, review: "" }, // The Killing of a Sacred Deer
  { imdbUrl: "https://www.imdb.com/title/tt4229236/", rating: 0, review: "" }, // Cobain: Montage of Heck
  { imdbUrl: "https://www.imdb.com/title/tt1226837/", rating: 0, review: "" }, // Beautiful Boy
  { imdbUrl: "https://www.imdb.com/title/tt1798709/", rating: 0, review: "" }, // Her
  { imdbUrl: "https://www.imdb.com/title/tt0075314/", rating: 0, review: "" }, // Taxi Driver
  { imdbUrl: "https://www.imdb.com/title/tt1560747/", rating: 0, review: "" }, // The Master
  { imdbUrl: "https://www.imdb.com/title/tt0367594/", rating: 0, review: "" }, // Charlie and the Chocolate Factory
  { imdbUrl: "https://www.imdb.com/title/tt6166392/", rating: 0, review: "" }, // Wonka
  { imdbUrl: "https://www.imdb.com/title/tt5363618/", rating: 0, review: "" }, // Sound of Metal
  { imdbUrl: "https://www.imdb.com/title/tt3416536/", rating: 0, review: "" }, // Hot Summer Nights
  { imdbUrl: "https://www.imdb.com/title/tt6212478/", rating: 0, review: "" }, // American Animals
  { imdbUrl: "https://www.imdb.com/title/tt1100089/", rating: 0, review: "" }, // Foxcatcher
  { imdbUrl: "https://www.imdb.com/title/tt12262116/", rating: 0, review: "" }, // Thirteen Lives
  { imdbUrl: "https://www.imdb.com/title/tt0338751/", rating: 0, review: "" }, // The Aviator
  { imdbUrl: "https://www.imdb.com/title/tt6966692/", rating: 0, review: "" }, // Green Book
  { imdbUrl: "https://www.imdb.com/title/tt0407887/", rating: 0, review: "" }, // The Departed
  { imdbUrl: "https://www.imdb.com/title/tt3152602/", rating: 0, review: "" }, // Il giovane favoloso
  { imdbUrl: "https://www.imdb.com/title/tt5649144/", rating: 0, review: "" }, // The Florida Project
  { imdbUrl: "https://www.imdb.com/title/tt3659388/", rating: 0, review: "" }, // The Martian
  { imdbUrl: "https://www.imdb.com/title/tt6710474/", rating: 0, review: "" }, // Everything Everywhere All at Once
  { imdbUrl: "https://www.imdb.com/title/tt13833688/", rating: 0, review: "" }, // The Whale
  { imdbUrl: "https://www.imdb.com/title/tt13849558/", rating: 0, review: "" }, // Corner Office
  { imdbUrl: "https://www.imdb.com/title/tt17526714/", rating: 0, review: "" }, // The Substance
  { imdbUrl: "https://www.imdb.com/title/tt0052357/", rating: 0, review: "" }, // Vertigo
  { imdbUrl: "https://www.imdb.com/title/tt0353969/", rating: 0, review: "" }, // Memories of Murder
  { imdbUrl: "https://www.imdb.com/title/tt23468450/", rating: 0, review: "" }, // Longlegs
  { imdbUrl: "https://www.imdb.com/title/tt7979142/", rating: 0, review: "" }, // The Night Clerk
  { imdbUrl: "https://www.imdb.com/title/tt28607951/", rating: 0, review: "" }, // Anora
  { imdbUrl: "https://www.imdb.com/title/tt1764234/", rating: 0, review: "" }, // Killing Them Softly
  { imdbUrl: "https://www.imdb.com/title/tt4003440/", rating: 0, review: "" }, // The House That Jack Built
  { imdbUrl: "https://www.imdb.com/title/tt4016934/", rating: 0, review: "" }, // The Handmaiden
  { imdbUrl: "https://www.imdb.com/title/tt5040012/", rating: 0, review: "" }, // Nosferatu
  { imdbUrl: "https://www.imdb.com/title/tt11563598/", rating: 0, review: "" }, // A Complete Unknown
  { imdbUrl: "https://www.imdb.com/title/tt0209144/", rating: 0, review: "" }, // Memento
  { imdbUrl: "https://www.imdb.com/title/tt0361862/", rating: 0, review: "" }, // The Machinist
  { imdbUrl: "https://www.imdb.com/title/tt0278504/", rating: 0, review: "" }, // Insomnia
  { imdbUrl: "https://www.imdb.com/title/tt7653254/", rating: 0, review: "" }, // A Marriage Story
  { imdbUrl: "https://www.imdb.com/title/tt1568346/", rating: 0, review: "" }, // The Girl with the Dragon Tattoo
  { imdbUrl: "https://www.imdb.com/title/tt0258000/", rating: 0, review: "" }, // Panic Room
  { imdbUrl: "https://www.imdb.com/title/tt0327056/", rating: 0, review: "" }, // Mystic River
  { imdbUrl: "https://www.imdb.com/title/tt1136617/", rating: 0, review: "" }, // The Killer
  { imdbUrl: "https://www.imdb.com/title/tt12299608/", rating: 0, review: "" }, // Mikey 17
  { imdbUrl: "https://www.imdb.com/title/tt0073582/", rating: 0, review: "" }, // Profondo Rosso
  { imdbUrl: "https://www.imdb.com/title/tt1615147/", rating: 0, review: "" }, // Margin Call
  { imdbUrl: "https://www.imdb.com/title/tt9660502/", rating: 0, review: "" }, // Close
  { imdbUrl: "https://www.imdb.com/title/tt0245429/", rating: 0, review: "" }, // Spirited Away
  { imdbUrl: "https://www.imdb.com/title/tt1504320/", rating: 0, review: "" }, // The King's Speech
  { imdbUrl: "https://www.imdb.com/title/tt1375670/", rating: 0, review: "" }, // Grown Ups
  { imdbUrl: "https://www.imdb.com/title/tt0389860/", rating: 0, review: "" }, // Click
  { imdbUrl: "https://www.imdb.com/title/tt6700846/", rating: 0, review: "" }, // AlphaGo
  { imdbUrl: "https://www.imdb.com/title/tt32150119/", rating: 0, review: "" }, // The Thinking Game
  { imdbUrl: "https://www.imdb.com/title/tt0499549/", rating: 0, review: "" }, // Avatar
  { imdbUrl: "https://www.imdb.com/title/tt1630029/", rating: 0, review: "" }, // Avatar: The Way of Water
  { imdbUrl: "https://www.imdb.com/title/tt1229238/", rating: 0, review: "" }, // Mission Impossible: ghost protocol
  { imdbUrl: "https://www.imdb.com/title/tt0317919/", rating: 0, review: "" }, // Mission Impossible III
  { imdbUrl: "https://www.imdb.com/title/tt1517268/", rating: 0, review: "" }, // Barbie
  { imdbUrl: "https://www.imdb.com/title/tt15398776/", rating: 0, review: "" }, // Oppenheimer
  { imdbUrl: "https://www.imdb.com/title/tt0268978/", rating: 0, review: "" }, // A Beautiful Mind
  { imdbUrl: "https://www.imdb.com/title/tt31193180/", rating: 0, review: "" }, // Sinners
  { imdbUrl: "https://www.imdb.com/title/tt20215234/", rating: 0, review: "" }, // Conclave
  { imdbUrl: "https://www.imdb.com/title/tt16968450/", rating: 0, review: "" }, // The Wonderful Story of Henry Sugar
  { imdbUrl: "https://www.imdb.com/title/tt10168670/", rating: 0, review: "" }, // Bones and All
  { imdbUrl: "https://www.imdb.com/title/tt14641542/", rating: 0, review: "" }, // The eight mountains
  { imdbUrl: "https://www.imdb.com/title/tt3281548/", rating: 0, review: "" }, // Little Women
  { imdbUrl: "https://www.imdb.com/title/tt4901306/", rating: 0, review: "" }, // Perfetti Sconosciuti
  { imdbUrl: "https://www.imdb.com/title/tt3890160/", rating: 0, review: "" }, // Baby Driver
  { imdbUrl: "https://www.imdb.com/title/tt0083658/", rating: 0, review: "" }, // Blade Runner
  { imdbUrl: "https://www.imdb.com/title/tt1856101/", rating: 0, review: "" }, // Blade Runner 2049
  { imdbUrl: "https://www.imdb.com/title/tt9495224/", rating: 0, review: "" }, // Bandersnatch
  { imdbUrl: "https://www.imdb.com/title/tt4925292/", rating: 0, review: "" }, // Ladybird
  { imdbUrl: "https://www.imdb.com/title/tt5052448/", rating: 0, review: "" }, // Get Out
  { imdbUrl: "https://www.imdb.com/title/tt1392214/", rating: 0, review: "" }, // Prisoners
  { imdbUrl: "https://www.imdb.com/title/tt0086250/", rating: 0, review: "" }, // Scarface
  { imdbUrl: "https://www.imdb.com/title/tt0443706/", rating: 0, review: "" }, // Zodiac
  { imdbUrl: "https://www.imdb.com/title/tt0166924/", rating: 0, review: "" }, // Mulholland Drive
  { imdbUrl: "https://www.imdb.com/title/tt0144084/", rating: 0, review: "" }, // American Psycho
  { imdbUrl: "https://www.imdb.com/title/tt0169547/", rating: 0, review: "" }, // American Beauty
  { imdbUrl: "https://www.imdb.com/title/tt0062622/", rating: 0, review: "" }, // 2001: A Space Odyssey
  { imdbUrl: "https://www.imdb.com/title/tt0078788/", rating: 0, review: "" }, // Apocalypse Now
  { imdbUrl: "https://www.imdb.com/title/tt0137523/", rating: 0, review: "" }, // Fight Club
  { imdbUrl: "https://www.imdb.com/title/tt0758758/", rating: 0, review: "" }, // Into the Wild
  { imdbUrl: "https://www.imdb.com/title/tt0246578/", rating: 0, review: "" }, // Donnie Darko
  { imdbUrl: "https://www.imdb.com/title/tt3224458/", rating: 0, review: "" }, // A Beautiful Day in the Neighborhood
  { imdbUrl: "https://www.imdb.com/title/tt0099685/", rating: 0, review: "" }, // Goodfellas
  { imdbUrl: "https://www.imdb.com/title/tt1302006/", rating: 0, review: "" }, // The Irishman
  { imdbUrl: "https://www.imdb.com/title/tt17351924/", rating: 0, review: "" }, // Saltburn
  { imdbUrl: "https://www.imdb.com/title/tt7160372/", rating: 0, review: "" }, // The Zone of Interest
  { imdbUrl: "https://www.imdb.com/title/tt0914798/", rating: 0, review: "" }, // The Boy in the Striped Pajamas
  { imdbUrl: "https://www.imdb.com/title/tt3464902/", rating: 0, review: "" }, // The Lobster
  { imdbUrl: "https://www.imdb.com/title/tt1800241/", rating: 0, review: "" }, // American Hustle
  { imdbUrl: "https://www.imdb.com/title/tt1979320/", rating: 0, review: "" }, // Rush
  { imdbUrl: "https://www.imdb.com/title/tt2980516/", rating: 0, review: "" }, // The Theory of Everything
  { imdbUrl: "https://www.imdb.com/title/tt2316411/", rating: 0, review: "" }, // Enemy
  { imdbUrl: "https://www.imdb.com/title/tt3359350/", rating: 0, review: "" }, // Road House
  { imdbUrl: "https://www.imdb.com/title/tt3881784/", rating: 0, review: "" }, // Stronger
  { imdbUrl: "https://www.imdb.com/title/tt3967856/", rating: 0, review: "" }, // Okja
  { imdbUrl: "https://www.imdb.com/title/tt1798684/", rating: 0, review: "" }, // Southpaw
  { imdbUrl: "https://www.imdb.com/title/tt1855199/", rating: 0, review: "" }, // End of Watch
  { imdbUrl: "https://www.imdb.com/title/tt0758752/", rating: 0, review: "" }, // Love & Other Drugs
  { imdbUrl: "https://www.imdb.com/title/tt0945513/", rating: 0, review: "" }, // Source Code
  { imdbUrl: "https://www.imdb.com/title/tt9421570/", rating: 0, review: "" }, // The Guilty
  { imdbUrl: "https://www.imdb.com/title/tt0335266/", rating: 0, review: "" }, // Lost in Translation
  { imdbUrl: "https://www.imdb.com/title/tt7131622/", rating: 0, review: "" }, // Once Upon a Time... in Hollywood
  { imdbUrl: "https://www.imdb.com/title/tt1853728/", rating: 0, review: "" }, // Django Unchained
  { imdbUrl: "https://www.imdb.com/title/tt0110912/", rating: 0, review: "" }, // Pulp Fiction
  { imdbUrl: "https://www.imdb.com/title/tt0266697/", rating: 0, review: "" }, // Kill Bill: Vol. 1
  { imdbUrl: "https://www.imdb.com/title/tt5013056/", rating: 0, review: "" }, // Dunkirk
  { imdbUrl: "https://www.imdb.com/title/tt0482571/", rating: 0, review: "" }, // The Prestige
  { imdbUrl: "https://www.imdb.com/title/tt1727824/", rating: 0, review: "" }, // Bohemian Rhapsody
  { imdbUrl: "https://www.imdb.com/title/tt8579674/", rating: 0, review: "" }, // 1917
  { imdbUrl: "https://www.imdb.com/title/tt0133093/", rating: 0, review: "" }, // The Matrix
  { imdbUrl: "https://www.imdb.com/title/tt0102926/", rating: 0, review: "" }, // The Silence of the Lambs
  { imdbUrl: "https://www.imdb.com/title/tt1675434/", rating: 0, review: "" }, //The Intouchables
  { imdbUrl: "https://www.imdb.com/title/tt1950186/", rating: 0, review: "" }, // Ford v Ferrari
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
    // Last Change U
    imdbUrl: "https://www.imdb.com/title/tt13087512/",
    rating: 9.5,
    review: "",
    isTopShow: true,
  },
];

// All shows
const shows: TVShow[] = [
  
  {
    // Mr Robot
    imdbUrl: "https://www.imdb.com/title/tt4158110/",
    rating: 9,
    review: "",
  },
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
    // Mindhunter
    imdbUrl: "https://www.imdb.com/title/tt5290382/",
    rating: 6.5,
    review: "",
  },
  {
    // Chernobyl
    imdbUrl: "https://www.imdb.com/title/tt7366338/",
    rating: 7.9,
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
  if (rating >= 10) return "bg-amber-500/20 text-amber-500"; // Gold for 10-11
  if (rating >= 9) return "bg-emerald-500/20 text-emerald-500"; // Emerald for 9-9.9
  if (rating >= 8) return "bg-green-500/20 text-green-500"; // Green for 8-8.9
  if (rating >= 7) return "bg-teal-500/20 text-teal-500"; // Teal for 7-7.9
  if (rating >= 6) return "bg-blue-500/20 text-blue-500"; // Blue for 6-6.9
  if (rating >= 5) return "bg-indigo-500/20 text-indigo-500"; // Indigo for 5-5.9
  if (rating >= 4) return "bg-purple-500/20 text-purple-500"; // Purple for 4-4.9
  if (rating >= 3) return "bg-yellow-500/20 text-yellow-500"; // Yellow for 3-3.9
  if (rating >= 2) return "bg-orange-500/20 text-orange-500"; // Orange for 2-2.9
  return "bg-red-500/20 text-red-500"; // Red for 0-1.9
}

export default function MediaPage() {
  const { data, preloadMedia } = useDataPreload();
  const [moviesWithPosters, setMoviesWithPosters] = useState<Movie[]>([]);
  const [topMoviesWithPosters, setTopMoviesWithPosters] = useState<Movie[]>([]);
  const [tvShowsWithPosters, setTVShowsWithPosters] = useState<TVShow[]>([]);
  const [topTVShowsWithPosters, setTopTVShowsWithPosters] = useState<TVShow[]>(
    []
  );
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTVShow, setSelectedTVShow] = useState<TVShow | null>(null);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [isTVModalOpen, setIsTVModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [movieSortOption, setMovieSortOption] = useState("highest-rating");
  const [tvSortOption, setTVSortOption] = useState("highest-rating");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Trigger preload data for media
    preloadMedia();

    // Keep existing data loading logic for now
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
        setMoviesWithPosters(updatedMovies);
        setTopMoviesWithPosters(updatedTopMovies);
        setTVShowsWithPosters(updatedShows);
        setTopTVShowsWithPosters(updatedTopShows);
      } catch (error) {
        console.error("Error fetching media data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMediaData();
  }, [preloadMedia]);

  const openMovieReviewModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsMovieModalOpen(true);
  };

  const closeMovieReviewModal = () => {
    setIsMovieModalOpen(false);
  };

  const openTVReviewModal = (show: TVShow) => {
    setSelectedTVShow(show);
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
        sortedMovies = [...moviesWithPosters].reverse();
        break;
      case "oldest-seen":
        sortedMovies = [...moviesWithPosters];
        break;
      default:
        sortedMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setMoviesWithPosters(sortedMovies);
  };

  const sortTVShows = (option: string) => {
    setTVSortOption(option);
    let sortedShows = [...tvShowsWithPosters];

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
        sortedShows = [...topTVShowsWithPosters].reverse();
        break;
      case "oldest-seen":
        sortedShows = [...topTVShowsWithPosters];
        break;
      default:
        sortedShows.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setTVShowsWithPosters(sortedShows);
  };

  // Filter media based on search query
  const filterMediaBySearchQuery = useCallback(
    (mediaItems: Movie[] | TVShow[], query: string) => {
      if (!query.trim()) {
        return mediaItems;
      }
      const lowerCaseQuery = query.toLowerCase();
      return mediaItems.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(lowerCaseQuery)) ||
          ((item as Movie).director &&
            (item as Movie).director?.toLowerCase().includes(lowerCaseQuery)) ||
          ((item as TVShow).creator &&
            (item as TVShow).creator?.toLowerCase().includes(lowerCaseQuery)) ||
          (item.overview &&
            item.overview.toLowerCase().includes(lowerCaseQuery)) ||
          (item.genres &&
            item.genres.some((genre) =>
              genre.toLowerCase().includes(lowerCaseQuery)
            ))
      );
    },
    []
  );

  // Filtered media items
  const filteredMovies = useMemo(
    () => filterMediaBySearchQuery(moviesWithPosters, searchQuery) as Movie[],
    [moviesWithPosters, searchQuery, filterMediaBySearchQuery]
  );

  const filteredShows = useMemo(
    () => filterMediaBySearchQuery(tvShowsWithPosters, searchQuery) as TVShow[],
    [tvShowsWithPosters, searchQuery, filterMediaBySearchQuery]
  );

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-[98%] mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">My Media Collection</h1>
          <Button onClick={() => setIsStatsModalOpen(true)}>
            View Statistics
          </Button>
        </div>
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

                {/* Search Bar for Movies */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search movies by title, director, or genre..."
                      className="pl-10 pr-4"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

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
                    {filteredMovies.map((movie) => (
                      <div key={movie.imdbUrl} className="h-full">
                        <MovieCard
                          movie={movie}
                          onReviewClick={openMovieReviewModal}
                        />
                      </div>
                    ))}
                    {filteredMovies.length === 0 && searchQuery && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        No movies found matching "{searchQuery}"
                      </div>
                    )}
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
                    {topTVShowsWithPosters.map((show, index) => (
                      <TopTVShowCard
                        key={`${show.title}-${show.firstAirYear}`}
                        show={show}
                        rank={index + 1}
                        onReviewClick={openTVReviewModal}
                      />
                    ))}
                  </div>
                </section>

                {/* Search Bar for TV Shows */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search TV shows by title, creator, or genre..."
                      className="pl-10 pr-4"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                {/* All TV Shows Section */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">All TV Shows</h2>
                      <div className="px-2 py-1 bg-muted rounded-md text-sm">
                        {tvShowsWithPosters.length +
                          topTVShowsWithPosters.length}
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
                    {filteredShows.map((show) => (
                      <div key={show.imdbUrl} className="h-full">
                        <TVShowCard
                          show={show}
                          onReviewClick={openTVReviewModal}
                        />
                      </div>
                    ))}
                    {filteredShows.length === 0 && searchQuery && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        No TV shows found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Stats Modal */}
      <MediaStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        movies={filteredMovies}
        topMovies={topMoviesWithPosters}
        shows={filteredShows}
        topShows={topTVShowsWithPosters}
      />

      {/* Movie Review Modal */}
      {selectedMovie && (
        <MovieReviewModal
          isOpen={isMovieModalOpen}
          onClose={closeMovieReviewModal}
          movie={selectedMovie}
        />
      )}

      {/* TV Show Review Modal */}
      {selectedTVShow && (
        <TVReviewModal
          isOpen={isTVModalOpen}
          onClose={closeTVReviewModal}
          show={selectedTVShow}
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
