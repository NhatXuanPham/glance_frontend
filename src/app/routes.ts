import { createBrowserRouter } from "react-router";
import { GoogleCallbackPage } from "./pages/google-callback";
import { Home } from "./pages/home";
import { LoginPage } from "./pages/login";
import { MePage } from "./pages/me";
import { NotFoundPage } from "./pages/not-found-page";
import { RegisterPage } from "./pages/register";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Home,
    },
    {
      path: "/login",
      Component: LoginPage,
    },
    {
      path: "/oauth/google/callback",
      Component: GoogleCallbackPage,
    },
    {
      path: "/register",
      Component: RegisterPage,
    },
    {
      path: "/me",
      Component: MePage,
    },
    {
      path: "*",
      Component: NotFoundPage,
    },
  ],
);