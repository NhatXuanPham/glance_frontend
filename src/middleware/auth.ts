import { redirect } from "react-router";
import { store } from "@/store";
import { fetchCurrentUser } from "@/store/userSlice";
import { getCookie } from "@/libs/cookies";

function hasAuthToken() {
  return Boolean(getCookie("access_token") || getCookie("refresh_token"));
}

async function resolveCurrentUser() {
  const currentUser = store.getState().user.data;
  if (currentUser) return currentUser;

  if (!hasAuthToken()) return null;

  const resultAction = await store.dispatch(fetchCurrentUser());
  if (fetchCurrentUser.fulfilled.match(resultAction) && resultAction.payload) {
    return resultAction.payload;
  }

  return null;
}

export async function requireAuthLoader() {
  if (!hasAuthToken()) {
    throw redirect("/login");
  }

  const currentUser = await resolveCurrentUser();
  if (currentUser) {
    return null;
  }

  throw redirect("/login");
}

export async function requireGuestLoader() {
  if (!hasAuthToken()) {
    return null;
  }

  const currentUser = await resolveCurrentUser();
  if (currentUser) {
    const username = currentUser.username;
    throw redirect(username ? `/${username}` : "/login");
  }

  return null;
}

export async function rootRedirectLoader() {
  if (!hasAuthToken()) {
    throw redirect("/login");
  }

  const currentUser = await resolveCurrentUser();
  const username = currentUser?.username;
  throw redirect(username ? `/${username}` : "/login");
}
