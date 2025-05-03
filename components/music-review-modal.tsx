"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, StarHalf, ExternalLink } from "lucide-react";
import { MusicItem } from "@/utils/spotifyApi";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function MusicReviewModal({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: MusicItem;
}) {
  const [rating, setRating] = useState(item.rating || 7);
  const [review, setReview] = useState(item.review || "");

  // Helper function to get rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 9) return "text-green-500 dark:text-green-400";
    if (rating >= 7) return "text-blue-500 dark:text-blue-400";
    if (rating >= 5) return "text-yellow-500 dark:text-yellow-400";
    if (rating >= 3) return "text-orange-500 dark:text-orange-400";
    return "text-red-500 dark:text-red-400";
  };

  // Helper function to determine item type display name
  const getItemTypeName = () => {
    switch (item.type) {
      case "track":
        return "Track";
      case "album":
        return "Album";
      case "artist":
        return "Artist";
      case "playlist":
        return "Playlist";
      default:
        return "Music";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {item.name || "Music Review"}
          </DialogTitle>
          <DialogDescription>
            Review this {getItemTypeName().toLowerCase()} and save your thoughts
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Left side - Image and details */}
          <div className="md:col-span-1">
            <div className="relative aspect-square w-full rounded-md overflow-hidden mb-4">
              {item.coverUrl ? (
                <Image
                  src={item.coverUrl}
                  alt={item.name || "Music cover"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </div>

            <h3 className="font-bold text-lg line-clamp-2">{item.name}</h3>
            {item.artists && item.artists.length > 0 && (
              <p className="text-muted-foreground mt-1">
                {item.artists.join(", ")}
              </p>
            )}

            {item.genres && item.genres.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold mb-1">Genres</h4>
                <div className="flex flex-wrap gap-1">
                  {item.genres.map((genre, i) => (
                    <span
                      key={i}
                      className="text-xs bg-muted px-2 py-1 rounded-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-1 mt-2"
                asChild
              >
                <a
                  href={item.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open in Spotify</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Right side - Review form */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rating">
                Rating:
                <span className={`ml-2 font-bold ${getRatingColor(rating)}`}>
                  {rating.toFixed(1)}/10
                </span>
              </Label>
              <Slider
                id="rating"
                min={0}
                max={10}
                step={0.1}
                value={[rating]}
                onValueChange={(value) => setRating(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Write your thoughts about this music..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  // In a real implementation, this would save to a database
                  // For now, just close the modal
                  // You could also pass an onSave callback prop to handle saving
                  onClose();
                }}
              >
                Save Review
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
