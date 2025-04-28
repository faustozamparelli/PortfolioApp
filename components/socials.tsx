import type React from "react";
import Link from "next/link";
import { Mail, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

// Custom X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Custom Spotify icon component
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
  >
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

type SocialLink = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  username: string;
};

type SocialsProps = {
  className?: string;
  iconClassName?: string;
  showLabels?: boolean;
  direction?: "row" | "column";
};

export default function Socials({
  className = "",
  iconClassName = "h-5 w-5",
  showLabels = false,
  direction = "row",
}: SocialsProps) {
  const socialLinks: SocialLink[] = [
    {
      name: "WhatsApp",
      href: "https://wa.me/+393457606502",
      icon: FaWhatsapp,
      username: "faustozamparelli",
    },
    {
      name: "Email",
      href: "mailto:fausto.zamparelli@gmail.com",
      icon: Mail,
      username: "fausto.zamparelli@gmail.com",
    },
    // {
    //   name: "GitHub",
    //   href: "https://github.com/faustozamparelli",
    //   icon: Github,
    //   username: "faustozamparelli",
    // },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/fausto-zamparelli-183387245/",
      icon: Linkedin,
      username: "faustozamparelli",
    },
    {
      name: "X",
      href: "https://x.com/faustozampa",
      icon: XIcon,
      username: "@faustozampa",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/faustozamparelli",
      icon: Instagram,
      username: "@faustozamparelli",
    },
    {
      name: "Spotify",
      href: "https://open.spotify.com/user/fausto.zamparelli-it?si=c3bf5ab0b4c5471",
      icon: SpotifyIcon,
      username: "faustozamparelli",
    },
  ];

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
  );
}
