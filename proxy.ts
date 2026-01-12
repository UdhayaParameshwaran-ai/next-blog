import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { encodedKey } from "./lib/session";

const protectedRoutes = ["/dashboard"];

async function verifyToken(token: string) {
  return jwtVerify(token, encodedKey, {
    algorithms: ["HS256"],
  });
}

export default async function Proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const requestedPathname = request.nextUrl.pathname;
  const isProtuctedRoute = protectedRoutes.includes(requestedPathname);

  //No tokens means redirecting signin
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  //Access Token exists means verifying it
  if (accessToken) {
    try {
      const { payload } = await verifyToken(accessToken);
      if (isProtuctedRoute && payload.userRole !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
      return NextResponse.next();
    } catch (err) {
      console.log("Expired or invalid access Token", err);
    }
  }

  //If we are here, accessToken is missing or invalid. Check Refresh Token.
  if (refreshToken) {
    try {
      const { payload } = await verifyToken(refreshToken);
      // Check role even during refresh to prevent unauthorized access
      if (isProtuctedRoute && payload.userRole !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      const refreshUrl = new URL("/api/refresh", request.url);
      refreshUrl.searchParams.set(
        "redirect",
        requestedPathname + request.nextUrl.search
      );
      return NextResponse.redirect(refreshUrl);
    } catch (err) {
      console.log("Error while validating refresh token", err);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // 4. Catch-all: Secure by default
  return NextResponse.redirect(new URL("/signin", request.url));
}

export const config = {
  matcher: [
    "/((?!signin|signup|api/refresh|unauthorized|_next/static|_next/image|favicon.ico).*)",
  ],
};
