import { deleteCookie, getCookie, setCookie } from "./cookies";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export function buildApiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie("access_token");
}

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: Error) => void;
}> = [];

function flushQueue(token: string | null) {
  if (token) {
    refreshQueue.forEach(({ resolve }) => resolve(token));
  } else {
    refreshQueue.forEach(({ reject }) =>
      reject(new Error("Session expired. Please log in again."))
    );
  }
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getCookie("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(buildApiUrl("api/v1/refreshtoken"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const newToken = data.access_token ?? data.token ?? data.accessToken ?? null;
    if (newToken) setCookie("access_token", newToken);
    return newToken;
  } catch {
    return null;
  }
}

function clearAuth() {
  if (typeof window === "undefined") return;
  deleteCookie("access_token");
  deleteCookie("refresh_token");
  window.dispatchEvent(new Event("auth:unauthorized"));
}

async function getRefreshedToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    }).catch(() => null);
  }

  isRefreshing = true;

  try {
    const newToken = await refreshAccessToken();
    flushQueue(newToken);
    return newToken;
  } catch {
    flushQueue(null);
    return null;
  } finally {
    isRefreshing = false;
  }
}

async function request<T = unknown>(
  path: string,
  method: HttpMethod,
  data?: unknown,
  options: RequestInit = {},
): Promise<T> {
  const url = buildApiUrl(path);

  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;
  const isUrlEncoded =
    typeof URLSearchParams !== "undefined" && data instanceof URLSearchParams;
  const isStringBody = typeof data === "string";
  const shouldSetJsonContentType =
    data !== undefined && !isFormData && !isUrlEncoded && !isStringBody;

  const buildHeaders = (token: string | null): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (shouldSetJsonContentType && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
    if (isUrlEncoded && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const buildInit = (token: string | null): RequestInit => {
    const init: RequestInit = {
      ...options,
      method,
      headers: buildHeaders(token),
    };
    if (data !== undefined && method !== "GET") {
      if (isFormData || isUrlEncoded) {
        init.body = data as BodyInit;
      } else if (isStringBody) {
        init.body = data;
      } else {
        init.body = JSON.stringify(data);
      }
    }
    return init;
  };

  const parseResponse = async (res: Response): Promise<T> => {
    if (res.status === 204) return undefined as T;
    const contentType = res.headers.get("Content-Type") ?? "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as T;
    }
    return (await res.text()) as unknown as T;
  };

  let response = await fetch(url, buildInit(getToken()));

  if (response.status === 401) {
    if (typeof window === "undefined") {
      throw new Error("Unauthorized");
    }

    const newToken = await getRefreshedToken();

    if (!newToken) {
      clearAuth();
      throw new Error("Session expired. Please log in again.");
    }

    response = await fetch(url, buildInit(newToken));

    if (response.status === 401) {
      clearAuth();
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || response.statusText);
  }

  return parseResponse(response);
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