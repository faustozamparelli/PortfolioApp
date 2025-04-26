import Image from "next/image"
import { BookOpen, ExternalLink, Search, Star, StarHalf } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function BooksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Book Collection</h1>
        <p className="text-muted-foreground mb-8">
          A curated collection of books that have shaped my thinking, expanded my knowledge, and sparked my imagination
          over the years.
        </p>

        {/* Top Favorite Books Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">My Favorite Books of All Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {favoriteBooks.map((book, index) => (
              <FavoriteBookCard key={index} book={book} rank={index + 1} />
            ))}
          </div>
        </section>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search books by title, author, or genre..." className="pl-10" />
        </div>

        <Tabs defaultValue="non-fiction" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="non-fiction">Non-Fiction</TabsTrigger>
            <TabsTrigger value="fiction">Fiction</TabsTrigger>
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="reading-now">Currently Reading</TabsTrigger>
          </TabsList>

          <TabsContent value="non-fiction" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBooks
                .filter((book) => book.type === "Non-Fiction")
                .map((book, index) => (
                  <BookCard key={index} book={book} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="fiction" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBooks
                .filter((book) => book.type === "Fiction")
                .map((book, index) => (
                  <BookCard key={index} book={book} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBooks.map((book, index) => (
                <BookCard key={index} book={book} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reading-now" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentlyReading.map((book, index) => (
                <CurrentlyReadingCard key={index} book={book} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <section>
          <h2 className="text-2xl font-bold mb-4">Reading Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Books Read</CardTitle>
                <CardDescription>This year</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">12</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pages Read</CardTitle>
                <CardDescription>This year</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">3,842</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reading Goal</CardTitle>
                <CardDescription>Books this year</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">20</p>
                <p className="text-sm text-muted-foreground">60% complete</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

function FavoriteBookCard({ book, rank }: { book: (typeof favoriteBooks)[0]; rank: number }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <div className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
          {rank}
        </div>
        <div className="relative h-48 w-full">
          <Image src={book.coverUrl || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{book.title}</CardTitle>
        <CardDescription>{book.author}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center mb-2">
          <div className="text-lg font-bold mr-2">{book.rating}/10</div>
          <div className="flex">
            {[...Array(Math.floor(book.rating / 2))].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
            {book.rating % 2 !== 0 && <StarHalf className="h-4 w-4 fill-primary text-primary" />}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{book.notes}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={book.goodreadsUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Goodreads
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function BookCard({ book }: { book: (typeof allBooks)[0] }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64 w-full">
        <Image src={book.coverUrl || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>{book.author}</CardDescription>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">{book.rating}/10</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="px-2 py-1 bg-muted text-xs rounded-md">{book.type}</span>
          {book.genres.map((genre, index) => (
            <span key={index} className="px-2 py-1 bg-muted text-xs rounded-md">
              {genre}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{book.notes}</p>
        {book.review && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">My Review:</h4>
            <Textarea readOnly value={book.review} className="resize-none text-sm h-24 bg-muted/50" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild>
          <a href={book.goodreadsUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Goodreads
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function CurrentlyReadingCard({ book }: { book: (typeof currentlyReading)[0] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-12 flex-shrink-0">
            <Image
              src={book.coverUrl || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div>
            <CardTitle className="text-lg">{book.title}</CardTitle>
            <CardDescription>{book.author}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{book.progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${book.progress}%` }}></div>
          </div>
          <p className="text-sm text-muted-foreground">
            <BookOpen className="inline-block mr-1 h-4 w-4" />
            Page {book.currentPage} of {book.totalPages}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          Update Progress
        </Button>
      </CardFooter>
    </Card>
  )
}

// Sample data
const favoriteBooks = [
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    type: "Non-Fiction",
    genres: ["Psychology", "Economics"],
    rating: 9.5,
    notes: "A fascinating look at the two systems that drive the way we think and make decisions.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow",
    review:
      "This book completely changed how I understand human decision making. Kahneman's insights into cognitive biases are profound and applicable to everyday life.",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    type: "Non-Fiction",
    genres: ["History", "Science"],
    rating: 9.2,
    notes: "A thought-provoking exploration of human history and our species' impact on the world.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/23692271-sapiens",
    review:
      "Harari has a gift for making complex historical concepts accessible and engaging. His perspective on human evolution and society is eye-opening.",
  },
  {
    title: "1984",
    author: "George Orwell",
    type: "Fiction",
    genres: ["Dystopian", "Classic"],
    rating: 9.0,
    notes: "A chilling portrayal of a totalitarian future that feels increasingly relevant today.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/5470.1984",
    review:
      "Orwell's vision of the future remains as powerful and disturbing today as when it was written. The concepts of doublethink and thoughtcrime are brilliant literary inventions.",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    type: "Non-Fiction",
    genres: ["Self-Help", "Psychology"],
    rating: 8.8,
    notes: "A practical guide to building good habits and breaking bad ones through small changes.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/40121378-atomic-habits",
    review:
      "The most practical book on habit formation I've ever read. Clear's 1% improvement concept has transformed how I approach personal development.",
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    type: "Fiction",
    genres: ["Fantasy", "Adventure"],
    rating: 9.3,
    notes: "The epic fantasy that defined the genre and created a richly detailed world.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/33.The_Lord_of_the_Rings",
    review:
      "The gold standard for world-building in fiction. Tolkien's attention to detail and mythological depth created a universe that feels completely real.",
  },
]

const allBooks = [
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    type: "Non-Fiction",
    genres: ["Psychology", "Economics"],
    rating: 9.5,
    notes: "A fascinating look at the two systems that drive the way we think and make decisions.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow",
    review:
      "This book completely changed how I understand human decision making. Kahneman's insights into cognitive biases are profound and applicable to everyday life.",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    type: "Non-Fiction",
    genres: ["History", "Science"],
    rating: 9.2,
    notes: "A thought-provoking exploration of human history and our species' impact on the world.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/23692271-sapiens",
  },
  {
    title: "1984",
    author: "George Orwell",
    type: "Fiction",
    genres: ["Dystopian", "Classic"],
    rating: 9.0,
    notes: "A chilling portrayal of a totalitarian future that feels increasingly relevant today.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/5470.1984",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    type: "Non-Fiction",
    genres: ["Self-Help", "Psychology"],
    rating: 8.8,
    notes: "A practical guide to building good habits and breaking bad ones through small changes.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/40121378-atomic-habits",
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    type: "Fiction",
    genres: ["Fantasy", "Adventure"],
    rating: 9.3,
    notes: "The epic fantasy that defined the genre and created a richly detailed world.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/33.The_Lord_of_the_Rings",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    type: "Fiction",
    genres: ["Classic", "Coming-of-age"],
    rating: 8.9,
    notes: "A powerful exploration of racial injustice and moral growth in the American South.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/2657.To_Kill_a_Mockingbird",
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    type: "Non-Fiction",
    genres: ["Philosophy", "Stoicism"],
    rating: 8.7,
    notes: "Ancient wisdom that remains remarkably relevant to modern life.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/30659.Meditations",
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    type: "Non-Fiction",
    genres: ["Finance", "Psychology"],
    rating: 8.5,
    notes: "Timeless lessons on wealth, greed, and happiness.",
    coverUrl: "/placeholder.svg?height=256&width=384",
    goodreadsUrl: "https://www.goodreads.com/book/show/41881472-the-psychology-of-money",
  },
]

const currentlyReading = [
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverUrl: "/placeholder.svg?height=64&width=48",
    progress: 65,
    currentPage: 234,
    totalPages: 360,
    startDate: "2023-04-15",
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverUrl: "/placeholder.svg?height=64&width=48",
    progress: 30,
    currentPage: 78,
    totalPages: 256,
    startDate: "2023-04-02",
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    coverUrl: "/placeholder.svg?height=64&width=48",
    progress: 15,
    currentPage: 45,
    totalPages: 304,
    startDate: "2023-04-20",
  },
]
