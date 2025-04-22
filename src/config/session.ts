import { SessionOptions } from "iron-session";

export interface User {
  id: string;
  name: string;
  phone: string;
  status: string;
  role: string;
  groups: number[];
}

export interface SessionData {
  userId?: string;
  isLoggedIn: boolean;
  user?: User;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "homevital-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};
