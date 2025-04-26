import { Download, Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ResumePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Name</h1>
            <p className="text-xl text-muted-foreground">Software Developer</p>
          </div>
          <Button asChild>
            <a href="/resume.pdf" download>
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </a>
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            <a href="mailto:your.email@example.com" className="hover:text-primary">
              your.email@example.com
            </a>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Phone className="mr-2 h-4 w-4" />
            <a href="tel:+1234567890" className="hover:text-primary">
              +1 (234) 567-890
            </a>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Linkedin className="mr-2 h-4 w-4" />
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              linkedin.com/in/yourusername
            </a>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Github className="mr-2 h-4 w-4" />
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              github.com/yourusername
            </a>
          </div>
        </div>

        <Tabs defaultValue="resume" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="pt-6">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
              <p className="text-muted-foreground">
                Experienced software developer with a passion for creating clean, efficient, and user-friendly
                applications. Skilled in front-end and back-end development with a focus on JavaScript frameworks.
                Strong problem-solving abilities and a commitment to writing maintainable code.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
              <div className="space-y-6">
                {workExperience.map((job, index) => (
                  <div key={index} className="border-l-2 pl-4 pb-2">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-primary font-medium">{job.company}</p>
                      <p className="text-sm text-muted-foreground">{job.period}</p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {job.responsibilities.map((responsibility, idx) => (
                        <li key={idx}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Projects</h2>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{project.name}</h3>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Github className="h-5 w-5" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-muted text-xs rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="skills" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Programming Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {skills.languages.map((skill, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${skill.level}%` }}></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frameworks & Libraries</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {skills.frameworks.map((skill, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${skill.level}%` }}></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tools & Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {skills.tools.map((skill, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${skill.level}%` }}></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Soft Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {skills.soft.map((skill, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${skill.level}%` }}></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="education" className="pt-6">
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{edu.degree}</CardTitle>
                        <CardDescription>{edu.institution}</CardDescription>
                      </div>
                      <span className="text-sm text-muted-foreground">{edu.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{edu.description}</p>
                    {edu.achievements && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Achievements:</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {edu.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <section>
          <h2 className="text-2xl font-bold mb-4">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {cert.issuer} • {cert.date}
                </p>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center mt-2 hover:underline"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    View Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

// Sample data
const workExperience = [
  {
    title: "Senior Frontend Developer",
    company: "Tech Solutions Inc.",
    period: "Jan 2021 - Present",
    responsibilities: [
      "Lead a team of 5 developers in building and maintaining a complex SaaS platform",
      "Implemented a new component library that reduced development time by 30%",
      "Optimized application performance, resulting in a 40% decrease in load time",
      "Collaborated with UX designers to improve user experience and accessibility",
    ],
  },
  {
    title: "Frontend Developer",
    company: "Digital Innovations",
    period: "Mar 2018 - Dec 2020",
    responsibilities: [
      "Developed responsive web applications using React and Redux",
      "Implemented CI/CD pipelines that improved deployment efficiency",
      "Worked closely with backend developers to integrate RESTful APIs",
      "Mentored junior developers and conducted code reviews",
    ],
  },
  {
    title: "Junior Web Developer",
    company: "Creative Web Solutions",
    period: "Jun 2016 - Feb 2018",
    responsibilities: [
      "Built and maintained client websites using HTML, CSS, and JavaScript",
      "Collaborated with designers to implement pixel-perfect layouts",
      "Optimized websites for maximum speed and scalability",
      "Assisted in troubleshooting and fixing bugs",
    ],
  },
]

const projects = [
  {
    name: "E-commerce Platform",
    description: "A full-stack e-commerce platform with product listings, cart, and checkout functionality.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    githubUrl: "https://github.com/yourusername/ecommerce-platform",
    liveUrl: "https://ecommerce-platform.vercel.app",
  },
  {
    name: "Task Management App",
    description: "A productivity application for managing tasks and projects with team collaboration features.",
    technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/yourusername/task-management",
    liveUrl: "https://task-management-app.vercel.app",
  },
  {
    name: "Weather Dashboard",
    description: "A weather application that displays current weather and forecasts for multiple locations.",
    technologies: ["React", "OpenWeather API", "Chart.js"],
    githubUrl: "https://github.com/yourusername/weather-dashboard",
    liveUrl: "https://weather-dashboard.vercel.app",
  },
]

const skills = {
  languages: [
    { name: "JavaScript", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "HTML/CSS", level: 95 },
    { name: "Python", level: 75 },
    { name: "SQL", level: 80 },
  ],
  frameworks: [
    { name: "React", level: 95 },
    { name: "Next.js", level: 90 },
    { name: "Vue.js", level: 85 },
    { name: "Node.js/Express", level: 85 },
    { name: "Tailwind CSS", level: 90 },
  ],
  tools: [
    { name: "Git/GitHub", level: 90 },
    { name: "Docker", level: 75 },
    { name: "AWS", level: 70 },
    { name: "Webpack", level: 85 },
    { name: "Jest/Testing Library", level: 80 },
  ],
  soft: [
    { name: "Problem Solving", level: 95 },
    { name: "Communication", level: 90 },
    { name: "Teamwork", level: 95 },
    { name: "Time Management", level: 85 },
    { name: "Adaptability", level: 90 },
  ],
}

const education = [
  {
    degree: "Master of Science in Computer Science",
    institution: "University of Technology",
    period: "2014 - 2016",
    description: "Specialized in Software Engineering with a focus on web technologies and distributed systems.",
    achievements: [
      "Graduated with distinction (GPA: 3.8/4.0)",
      "Published a research paper on efficient algorithms for web applications",
      "Received the Outstanding Student Award",
    ],
  },
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "State University",
    period: "2010 - 2014",
    description:
      "Comprehensive program covering programming fundamentals, data structures, algorithms, and software development methodologies.",
    achievements: [
      "Dean's List for all semesters",
      "Led a team that won the annual hackathon",
      "Completed a capstone project on mobile application development",
    ],
  },
]

const certifications = [
  {
    name: "AWS Certified Developer - Associate",
    issuer: "Amazon Web Services",
    date: "May 2022",
    url: "#",
  },
  {
    name: "Professional Scrum Master I (PSM I)",
    issuer: "Scrum.org",
    date: "November 2021",
    url: "#",
  },
  {
    name: "React Advanced Concepts",
    issuer: "Frontend Masters",
    date: "March 2021",
    url: "#",
  },
  {
    name: "MongoDB Certified Developer",
    issuer: "MongoDB University",
    date: "January 2020",
    url: "#",
  },
]
