import { NextResponse, NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData } from "./config/session";
import { sessionOptions } from "./config/session";
import { cookies } from "next/headers";
import { isTokenValid, shouldRefreshToken } from "./lib/utils";
import { login } from "./services/api";

export default async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  if (
    session.token &&
    isTokenValid(session.token) &&
    request.nextUrl.pathname === "/login"
  ) {
    console.log("Redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard/clients", request.url));
  }

  if (
    session.token &&
    !isTokenValid(session.token) &&
    request.nextUrl.pathname !== "/login"
  ) {
    cookieStore.delete(sessionOptions.cookieName);
    session.isLoggedIn = false;
    session.user = undefined;
    session.userId = undefined;
    await session.save();
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session.token && shouldRefreshToken(session.token)) {
    await login({ kennitala: session.user?.ssn || "" });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
