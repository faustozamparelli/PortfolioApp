import Image from "next/image"
import { Camera, Bike, Utensils, Gamepad, Palette, Mountain, Plane } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HobbiesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Hobbies & Interests</h1>
        <p className="text-muted-foreground mb-8">
          Beyond my professional life, I'm passionate about various activities that keep me inspired, energized, and
          balanced. Here's a glimpse into what I enjoy doing in my free time.
        </p>

        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Hobbies</TabsTrigger>
            <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allHobbies.map((hobby, index) => (
                <HobbyCard key={index} hobby={hobby} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="outdoor" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allHobbies
                .filter((hobby) => hobby.category === "outdoor")
                .map((hobby, index) => (
                  <HobbyCard key={index} hobby={hobby} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="creative" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allHobbies
                .filter((hobby) => hobby.category === "creative")
                .map((hobby, index) => (
                  <HobbyCard key={index} hobby={hobby} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="other" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allHobbies
                .filter((hobby) => hobby.category === "other")
                .map((hobby, index) => (
                  <HobbyCard key={index} hobby={hobby} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent Adventures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentAdventures.map((adventure, index) => (
              <AdventureCard key={index} adventure={adventure} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Hobby Wishlist</h2>
          <Card>
            <CardHeader>
              <CardTitle>Things I Want to Try</CardTitle>
              <CardDescription>New hobbies and activities on my radar</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {hobbyWishlist.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {getHobbyIcon(item.icon, "h-5 w-5 mt-0.5 text-primary")}
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

function HobbyCard({ hobby }: { hobby: (typeof allHobbies)[0] }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image src={hobby.imageUrl || "/placeholder.svg"} alt={hobby.name} fill className="object-cover" />
      </div>
      <CardHeader>
        <div className="flex items-center gap-2">
          {getHobbyIcon(hobby.icon, "h-5 w-5 text-primary")}
          <CardTitle>{hobby.name}</CardTitle>
        </div>
        <CardDescription>{hobby.since}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{hobby.description}</p>
        {hobby.achievements && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Achievements:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {hobby.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      {hobby.link && (
        <CardFooter>
          <Button variant="outline" size="sm" asChild className="w-full">
            <a href={hobby.link} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

function AdventureCard({ adventure }: { adventure: (typeof recentAdventures)[0] }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64 w-full">
        <Image src={adventure.imageUrl || "/placeholder.svg"} alt={adventure.title} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{adventure.title}</CardTitle>
        <CardDescription>{adventure.date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{adventure.description}</p>
      </CardContent>
    </Card>
  )
}

function getHobbyIcon(iconName: string, className: string) {
  switch (iconName) {
    case "camera":
      return <Camera className={className} />
    case "bike":
      return <Bike className={className} />
    case "utensils":
      return <Utensils className={className} />
    case "gamepad":
      return <Gamepad className={className} />
    case "palette":
      return <Palette className={className} />
    case "mountain":
      return <Mountain className={className} />
    case "plane":
      return <Plane className={className} />
    default:
      return <Camera className={className} />
  }
}

// Sample data
const allHobbies = [
  {
    name: "Photography",
    icon: "camera",
    category: "creative",
    since: "Since 2015",
    description:
      "I love capturing moments and scenes, particularly landscape and street photography. I've been developing my skills with both digital and film cameras.",
    achievements: [
      "Had my work featured in a local gallery exhibition",
      "Completed a 365-day photo challenge",
      "Published a photo book of urban landscapes",
    ],
    imageUrl: "/placeholder.svg?height=192&width=384",
    link: "#",
  },
  {
    name: "Cycling",
    icon: "bike",
    category: "outdoor",
    since: "Since 2018",
    description:
      "Cycling has become my favorite way to explore new areas and stay fit. I enjoy both road cycling and mountain biking on weekends.",
    achievements: [
      "Completed a 100-mile charity ride",
      "Cycled across three countries in a week",
      "Built my own custom bike from components",
    ],
    imageUrl: "/placeholder.svg?height=192&width=384",
    link: "#",
  },
  {
    name: "Cooking",
    icon: "utensils",
    category: "creative",
    since: "Since 2010",
    description:
      "I find cooking to be both creative and therapeutic. I enjoy experimenting with different cuisines and techniques, especially Italian and Asian dishes.",
    achievements: [
      "Completed a professional cooking course",
      "Hosted dinner parties for up to 20 people",
      "Created my own recipe book of family favorites",
    ],
    imageUrl: "/placeholder.svg?height=192&width=384",
    link: "#",
  },
  {
    name: "Gaming",
    icon: "gamepad",
    category: "other",
    since: "Since childhood",
    description:
      "Video games have been a passion since I was young. I enjoy story-rich RPGs, strategy games, and occasionally competitive multiplayer games.",
    achievements: [
      "Reached top 1% ranking in a competitive strategy game",
      "Completed a 24-hour charity gaming marathon",
      "Built my own gaming PC from scratch",
    ],
    imageUrl: "/placeholder.svg?height=192&width=384",
    link: "#",
  },
  {
    name: "Painting",
    icon: "palette",
    category: "creative",
    since: "Since 2020",
    description:
      "A relatively new hobby that I picked up during lockdown. I mainly work with acrylics and watercolors, focusing on abstract and nature-inspired pieces.",
    achievements: ["Completed a 30-day painting challenge", "Sold my first painting at a local art fair"],
    imageUrl: "/placeholder.svg?height=192&width=384",
    link: "#",
  },
  {
    name: "Hiking",
    icon: "mountain",
    category: "outdoor",
    since: "Since 2016",
    description:
      "There's nothing like the feeling of reaching a summit and taking in the view. I try to go on at least one major hiking trip each year.",
    achievements: [
      "Completed the Pacific Crest Trail section hike",
      "Reached the summit of Mount Rainier",
      "Hiked in 12 different national parks",
    ],
    imageUrl: "/placeholder.svg?height=192&width=384",
    link: "#",
  },
]

const recentAdventures = [
  {
    title: "Backpacking Through the Alps",
    date: "Summer 2023",
    description:
      "Spent three weeks hiking through Switzerland, Austria, and Italy. The Alpine landscapes were breathtaking, and I met amazing people from around the world on the trails.",
    imageUrl: "/placeholder.svg?height=256&width=512",
  },
  {
    title: "Culinary Workshop in Thailand",
    date: "Spring 2023",
    description:
      "Participated in a week-long cooking workshop in Chiang Mai, learning traditional Thai cooking techniques and visiting local markets and farms for ingredients.",
    imageUrl: "/placeholder.svg?height=256&width=512",
  },
  {
    title: "Photography Exhibition",
    date: "Winter 2022",
    description:
      "Had my urban landscape photography featured in a local gallery's 'City Perspectives' exhibition. It was my first time displaying my work publicly.",
    imageUrl: "/placeholder.svg?height=256&width=512",
  },
  {
    title: "Cycling Tour of the Pacific Coast",
    date: "Fall 2022",
    description:
      "Completed a 500-mile cycling journey down the Pacific Coast Highway, camping along the way and experiencing the stunning coastal scenery.",
    imageUrl: "/placeholder.svg?height=256&width=512",
  },
]

const hobbyWishlist = [
  {
    name: "Scuba Diving",
    icon: "mountain",
    description: "I'd love to explore the underwater world and see marine life up close in their natural habitat.",
  },
  {
    name: "Pottery",
    icon: "palette",
    description:
      "Creating functional art with clay seems both therapeutic and rewarding. I want to try wheel throwing.",
  },
  {
    name: "Rock Climbing",
    icon: "mountain",
    description:
      "The combination of physical challenge and problem-solving appeals to me. I'd like to start with indoor climbing.",
  },
  {
    name: "International Cooking Classes",
    icon: "utensils",
    description:
      "I want to take cooking classes in different countries to learn authentic techniques and recipes firsthand.",
  },
  {
    name: "Astrophotography",
    icon: "camera",
    description: "Capturing the night sky and celestial objects would be an amazing extension of my photography hobby.",
  },
]
