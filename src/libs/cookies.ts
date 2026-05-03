type CookieOptions = {
  path?: string;
  maxAgeSeconds?: number;
  sameSite?: "Lax" | "Strict" | "None";
  secure?: boolean;
};

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`),
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
) {
  if (typeof document === "undefined") return;
  const path = options.path ?? "/";
  const sameSite = options.sameSite ?? "Lax";
  const secure = options.secure ?? window.location.protocol === "https:";

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=${path}; SameSite=${sameSite}`;
  if (options.maxAgeSeconds !== undefined) {
    cookie += `; Max-Age=${options.maxAgeSeconds}`;
  }
  if (secure) cookie += "; Secure";

  document.cookie = cookie;
}

export function deleteCookie(name: string, path = "/") {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(name)}=; Path=${path}; Max-Age=0`;
}
