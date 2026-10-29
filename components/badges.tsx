import { cn } from "@/lib/utils"
import { BadgeCheck, Star } from "lucide-react"

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary",
        className,
      )}
    >
      <BadgeCheck className="size-3.5" />
      Verified
    </span>
  )
}

export function Rating({
  rating,
  reviews,
  className,
}: {
  rating: number
  reviews?: number
  className?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", className)}>
      <Star className="size-4 fill-chart-4 text-chart-4" />
      <span className="text-foreground">{rating.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-muted-foreground">({reviews})</span>
      )}
    </span>
  )
}

const availabilityStyles: Record<string, string> = {
  "Available Now": "bg-success/12 text-success",
  "Available Today": "bg-success/12 text-success",
  "Available Tomorrow": "bg-chart-4/15 text-chart-4",
  Booked: "bg-muted text-muted-foreground",
}

export function AvailabilityBadge({
  availability,
  className,
}: {
  availability: string
  className?: string
}) {
  const isLive = availability === "Available Now" || availability === "Available Today"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        availabilityStyles[availability] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      <span className="relative flex size-2">
        {isLive && (
          <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-success" />
        )}
        <span
          className={cn(
            "relative inline-flex size-2 rounded-full",
            isLive ? "bg-success" : "bg-current",
          )}
        />
      </span>
      {availability}
    </span>
  )
}
