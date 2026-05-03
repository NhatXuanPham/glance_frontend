import api, { buildApiUrl } from "../../libs/configApi";
import { deleteCookie, setCookie } from "../../libs/cookies";

export type RegisterRequest = {
  display_name: string;
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type RefreshTokenResponse = {
  access_token: string;
  expires_at: string;
};

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function setAuthTokens(tokens: {
  accessToken: string;
  refreshToken?: string;
}) {
  if (typeof window === "undefined") return;
  setCookie(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) setCookie(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
}

export async function register(payload: RegisterRequest): Promise<void> {
  await api.post("api/v1/register", payload);
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const body = new URLSearchParams({
    username: payload.username,
    password: payload.password,
  });
  return api.post<LoginResponse>("api/v1/login", body);
}

export async function refreshToken(
  payload: RefreshTokenRequest,
): Promise<RefreshTokenResponse> {
  return api.post<RefreshTokenResponse>("api/v1/refreshtoken", payload);
}

export function getGoogleLoginUrl(): string {
  return buildApiUrl("api/v1/google/login");
}

export type GoogleExchangeRequest = {
  code: string;
};

export async function googleExchange(
  payload: GoogleExchangeRequest,
): Promise<LoginResponse> {
  return api.post<LoginResponse>("api/v1/google/exchange", payload);
}
