import { type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  className,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div
      className={twMerge("shimmer", variantStyles[variant], className)}
      style={{ width, height: height || (variant === "circular" ? width : undefined) }}
      {...props}
    />
  );
}

// Preset skeleton components for common use cases
export function ExpenseCardSkeleton() {
  return (
    <div className="p-4 border border-border rounded-xl bg-bg-secondary">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
        <Skeleton variant="text" width="80px" height="24px" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-5 border border-border rounded-xl bg-bg-secondary">
      <div className="space-y-3">
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="70%" height="32px" />
        <Skeleton variant="text" width="30%" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="space-y-3">
        <ExpenseCardSkeleton />
        <ExpenseCardSkeleton />
        <ExpenseCardSkeleton />
        <ExpenseCardSkeleton />
      </div>
    </div>
  );
}
