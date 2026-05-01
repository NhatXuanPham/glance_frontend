import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { NotFoundPage } from "./pages/not-found-page";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Home,
    },
    {
      path: "*",
      Component: NotFoundPage,
    },
  ],
);