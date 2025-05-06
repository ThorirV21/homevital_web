import { getToken } from "@/services/session";
const API_URL = process.env.API_URL;

async function fetchWithAuth<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  if (!token) {
    throw new Error("No token found");
  }

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
    console.log(error);
    //throw new Error(error.message) || "API request failed";
  }

  return res.json();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const api = {
  get: <T>(url: string) => fetchWithAuth<T>(url, { method: "GET" }),
  post: <T>(url: string, body: any) =>
    fetchWithAuth<T>(url, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(url: string, body: any) =>
    fetchWithAuth<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(url: string) => fetchWithAuth<T>(url, { method: "DELETE" }),
};
