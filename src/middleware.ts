import { NextResponse, NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData } from "./config/session";
import { sessionOptions } from "./config/session";
import { cookies } from "next/headers";
import { isTokenValid, shouldRefreshToken } from "./lib/utils";
import { login } from "./services/api";
import { loginSchema } from "./services/schemas";
import { z } from "zod";

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", "is");

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

  if (request.nextUrl.pathname !== "/login") {
    if (session.token && !isTokenValid(session.token)) {
      console.log("Token is invalid, deleting cookie");
      cookieStore.delete(sessionOptions.cookieName);
      await session.save();
      return NextResponse.redirect(new URL("/login", request.url));
    } else if (session.token && shouldRefreshToken(session.token)) {
      console.log("Token is valid, refreshing token");
      console.log(session.user?.ssn);
      const data: z.infer<typeof loginSchema> = {
        kennitala: session.user?.ssn || "",
      };
      if (data.kennitala === "") {
        console.log("Kennitala is empty, deleting cookie");
        cookieStore.delete(sessionOptions.cookieName);
        await session.save();
        return NextResponse.redirect(new URL("/login", request.url));
      }
      const newSession = await login(data);
      if (newSession) {
        return response;
      } else {
        cookieStore.delete(sessionOptions.cookieName);
        await session.save();
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } else if (session.token && !isTokenValid(session.token)) {
      console.log("Token is invalid, deleting cookie");
      cookieStore.delete(sessionOptions.cookieName);
      await session.save();
      return NextResponse.redirect(new URL("/login", request.url));
    } else if (!session) {
      console.log("No token, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
