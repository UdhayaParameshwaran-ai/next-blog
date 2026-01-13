import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "..";
import { refreshTokenTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SessionPayload } from "./definitions";
import bcrypt from "bcrypt";

const secretKey =
  process.env.SESSION_SECRET ??
  (() => {
    throw new Error("Missing required environment variable: SESSION_SECRET");
  })();
export const encodedKey = new TextEncoder().encode(secretKey);

export async function signToken(
  payload: SessionPayload,
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
    if (encodedKey === undefined) {
      throw new Error("Token Encoded Key can't be undefined");
    }
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to Verify session: ", error);
  }
}

export async function createSession(
  userId: number,
  userRole: "admin" | "user"
) {
  try {
    if (encodedKey === undefined) {
      throw new Error("Token Encoded Key can't be undefined");
    }
    const accessToken = await signToken(
      { userId, userRole },
      encodedKey,
      "15m"
    );
    const refreshToken = await signToken(
      { userId, userRole },
      encodedKey,
      "7d"
    );
    const expiresAtDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    //Storing Refresh Token in DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const refreshTokenData = await db
      .insert(refreshTokenTable)
      .values({
        userId: userId,
        token: hashedRefreshToken,
        expiresAt: expiresAtDate,
      })
      .returning();

    if (refreshTokenData.length == 0) {
      throw new Error("Error while storing refreshToken in DB");
    }

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      // secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, //15mins
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      //secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, //7days
    });
  } catch (error) {
    console.log("Error while creating the sessison", error);
  }
}

export async function deleteCookieSession() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (refreshToken === undefined) {
      throw new Error("Failed to get refreshToken in cookies");
    }

    const { payload } = await jwtVerify(refreshToken, encodedKey);
    const userId = payload.userId as number;
    const userRole = payload.userRole;

    const stored = await db
      .select()
      .from(refreshTokenTable)
      .where(eq(refreshTokenTable.userId, userId));

    let matchedRow: any = null;
    for (const row of stored) {
      const match = await bcrypt.compare(refreshToken, row.token);
      if (match) {
        matchedRow = row;
        break;
      }
    }
    //If nothing matched, token is invalid/already used
    if (!matchedRow) {
      throw new Error("Token replay detected or token doesn't exist");
    }

    const deletedToken = await db
      .delete(refreshTokenTable)
      .where(eq(refreshTokenTable.id, matchedRow.id))
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
