import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "./definitions";
import { cookies } from "next/headers";
import { db } from "..";
import { refreshTokenTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const secretKey = process.env.SESSION_SECRET;
export const encodedKey = new TextEncoder().encode(secretKey);

export async function signToken(
  payload: any,
  secret: Uint8Array,
  expiry: string
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(secret);
}

export async function decrypt(token: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to Verify session");
  }
}

export async function createSession(
  userId: number,
  userRole: "admin" | "user"
) {
  const accessToken = await signToken({ userId, userRole }, encodedKey, "15m");
  const refreshToken = await signToken({ userId, userRole }, encodedKey, "7d");
  const expiresAtDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  //Storing Refresh Token in DB
  const refreshTokenData = await db.insert(refreshTokenTable).values({
    userId: userId,
    token: refreshToken,
    expiresAt: expiresAtDate,
  });

  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, //15mins
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, //7days
  });
}

export async function deleteCookieSession() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const deletedToken = await db
      .delete(refreshTokenTable)
      //@ts-ignore
      .where(eq(refreshTokenTable.token, refreshToken))
      .returning();
    if (deletedToken.length == 0)
      console.log("Failed to deleted the refresh token in DB");
    cookieStore.delete("refreshToken");
    cookieStore.delete("accessToken");
    return;
  } catch (err) {
    console.log("Error while deleting session", err);
  }
}
