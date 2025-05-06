import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseJwt = (token: string) => {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  if (typeof window === "undefined") {
    return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  }

  return JSON.parse(window.atob(base64));
};

export const isTokenExpired = (token: string) => {
  const decodedToken = parseJwt(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

export const encodeJwt = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const encodedToken = jwt.sign(token, process.env.JWT_SECRET);
  return encodedToken;
};

export const shouldRefreshToken = (token: string) => {
  const decodedToken = parseJwt(token);
  const currentTime = Date.now() / 1000;
  const threshold = 60 * 10; // 2 minutes
  return decodedToken.exp - currentTime < threshold;
};

export const isTokenValid = (token: string) => {
  const decodedToken = parseJwt(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

export const getStatusText = (status: string) => {
  let statusText = "";
  if (status.toLowerCase() === "critical") {
    statusText = "Hættuleg hækkun á mælingu";
  } else if (status.toLowerCase() === "high") {
    statusText = "Hækkun á mælingu";
  } else if (status.toLowerCase() === "raised") {
    statusText = "Rétt yfir mörkum";
  } else if (status.toLowerCase() === "normal") {
    statusText = "Í lagi";
  } else if (status.toLowerCase() === "low") {
    statusText = "Rétt undir mörkum";
  }
  return statusText;
};
