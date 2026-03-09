/**
 * API client — all calls go through the backend, never directly to external services.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface ApiResponse<T> {
  data: T | null;
  message: string;
  error: string | null;
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("os_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const json = await res.json();
  if (!res.ok) return { data: null, message: "", error: json.detail ?? "Request failed" };
  return json as ApiResponse<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, message: "", error: json.detail ?? "Request failed" };
  return json as ApiResponse<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, message: "", error: json.detail ?? "Request failed" };
  return json as ApiResponse<T>;
}

export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const json = await res.json();
  if (!res.ok) return { data: null, message: "", error: json.detail ?? "Request failed" };
  return json as ApiResponse<T>;
}
