import { type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  hover?: boolean;
}

export function Card({ padded = true, hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        "rounded-xl bg-bg-secondary border border-border",
        padded && "p-5",
        hover && "hover:scale-105 hover:shadow-2xl hover:shadow-brand-yellow/10 transition-all duration-200 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
