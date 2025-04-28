"use client";

import { Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MovieReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: {
    title: string;
    director: string;
    year: number | null;
    rating: number;
    review?: string;
    notes?: string;
    posterUrl: string;
    isTopMovie?: boolean;
  };
}

export function MovieReviewModal({
  isOpen,
  onClose,
  movie,
}: MovieReviewModalProps) {
  // Round to nearest 0.5
  const roundedRating = Math.round(movie.rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;
  const isTopMovie = movie.isTopMovie && movie.rating >= 10;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {movie.title} {movie.year ? `(${movie.year})` : ""}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="object-contain w-full h-full rounded-md"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <p className="text-xl text-muted-foreground mb-4">
                Directed by {movie.director}
              </p>
              <div className="flex items-center gap-3">
                <div className="relative flex">
                  {/* Background stars (translucent) */}
                  <div className="absolute flex">
                    {[...Array(10)].map((_, i) => (
                      <Star key={`bg-${i}`} className="w-6 h-6 text-gray-200" />
                    ))}
                  </div>
                  {/* Foreground stars */}
                  <div className="flex">
                    {[...Array(10)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < fullStars
                            ? "text-yellow-400 fill-current [&>path]:stroke-none"
                            : i === fullStars && hasHalfStar
                            ? "text-transparent"
                            : "text-transparent"
                        }`}
                      />
                    ))}
                    {hasHalfStar && (
                      <StarHalf className="w-6 h-6 text-yellow-400 fill-current [&>path]:stroke-none" />
                    )}
                  </div>
                  {/* Bonus star for top movies */}
                  {isTopMovie && (
                    <Star className="w-6 h-6 text-yellow-400 fill-current [&>path]:stroke-none ml-2" />
                  )}
                </div>
                <span className="text-xl font-medium text-primary">
                  {movie.rating}/10
                </span>
              </div>
            </div>
            <div className="space-y-6">
              {movie.notes && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    About the Movie
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {movie.notes}
                  </p>
                </div>
              )}
              {movie.review && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">My Review</h3>
                  <p className="text-base leading-relaxed whitespace-pre-line">
                    {movie.review}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
