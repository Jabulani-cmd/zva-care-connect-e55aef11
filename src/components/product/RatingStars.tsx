import { Star } from "lucide-react";

export function RatingStars({ rating, reviews, size = "sm" }: { rating: number; reviews?: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={`${s} ${i <= Math.round(rating) ? "fill-warning text-warning" : "text-border"}`} />
        ))}
      </div>
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span>({reviews})</span>}
    </div>
  );
}