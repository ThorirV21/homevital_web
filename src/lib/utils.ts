import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseJwt = (token: string) => {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(window.atob(base64));
};

export const isTokenExpired = (token: string) => {
  const decodedToken = parseJwt(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};
