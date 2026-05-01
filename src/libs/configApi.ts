const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const API_PREFIX = "api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

async function request<T = unknown>(
  path: string,
  method: HttpMethod,
  data?: unknown,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = API_BASE_URL ?? "";

  const url = `${baseUrl.replace(/\/+$/, "")}/${API_PREFIX}/${path.replace(/^\/+/, "")}`;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    ...options,
    method,
    headers,
  };

  if (data !== undefined && method !== "GET") {
    init.body = JSON.stringify(data);
  }

  const response = await fetch(url, init);

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenCRM");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || "Unauthorized");
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || response.statusText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}

/** Build full URL for opening in new tab: prepends VITE_API_BASE_URL if path is relative. */
export function buildFullUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = (API_BASE_URL ?? "").replace(/\/+$/, "") + "/api";
  const normalizedPath = path.replace(/^\/+/, "");
  return base ? `${base}/${normalizedPath}` : path;
}

export const api = {
  get: <T = unknown>(path: string, options?: RequestInit) =>
    request<T>(path, "GET", undefined, options),
  post: <T = unknown>(path: string, data?: unknown, options?: RequestInit) =>
    request<T>(path, "POST", data, options),
  put: <T = unknown>(path: string, data?: unknown, options?: RequestInit) =>
    request<T>(path, "PUT", data, options),
  patch: <T = unknown>(path: string, data?: unknown, options?: RequestInit) =>
    request<T>(path, "PATCH", data, options),
  delete: <T = unknown>(path: string, options?: RequestInit) =>
    request<T>(path, "DELETE", undefined, options),
};

export default api;

