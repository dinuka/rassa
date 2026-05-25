import * as React from "react";

import { cn } from "../lib/cn";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "default" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  default: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

function Avatar({ className, src, alt, fallback, size = "default", ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const initials = React.useMemo(() => {
    if (fallback) return fallback.slice(0, 2).toUpperCase();
    if (alt) {
      const parts = alt.split(" ");
      return parts
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();
    }
    return "?";
  }, [fallback, alt]);

  return (
    <div
      className={cn(
        "bg-muted relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="aspect-square h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="from-primary/20 to-primary/40 text-primary flex h-full w-full items-center justify-center bg-gradient-to-br font-medium">
          {initials}
        </span>
      )}
    </div>
  );
}

export { Avatar };
