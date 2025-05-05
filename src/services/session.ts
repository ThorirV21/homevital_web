"use server";

import { sessionOptions, SessionData } from "@/config/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const ironSession = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  return {
    isLoggedIn: ironSession.isLoggedIn,
    userId: ironSession.userId,
    user: ironSession.user,
    token: ironSession.token,
  };
}

export async function saveSession(session: SessionData): Promise<void> {
  const cookieStore = await cookies();
  const ironSession = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );
  ironSession.isLoggedIn = session.isLoggedIn;
  ironSession.userId = session.userId;
  ironSession.user = session.user;
  ironSession.token = session.token;
  await ironSession.save();
}

export const logout = async () => {
  //await saveSession({ isLoggedIn: false, userId: undefined });
  const cookieStore = await cookies();
  cookieStore.delete(sessionOptions.cookieName);

  redirect("/login");
};

export const getToken = async () => {
  const session = await getSession();

  console.log("Getting token from session", session);

  return session.token;
};
