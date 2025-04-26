import { CheckCircle2, Circle, Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RoadmapPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Lifetime Roadmap</h1>
        <p className="text-muted-foreground mb-8">
          A visual representation of my journey so far and my plans for the future. This roadmap outlines my personal
          and professional milestones, goals, and aspirations.
        </p>

        <Tabs defaultValue="timeline" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="goals">Current Goals</TabsTrigger>
            <TabsTrigger value="bucket-list">Bucket List</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="pt-6">
            <div className="relative border-l-2 border-muted ml-3 pl-8 space-y-10">
              {timeline.map((item, index) => (
                <TimelineItem key={index} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Goals</CardTitle>
                  <CardDescription>Career and skill development</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {goals.professional.map((goal, index) => (
                      <GoalItem key={index} goal={goal} />
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Goals</CardTitle>
                  <CardDescription>Health, relationships, and lifestyle</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {goals.personal.map((goal, index) => (
                      <GoalItem key={index} goal={goal} />
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Goals</CardTitle>
                  <CardDescription>Knowledge and education</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {goals.learning.map((goal, index) => (
                      <GoalItem key={index} goal={goal} />
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Goals</CardTitle>
                  <CardDescription>Savings and investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {goals.financial.map((goal, index) => (
                      <GoalItem key={index} goal={goal} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bucket-list" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Travel</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {bucketList.travel.map((item, index) => (
                      <BucketListItem key={index} item={item} />
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Experiences</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {bucketList.experiences.map((item, index) => (
                      <BucketListItem key={index} item={item} />
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {bucketList.skills.map((item, index) => (
                      <BucketListItem key={index} item={item} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <section>
          <h2 className="text-2xl font-bold mb-4">Life Philosophy</h2>
          <Card>
            <CardContent className="pt-6">
              <blockquote className="border-l-4 pl-4 italic">
                "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to
                have it make some difference that you have lived and lived well."
              </blockquote>
              <p className="text-right text-sm text-muted-foreground mt-2">— Ralph Waldo Emerson</p>

              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  My personal philosophy is centered around continuous growth, meaningful connections, and making a
                  positive impact. I believe in embracing challenges as opportunities for learning and in finding joy in
                  the journey rather than just the destination.
                </p>
                <p>
                  I strive to maintain a balance between ambition and contentment, between planning for the future and
                  appreciating the present moment. This roadmap is not just a list of achievements to check off, but a
                  reflection of the values that guide my decisions and the vision I have for my life.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

function TimelineItem({ item }: { item: (typeof timeline)[0] }) {
  return (
    <div className="relative">
      <div className="absolute -left-11 mt-1.5">
        {item.status === "completed" ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : item.status === "in-progress" ? (
          <Clock className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold">{item.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{item.period}</p>
        <p className="text-muted-foreground">{item.description}</p>
        {item.achievements && (
          <div className="mt-2">
            <h4 className="font-medium mb-1">Key Achievements:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {item.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function GoalItem({ goal }: { goal: (typeof goals.professional)[0] }) {
  return (
    <li className="flex items-start gap-2">
      {goal.status === "completed" ? (
        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      ) : goal.status === "in-progress" ? (
        <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
      )}
      <div>
        <p className="font-medium">{goal.title}</p>
        {goal.timeline && <p className="text-sm text-muted-foreground">Timeline: {goal.timeline}</p>}
        {goal.progress && (
          <div className="mt-1 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{goal.progress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${goal.progress}%` }}></div>
            </div>
          </div>
        )}
      </div>
    </li>
  )
}

function BucketListItem({ item }: { item: (typeof bucketList.travel)[0] }) {
  return (
    <li className="flex items-start gap-2">
      {item.completed ? (
        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
      )}
      <div>
        <p className="font-medium">{item.title}</p>
        {item.notes && <p className="text-sm text-muted-foreground">{item.notes}</p>}
        {item.targetDate && <p className="text-xs text-muted-foreground">Target: {item.targetDate}</p>}
      </div>
    </li>
  )
}

// Sample data
const timeline = [
  {
    title: "Early Education",
    period: "2000 - 2010",
    description: "Completed primary and secondary education with a focus on mathematics and science.",
    status: "completed",
    achievements: [
      "Graduated with honors",
      "Won the regional mathematics competition",
      "Served as student council president",
    ],
  },
  {
    title: "University Education",
    period: "2010 - 2014",
    description: "Earned a Bachelor's degree in Computer Science with a minor in Business Administration.",
    status: "completed",
    achievements: [
      "Dean's List for all semesters",
      "Completed a thesis on machine learning applications",
      "Participated in multiple hackathons and coding competitions",
    ],
  },
  {
    title: "Graduate Studies",
    period: "2014 - 2016",
    description: "Completed a Master's degree in Computer Science with a focus on software engineering.",
    status: "completed",
    achievements: [
      "Published a research paper on efficient algorithms",
      "Teaching assistant for undergraduate programming courses",
      "Received a scholarship for academic excellence",
    ],
  },
  {
    title: "Early Career",
    period: "2016 - 2020",
    description:
      "Started my professional journey as a software developer, working on web applications and gaining industry experience.",
    status: "completed",
    achievements: [
      "Promoted to senior developer within 3 years",
      "Led the development of a key product feature",
      "Mentored junior developers and interns",
    ],
  },
  {
    title: "Career Growth",
    period: "2021 - Present",
    description: "Advanced to a senior role with leadership responsibilities and a focus on architectural decisions.",
    status: "in-progress",
    achievements: [
      "Leading a team of developers on a major project",
      "Implementing best practices and modern development workflows",
      "Contributing to open-source projects",
    ],
  },
  {
    title: "Future Leadership",
    period: "2025 - 2030",
    description:
      "Aspire to move into a technical leadership position where I can guide product strategy and mentor the next generation of developers.",
    status: "planned",
  },
  {
    title: "Entrepreneurship",
    period: "2030 - 2035",
    description:
      "Plan to start my own technology company focused on solving meaningful problems and creating positive social impact.",
    status: "planned",
  },
]

const goals = {
  professional: [
    {
      title: "Become a Technical Lead",
      status: "in-progress",
      timeline: "1-2 years",
      progress: 60,
    },
    {
      title: "Contribute to 5 major open-source projects",
      status: "in-progress",
      timeline: "Ongoing",
      progress: 40,
    },
    {
      title: "Speak at a major tech conference",
      status: "planned",
      timeline: "Next year",
    },
    {
      title: "Publish a technical book or course",
      status: "planned",
      timeline: "3-5 years",
    },
  ],
  personal: [
    {
      title: "Run a half marathon",
      status: "completed",
      timeline: "Completed last year",
    },
    {
      title: "Learn to play the guitar",
      status: "in-progress",
      timeline: "Ongoing",
      progress: 30,
    },
    {
      title: "Meditate daily for a year",
      status: "in-progress",
      timeline: "This year",
      progress: 45,
    },
    {
      title: "Volunteer regularly for a cause I care about",
      status: "planned",
      timeline: "Starting next month",
    },
  ],
  learning: [
    {
      title: "Master a new programming language",
      status: "in-progress",
      timeline: "This year",
      progress: 70,
    },
    {
      title: "Complete an AI/ML specialization",
      status: "planned",
      timeline: "Next year",
    },
    {
      title: "Learn a new natural language",
      status: "in-progress",
      timeline: "Ongoing",
      progress: 25,
    },
    {
      title: "Read 24 books this year",
      status: "in-progress",
      timeline: "This year",
      progress: 50,
    },
  ],
  financial: [
    {
      title: "Build an emergency fund (6 months of expenses)",
      status: "completed",
      timeline: "Completed last year",
    },
    {
      title: "Max out retirement contributions",
      status: "in-progress",
      timeline: "This year",
      progress: 75,
    },
    {
      title: "Save for a down payment on a house",
      status: "in-progress",
      timeline: "2-3 years",
      progress: 40,
    },
    {
      title: "Create a passive income stream",
      status: "planned",
      timeline: "3-5 years",
    },
  ],
}

const bucketList = {
  travel: [
    {
      title: "Visit Japan during cherry blossom season",
      completed: false,
      targetDate: "Spring 2025",
    },
    {
      title: "Hike the Inca Trail to Machu Picchu",
      completed: false,
      targetDate: "Summer 2026",
    },
    {
      title: "See the Northern Lights in Iceland",
      completed: true,
      notes: "Unforgettable experience in February 2022",
    },
    {
      title: "Road trip across the United States",
      completed: false,
      targetDate: "Summer 2027",
    },
    {
      title: "Visit all seven continents",
      completed: false,
      notes: "4/7 completed (North America, Europe, Asia, Australia)",
    },
  ],
  experiences: [
    {
      title: "Learn to scuba dive",
      completed: true,
      notes: "Got PADI certification in 2021",
    },
    {
      title: "Attend a major music festival",
      completed: true,
      notes: "Coachella 2019",
    },
    {
      title: "Go skydiving",
      completed: false,
      targetDate: "2024",
    },
    {
      title: "Attend the Olympics",
      completed: false,
      targetDate: "2028 Los Angeles",
    },
    {
      title: "Take a hot air balloon ride",
      completed: false,
    },
  ],
  skills: [
    {
      title: "Learn to cook dishes from 10 different cuisines",
      completed: false,
      notes: "6/10 completed (Italian, Mexican, Japanese, Indian, Thai, French)",
    },
    {
      title: "Become fluent in Spanish",
      completed: false,
      targetDate: "2025",
    },
    {
      title: "Learn to sail",
      completed: false,
      targetDate: "Summer 2024",
    },
    {
      title: "Master photography",
      completed: false,
      notes: "Taking classes and practicing regularly",
    },
    {
      title: "Write and publish a novel",
      completed: false,
      targetDate: "2028",
    },
  ],
}
