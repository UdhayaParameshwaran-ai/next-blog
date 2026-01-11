import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { encodedKey } from "@/lib/session";
import { db } from "@/index";
import { refreshTokenTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const oldRefreshToken = request.cookies.get("refreshToken")?.value;
  const redirectPath = request.nextUrl.searchParams.get("redirect") || "/";

  if (!oldRefreshToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    //Verify the old token's integrity
    const { payload } = await jwtVerify(oldRefreshToken, encodedKey);
    const userId = payload.userId as number;
    const userRole = payload.userRole;

    const deleted = await db
      .delete(refreshTokenTable)
      .where(eq(refreshTokenTable.token, oldRefreshToken))
      .returning();

    // 2. REPLAY PROTECTION: If nothing was deleted, the token was invalid/already used
    if (deleted.length === 0) {
      console.error("Token replay detected or token doesn't exist");
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const newAccessToken = await new SignJWT({ userId, userRole })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(encodedKey);

    const newRefreshToken = await new SignJWT({ userId, userRole })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedKey);

    await db.insert(refreshTokenTable).values({
      token: newRefreshToken,
      userId: userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    //Set cookies and Redirect
    const response = NextResponse.redirect(new URL(redirectPath, request.url));

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Refresh Error:", error);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}
