import { type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ padded = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        "rounded-xl bg-zinc-900 border border-zinc-800",
        padded && "p-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
