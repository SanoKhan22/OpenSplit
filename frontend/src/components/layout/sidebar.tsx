"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Receipt, Users, BarChart3, User, LogOut } from "lucide-react";
import { twMerge } from "tailwind-merge";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Settlements", href: "/settlements", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-secondary border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center">
            <span className="text-2xl font-bold text-black">O</span>
          </div>
          <span className="text-xl font-bold text-text-primary">OpenSplit</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={twMerge(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-brand-yellow/10 text-brand-yellow font-semibold"
                  : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
              )}
            >
              <Icon
                className={twMerge(
                  "w-5 h-5 transition-transform duration-200",
                  isActive && "scale-110",
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-text-secondary hover:bg-bg-tertiary hover:text-danger transition-all duration-200"
          onClick={() => {
            // TODO: Implement logout
            console.log("Logout clicked");
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
