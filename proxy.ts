import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/dashboard"];
export default async function Proxy(request: NextRequest) {
  //checking user isLoggedIn?
  const cookie = (await cookies()).get("session")?.value;
  const cookieSession = await decrypt(cookie);
  if (!cookieSession?.userId) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }

  //checking if user requesting protectd route
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  if (isProtectedRoute && cookieSession?.userId != 5) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!signin|signup|_next/static|_next/image|favicon.ico).*)"],
};
