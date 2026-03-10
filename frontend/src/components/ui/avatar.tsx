import { type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({ src, alt, fallback, size = "md", className, ...props }: AvatarProps) {
  const initials = fallback || alt?.slice(0, 2).toUpperCase() || "??";

  return (
    <div
      className={twMerge(
        "relative inline-flex items-center justify-center rounded-full bg-brand-purple text-white font-semibold overflow-hidden border-2 border-border",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || "Avatar"} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
  users: Array<{ name: string; avatar?: string }>;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function AvatarStack({ users, max = 3, size = "md", className, ...props }: AvatarStackProps) {
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className={twMerge("flex items-center -space-x-3", className)} {...props}>
      {displayUsers.map((user, index) => (
        <Avatar
          key={index}
          src={user.avatar}
          alt={user.name}
          fallback={user.name.slice(0, 2).toUpperCase()}
          size={size}
          className="ring-2 ring-bg-primary"
        />
      ))}
      {remaining > 0 && (
        <div
          className={twMerge(
            "relative inline-flex items-center justify-center rounded-full bg-bg-tertiary text-text-secondary font-semibold border-2 border-border ring-2 ring-bg-primary",
            sizeStyles[size],
          )}
        >
          <span className="text-xs">+{remaining}</span>
        </div>
      )}
    </div>
  );
}
