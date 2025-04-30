import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Book } from "@/types/books";
import { Star, StarHalf } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface BookReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
}

export function BookReviewModal({
  isOpen,
  onClose,
  book,
}: BookReviewModalProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-5 w-5 fill-current text-yellow-500"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="h-5 w-5 fill-current text-yellow-500" />
      );
    }

    return stars;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{book.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(book.rating)}</div>
            <span className="text-lg font-medium">
              {book.rating.toFixed(1)}/10
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">My Review</h3>
            <Textarea
              value={book.review || ""}
              readOnly
              className="min-h-[200px] resize-none"
            />
          </div>

          <div className="flex justify-end">
            <a
              href={`https://www.goodreads.com/book/isbn/${book.isbn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline"
            >
              View on Goodreads
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
