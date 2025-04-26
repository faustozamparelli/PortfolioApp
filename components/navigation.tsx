"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Updated order: Home, Projects, Resume, Roadmap, Movies, Music, Books, Hobbies
  const routes = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Resume", path: "/resume" },
    { name: "Roadmap", path: "/roadmap" },
    { name: "Movies", path: "/movies" },
    { name: "Music", path: "/music" },
    { name: "Books", path: "/books" },
    { name: "Hobbies", path: "/hobbies" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[2000px] mx-auto px-4">
        <div className="flex h-16 items-center">
          <Link href="/" className="font-bold text-xl pl-4">
            Your Name
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-auto mr-0">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {route.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-b">
            <nav className="py-4 flex flex-col gap-2">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary ${
                    pathname === route.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
