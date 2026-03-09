import { apiPost } from "@/lib/api";

const TOKEN_KEY = "os_access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(
  email: string,
  password: string,
): Promise<{ error: string | null }> {
  const res = await apiPost<{ access_token: string }>("/api/auth/login", { email, password });
  if (res.error) return { error: res.error };
  setToken(res.data!.access_token);
  return { error: null };
}

export async function register(
  email: string,
  password: string,
  display_name?: string,
): Promise<{ error: string | null }> {
  const res = await apiPost<{ access_token: string }>("/api/auth/register", {
    email,
    password,
    display_name,
  });
  if (res.error) return { error: res.error };
  setToken(res.data!.access_token);
  return { error: null };
}

export async function loginAsGuest(displayName?: string): Promise<{ error: string | null }> {
  const res = await apiPost<{ access_token: string }>("/api/auth/guest", {
    display_name: displayName,
  });
  if (res.error) return { error: res.error };
  setToken(res.data!.access_token);
  return { error: null };
}

export function logout(): void {
  clearToken();
  window.location.href = "/";
}
