import { createBrowserRouter } from "react-router";
import { GoogleCallbackPage } from "./pages/google-callback";
import { Home } from "./pages/home";
import { LoginPage } from "./pages/login";
import { MePage } from "./pages/me";
import { NotFoundPage } from "./pages/not-found-page";
import { RegisterPage } from "./pages/register";
import {
  requireAuthLoader,
  requireGuestLoader,
  rootRedirectLoader,
} from "@/middleware/auth";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Home,
      loader: rootRedirectLoader,
    },
    {
      path: "/login",
      Component: LoginPage,
      loader: requireGuestLoader,
    },
    {
      path: "/oauth/google/callback",
      Component: GoogleCallbackPage,
    },
    {
      path: "/register",
      Component: RegisterPage,
      loader: requireGuestLoader,
    },
    {
      path: "/me",
      Component: MePage,
      loader: requireAuthLoader,
    },
    {
      path: "*",
      Component: NotFoundPage,
    },
  ],
);