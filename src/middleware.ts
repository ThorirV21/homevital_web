import { NextResponse, NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData } from "./config/session";
import { sessionOptions } from "./config/session";
import { cookies } from "next/headers";

export default async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(protected)/:path*", "/dashboard/:path*"],
};
