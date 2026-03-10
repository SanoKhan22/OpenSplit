import { type ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Plus } from "lucide-react";

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  position?: "bottom-right" | "bottom-left";
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ icon, position = "bottom-right", className, children, ...props }, ref) => {
    const positionStyles = {
      "bottom-right": "bottom-6 right-6",
      "bottom-left": "bottom-6 left-6",
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          "fixed z-50 flex items-center justify-center w-14 h-14 rounded-full bg-brand-yellow text-black shadow-lg shadow-brand-yellow/30 hover:scale-110 hover:shadow-2xl hover:shadow-brand-yellow/50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
          positionStyles[position],
          className,
        )}
        {...props}
      >
        {icon || <Plus className="w-6 h-6" />}
        {children}
      </button>
    );
  },
);

FloatingActionButton.displayName = "FloatingActionButton";
