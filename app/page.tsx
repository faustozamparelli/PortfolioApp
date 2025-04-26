import type React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Github,
  ExternalLink,
  Music,
  Film,
  BookOpen,
  FileText,
  Map,
  Code,
  Dumbbell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Socials from "@/components/socials";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="flex flex-col items-center justify-center text-center mb-16 w-full">
        <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
          <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6">
            <Image
              src="/placeholder.svg?height=128&width=128"
              alt="Profile"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-center w-full">
            Your Name
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl text-center">
            Developer, music enthusiast, film buff, and avid reader with a
            passion for continuous learning and growth.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button asChild>
              <Link href="https://github.com/yourusername">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/resume">
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href="https://yourblog.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Blog
              </Link>
            </Button>
          </div>

          {/* Social Links Section */}
          <div className="mb-8 w-full text-center">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Connect With Me
            </h2>
            <div className="flex justify-center">
              <Socials iconClassName="h-6 w-6" />
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center w-full mb-8">
        <h2 className="text-3xl font-bold text-center max-w-3xl">
          Explore My World
        </h2>
      </div>

      {/* Reordered to match navigation: Home, Projects, Resume, Roadmap, Movies, Music, Books, Hobbies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <SectionCard
          title="Projects"
          description="Check out my coding projects and open-source contributions."
          icon={<Code className="h-8 w-8" />}
          href="/projects"
        />

        <SectionCard
          title="Resume"
          description="View my professional experience, skills, and educational background."
          icon={<FileText className="h-8 w-8" />}
          href="/resume"
        />

        <SectionCard
          title="Lifetime Roadmap"
          description="Explore my past achievements and future goals on my personal journey."
          icon={<Map className="h-8 w-8" />}
          href="/roadmap"
        />

        <SectionCard
          title="Movie Log"
          description="Browse through my favorite films with personal ratings and reviews."
          icon={<Film className="h-8 w-8" />}
          href="/movies"
        />

        <SectionCard
          title="Music Collection"
          description="Explore my favorite artists, albums, and songs that have shaped my musical journey."
          icon={<Music className="h-8 w-8" />}
          href="/music"
        />

        <SectionCard
          title="Book Shelf"
          description="Discover the books that have influenced my thinking and imagination."
          icon={<BookOpen className="h-8 w-8" />}
          href="/books"
        />

        <SectionCard
          title="Hobbies"
          description="Learn about my interests and activities outside of work."
          icon={<Dumbbell className="h-8 w-8" />}
          href="/hobbies"
        />
      </div>

      {/* All Time Favorites Section */}
      <section className="mb-16">
        <div className="flex justify-center w-full mb-8">
          <h2 className="text-3xl font-bold text-center max-w-3xl">
            All Time Favorites
          </h2>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favoriteProjects.map((project, index) => (
                <FavoriteProjectCard
                  key={index}
                  title={project.title}
                  description={project.description}
                  technologies={project.technologies}
                  imagePath={project.imageUrl}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="movies" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favoriteMovies.map((movie, index) => (
                <FavoriteCard
                  key={index}
                  type="Movie"
                  title={movie.title}
                  creator={movie.director}
                  imagePath={movie.posterUrl}
                  rating={movie.rating}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="books" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favoriteBooks.map((book, index) => (
                <FavoriteCard
                  key={index}
                  type="Book"
                  title={book.title}
                  creator={book.author}
                  imagePath={book.coverUrl}
                  rating={book.rating}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="music" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favoriteSongs.map((song, index) => (
                <FavoriteCard
                  key={index}
                  type="Song"
                  title={song.title}
                  creator={song.artist}
                  imagePath={song.coverUrl}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function SectionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>Explore</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function FavoriteCard({
  type,
  title,
  creator,
  imagePath,
  rating,
}: {
  type: string;
  title: string;
  creator: string;
  imagePath: string;
  rating?: number;
}) {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-48 w-full">
        <Image
          src={imagePath || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{type}</p>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{creator}</CardDescription>
          </div>
          {rating && (
            <div className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
              {rating}/10
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

function FavoriteProjectCard({
  title,
  description,
  technologies,
  imagePath,
  githubUrl,
  liveUrl,
}: {
  title: string;
  description: string;
  technologies: string[];
  imagePath: string;
  githubUrl: string;
  liveUrl?: string;
}) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={imagePath || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className="px-6 pb-2 flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <CardFooter className="flex gap-2">
        <Button asChild size="sm" variant="outline" className="flex-1">
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            Code
          </a>
        </Button>
        {liveUrl && (
          <Button asChild size="sm" variant="outline" className="flex-1">
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Sample data for favorites
const favoriteBooks = [
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    coverUrl: "/placeholder.svg?height=192&width=384",
    rating: 9.5,
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    coverUrl: "/placeholder.svg?height=192&width=384",
    rating: 9.2,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl: "/placeholder.svg?height=192&width=384",
    rating: 8.8,
  },
];

const favoriteMovies = [
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    posterUrl: "/placeholder.svg?height=192&width=384",
    rating: 9.5,
  },
  {
    title: "Inception",
    director: "Christopher Nolan",
    posterUrl: "/placeholder.svg?height=192&width=384",
    rating: 9.0,
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    posterUrl: "/placeholder.svg?height=192&width=384",
    rating: 8.9,
  },
];

const favoriteSongs = [
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    coverUrl: "/placeholder.svg?height=192&width=384",
  },
  {
    title: "Wish You Were Here",
    artist: "Pink Floyd",
    coverUrl: "/placeholder.svg?height=192&width=384",
  },
  {
    title: "Imagine",
    artist: "John Lennon",
    coverUrl: "/placeholder.svg?height=192&width=384",
  },
];

const favoriteProjects = [
  {
    title: "Personal Portfolio",
    description:
      "A responsive personal website built with Next.js and Tailwind CSS.",
    technologies: ["Next.js", "React", "Tailwind CSS"],
    imageUrl: "/placeholder.svg?height=192&width=384",
    githubUrl: "https://github.com/yourusername/personal-portfolio",
    liveUrl: "https://your-portfolio.vercel.app",
  },
  {
    title: "E-commerce Platform",
    description:
      "A full-stack e-commerce platform with product listings and checkout.",
    technologies: ["React", "Node.js", "MongoDB"],
    imageUrl: "/placeholder.svg?height=192&width=384",
    githubUrl: "https://github.com/yourusername/ecommerce-platform",
    liveUrl: "https://ecommerce-platform.vercel.app",
  },
  {
    title: "Task Manager API",
    description: "A RESTful API for task management with authentication.",
    technologies: ["Node.js", "Express", "JWT"],
    imageUrl: "/placeholder.svg?height=192&width=384",
    githubUrl: "https://github.com/yourusername/task-manager-api",
  },
];
