import { type HTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Card } from "./card";

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "yellow" | "purple" | "neutral";
}

const colorStyles = {
  yellow: "bg-brand-yellow/10 border-brand-yellow/20 text-brand-yellow",
  purple: "bg-brand-purple/10 border-brand-purple/20 text-brand-purple",
  neutral: "bg-bg-secondary border-border text-text-primary",
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  color = "neutral",
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      padded
      className={twMerge("relative overflow-hidden", colorStyles[color], className)}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div
              className={twMerge(
                "mt-2 text-xs font-semibold",
                trend.isPositive ? "text-success" : "text-danger",
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {icon && <div className="text-2xl opacity-50">{icon}</div>}
      </div>
    </Card>
  );
}
