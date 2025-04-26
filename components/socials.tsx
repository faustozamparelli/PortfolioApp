import type React from "react"
import Link from "next/link"
import { Mail, Github, Linkedin, Twitter, Instagram, Music } from "lucide-react"

type SocialLink = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  username: string
}

type SocialsProps = {
  className?: string
  iconClassName?: string
  showLabels?: boolean
  direction?: "row" | "column"
}

export default function Socials({
  className = "",
  iconClassName = "h-5 w-5",
  showLabels = false,
  direction = "row",
}: SocialsProps) {
  const socialLinks: SocialLink[] = [
    {
      name: "Email",
      href: "mailto:your.email@example.com",
      icon: Mail,
      username: "your.email@example.com",
    },
    {
      name: "GitHub",
      href: "https://github.com/yourusername",
      icon: Github,
      username: "yourusername",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/yourusername",
      icon: Linkedin,
      username: "yourusername",
    },
    {
      name: "X",
      href: "https://x.com/yourusername",
      icon: Twitter,
      username: "@yourusername",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/yourusername",
      icon: Instagram,
      username: "@yourusername",
    },
    {
      name: "Spotify",
      href: "https://open.spotify.com/user/yourusername",
      icon: Music,
      username: "yourusername",
    },
  ]

  return (
    <div
      className={`flex ${
        direction === "row" ? "flex-row gap-4 flex-wrap" : "flex-col gap-2"
      } items-center ${className}`}
    >
      {socialLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ${
            direction === "row" ? "" : "w-full"
          }`}
        >
          <link.icon className={iconClassName} />
          {showLabels && <span>{link.username}</span>}
          <span className="sr-only">{link.name}</span>
        </Link>
      ))}
    </div>
  )
}
