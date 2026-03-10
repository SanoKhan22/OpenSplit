"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { apiGet } from "@/lib/api";
import { getToken, logout } from "@/lib/auth";
import type { User } from "@/types";

interface UseAuthOptions {
  /** Redirect to /login if not authenticated. Default: false */
  required?: boolean;
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

export function useAuth({ required = false }: UseAuthOptions = {}): UseAuthReturn {
  const router = useRouter();
  const token = getToken();

  const { data: user, isLoading } = useSWR<User>(
    token ? "/api/auth/me" : null,
    (url: string) => apiGet<User>(url).then((r) => r.data as User),
    { revalidateOnFocus: false },
  );

  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isLoading && required && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, required, isAuthenticated, router]);

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated,
    logout,
  };
}
