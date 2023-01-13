import { useState, useEffect } from "react";
import { API_URL } from "./settings.js";
import { getAuthenticatedStatus } from "./api.js";

export function getLocalToken() {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("fs-token");
  }
  return null;
}

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    getAuthenticatedStatus().then(setAuthenticated);
  }, []);
  return authenticated;
}

export async function login(user, password) {
  const url = `${API_URL}/token`;
  const authBasic = window.btoa(`${user}:${password}`);
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${authBasic}`,
    },
  });
  if (res.ok) {
    const { access_token } = await res.json();
    window.localStorage.setItem("fs-token", access_token);
    return;
  }
  if (res.status >= 400 && res.status < 600) {
    const { error, detail } = await res.json();
    throw new Error(error || detail);
  }
}
