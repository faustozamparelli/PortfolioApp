"use client";

import { Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TVReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  show: {
    title?: string;
    creator?: string;
    firstAirYear?: number | null;
    rating: number; // Required field
    review?: string;
    overview?: string;
    posterUrl?: string;
    isTopShow?: boolean;
  };
}

export function TVReviewModal({ isOpen, onClose, show }: TVReviewModalProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-${i}`} className="w-4 h-4 fill-primary text-primary" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="w-4 h-4 fill-primary text-primary"
        />
      );
    }

    return stars;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {show.title || "Loading..."}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-[2/3]">
            <img
              src={show.posterUrl || "/placeholder.svg"}
              alt={show.title || "TV show poster"}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Overview</h3>
              <p className="text-muted-foreground">{show.overview}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">My Rating</h3>
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(show.rating)}</div>
                <span className="text-lg font-medium">
                  {show.rating.toFixed(1)}/10
                </span>
              </div>
            </div>
            {show.review && (
              <div>
                <h3 className="text-lg font-semibold">My Review</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {show.review}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
