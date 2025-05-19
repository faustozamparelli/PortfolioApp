"use client";

import { Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ArtistReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: {
    name?: string;
    genres?: string[];
    rating: number; // Required field
    review?: string;
    coverUrl?: string;
    popularity?: number;
    spotifyUrl?: string;
  };
}

export function ArtistReviewModal({
  isOpen,
  onClose,
  artist,
}: ArtistReviewModalProps) {
  // Round to nearest 0.5
  const roundedRating = Math.round(artist.rating * 2) / 2;
  const fullStars = Math.min(Math.floor(roundedRating), 10); // Cap at 10 for regular stars
  const hasHalfStar = roundedRating % 1 !== 0 && roundedRating <= 10;
  const emptyStars = Math.max(0, 10 - Math.ceil(roundedRating));
  const hasExtraStar = artist.rating >= 11;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {artist.name || "Loading..."}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
            <img
              src={artist.coverUrl || "/placeholder.svg"}
              alt={artist.name || "Artist image"}
              className="object-contain w-full h-full rounded-md"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <p className="text-xl text-muted-foreground mb-4">
                {artist.genres?.join(", ") || "Unknown Genre"}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {/* Full stars */}
                  {[...Array(fullStars)].map((_, i) => (
                    <Star
                      key={`full-${i}`}
                      className="w-6 h-6 text-yellow-400 fill-current"
                    />
                  ))}

                  {/* Half star if needed */}
                  {hasHalfStar && (
                    <div className="relative">
                      <Star className="w-6 h-6 text-gray-200" />
                      <StarHalf className="w-6 h-6 text-yellow-400 fill-current absolute top-0 left-0" />
                    </div>
                  )}

                  {/* Empty stars */}
                  {[...Array(emptyStars)].map((_, i) => (
                    <Star
                      key={`empty-${i}`}
                      className="w-6 h-6 text-gray-200"
                    />
                  ))}

                  {/* Extra star for 11+ ratings */}
                  {hasExtraStar && (
                    <Star className="w-6 h-6 text-red-500 fill-current ml-2" />
                  )}
                </div>
                <span className="text-xl font-medium text-primary">
                  {artist.rating.toFixed(1)}/10
                </span>
              </div>
            </div>
            <div className="space-y-6">
              {artist.review && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">My Review</h3>
                  <div
                    className="text-base leading-relaxed whitespace-pre-line [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-primary/50 [&_a]:hover:decoration-primary [&_a]:transition-colors"
                    dangerouslySetInnerHTML={{ __html: artist.review }}
                  />
                </div>
              )}
              {artist.popularity !== undefined && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Popularity</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {artist.popularity}/100 on Spotify
                  </p>
                </div>
              )}
              {artist.spotifyUrl && (
                <div className="mt-4">
                  <Button asChild>
                    <a
                      href={artist.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Spotify
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
