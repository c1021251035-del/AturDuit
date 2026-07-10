"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants: Record<string, string> = {
      default:
        "border-transparent bg-primary text-primary-foreground",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground",
      outline: "text-foreground",
      success:
        "border-transparent bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400",
      warning:
        "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400",
    };
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
