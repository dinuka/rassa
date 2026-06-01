import * as React from "react";

import { cn } from "../lib/cn";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showValue?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "success" | "warning" | "destructive";
}

const sizeClasses = {
  sm: "h-1.5",
  default: "h-2.5",
  lg: "h-4",
};

const variantClasses = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

function Progress({
  className,
  value = 0,
  max = 100,
  showValue = false,
  size = "default",
  variant = "default",
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <div
        className={cn(
          "bg-secondary relative w-full overflow-hidden rounded-full",
          sizeClasses[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            variantClasses[variant],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="text-muted-foreground min-w-[3ch] text-sm font-medium">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

export { Progress };
