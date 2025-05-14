import { getToken, logout } from "@/services/session";
const API_URL = process.env.API_URL;

interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

function buildUrl(path: string, params?: QueryParams): string {
  if (!params) return path;

  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  const url = queryString ? `${path}?${queryString}` : path;

  return url;
}

async function fetchWithAuth<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  if (!token) {
    // log out user
    logout();
  }

  console.log(path);

  const res = await fetch(`${API_URL}/${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message) || "API request failed";
  }

  return res.json();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const api = {
  get: <T>(url: string, params?: QueryParams) =>
    fetchWithAuth<T>(buildUrl(url, params), { method: "GET" }),
  post: <T>(url: string, body: any) =>
    fetchWithAuth<T>(url, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(url: string, body: any) =>
    fetchWithAuth<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(url: string) => fetchWithAuth<T>(url, { method: "DELETE" }),
};
