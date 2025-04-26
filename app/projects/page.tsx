import Image from "next/image"
import { Github, ExternalLink, Star, GitFork, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">My GitHub Projects</h1>
        <p className="text-muted-foreground mb-8">
          A showcase of my coding projects, open-source contributions, and experiments. These projects represent my
          journey as a developer and my passion for creating useful software.
        </p>

        <Tabs defaultValue="featured" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="experiments">Experiments</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.map((project, index) => (
                <FeaturedProjectCard key={index} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contributions" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contributions.map((project, index) => (
                <ContributionCard key={index} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experiments" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiments.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <section>
          <h2 className="text-2xl font-bold mb-4">GitHub Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Repositories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">32</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contributions</CardTitle>
                <CardDescription>Last year</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">1,248</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stars Received</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">187</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

function FeaturedProjectCard({ project }: { project: (typeof featuredProjects)[0] }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64 w-full">
        <Image src={project.imageUrl || "/placeholder.svg"} alt={project.name} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4" />
            {project.stars}
          </div>
          <div className="flex items-center">
            <GitFork className="mr-1 h-4 w-4" />
            {project.forks}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            View Code
          </a>
        </Button>
        {project.demoUrl && (
          <Button variant="outline" asChild>
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function ProjectCard({ project }: { project: (typeof allProjects)[0] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-muted text-xs rounded-md">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4" />
            {project.stars}
          </div>
          <div className="flex items-center">
            <GitFork className="mr-1 h-4 w-4" />
            {project.forks}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ContributionCard({ project }: { project: (typeof contributions)[0] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Contribution:</span> {project.contributionDescription}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4" />
              {project.stars}
            </div>
            <div className="flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              {project.pullRequests} PRs
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            View Project
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Sample data
const featuredProjects = [
  {
    name: "Personal Portfolio",
    description: "A responsive personal portfolio website built with Next.js and Tailwind CSS.",
    technologies: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    stars: 42,
    forks: 12,
    imageUrl: "/placeholder.svg?height=256&width=512",
    githubUrl: "https://github.com/yourusername/personal-portfolio",
    demoUrl: "https://your-portfolio.vercel.app",
  },
  {
    name: "Task Manager API",
    description: "A RESTful API for task management with authentication and authorization.",
    technologies: ["Node.js", "Express", "MongoDB", "JWT"],
    stars: 28,
    forks: 8,
    imageUrl: "/placeholder.svg?height=256&width=512",
    githubUrl: "https://github.com/yourusername/task-manager-api",
    demoUrl: "https://task-manager-api.herokuapp.com",
  },
]

const allProjects = [
  {
    name: "Weather App",
    description: "A weather application that displays current weather and forecasts.",
    technologies: ["React", "OpenWeather API", "CSS"],
    stars: 15,
    forks: 3,
    githubUrl: "https://github.com/yourusername/weather-app",
  },
  {
    name: "E-commerce Platform",
    description: "A full-stack e-commerce platform with product listings, cart, and checkout.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    stars: 35,
    forks: 7,
    githubUrl: "https://github.com/yourusername/ecommerce-platform",
  },
  {
    name: "Markdown Note Taking App",
    description: "A simple note-taking application with markdown support.",
    technologies: ["Vue.js", "Firebase", "Marked.js"],
    stars: 18,
    forks: 4,
    githubUrl: "https://github.com/yourusername/markdown-notes",
  },
  {
    name: "URL Shortener",
    description: "A URL shortening service with analytics.",
    technologies: ["Express", "MongoDB", "Redis"],
    stars: 12,
    forks: 2,
    githubUrl: "https://github.com/yourusername/url-shortener",
  },
  {
    name: "Chat Application",
    description: "Real-time chat application with rooms and private messaging.",
    technologies: ["Socket.io", "React", "Express"],
    stars: 22,
    forks: 5,
    githubUrl: "https://github.com/yourusername/chat-app",
  },
]

const contributions = [
  {
    name: "React",
    description: "A JavaScript library for building user interfaces.",
    contributionDescription: "Fixed a bug in the event handling system and improved documentation.",
    stars: "200k+",
    pullRequests: 3,
    githubUrl: "https://github.com/facebook/react",
  },
  {
    name: "Next.js",
    description: "The React framework for production.",
    contributionDescription: "Added an example for using custom server with TypeScript.",
    stars: "100k+",
    pullRequests: 2,
    githubUrl: "https://github.com/vercel/next.js",
  },
  {
    name: "TailwindCSS",
    description: "A utility-first CSS framework for rapid UI development.",
    contributionDescription: "Contributed to the documentation and fixed typos.",
    stars: "60k+",
    pullRequests: 1,
    githubUrl: "https://github.com/tailwindlabs/tailwindcss",
  },
]

const experiments = [
  {
    name: "WebGL Experiments",
    description: "A collection of WebGL experiments and visualizations.",
    technologies: ["WebGL", "Three.js", "JavaScript"],
    stars: 8,
    forks: 1,
    githubUrl: "https://github.com/yourusername/webgl-experiments",
  },
  {
    name: "Machine Learning Playground",
    description: "Experiments with various machine learning algorithms and datasets.",
    technologies: ["Python", "TensorFlow", "Scikit-learn"],
    stars: 10,
    forks: 2,
    githubUrl: "https://github.com/yourusername/ml-playground",
  },
  {
    name: "CSS Animation Collection",
    description: "A collection of pure CSS animations and transitions.",
    technologies: ["HTML", "CSS", "SCSS"],
    stars: 5,
    forks: 0,
    githubUrl: "https://github.com/yourusername/css-animations",
  },
]
