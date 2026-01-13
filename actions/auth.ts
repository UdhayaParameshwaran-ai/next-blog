"use server";

import {
  FormState,
  SessionSchema,
  SigninSchema,
  SignupSchema,
} from "@/lib/definitions";
import bcrypt from "bcrypt";
import { db } from "..";
import { usersTable } from "@/db/schema";
import { createSession, decrypt, deleteCookieSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getUserById } from "./user";
import { rateLimit } from "@/lib/rateLimiter";
import { getClientIp } from "@/lib/getClientIP";
import * as Sentry from "@sentry/nextjs";

export async function signup(state: FormState, formData: FormData) {
  let isSuccess = false;
  try {
    const validateFields = SignupSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    });

    if (!validateFields.success) {
      return {
        errors: validateFields.error.flatten().fieldErrors,
      };
    }
    const { name, email, password, role } = validateFields.data;

    const alreadyExistUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (alreadyExistUser.length != 0) {
      console.log("Already Exists User", alreadyExistUser);
      return {
        message: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await db
      .insert(usersTable)
      .values({
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      })
      .returning();
    const user = data[0];
    if (!user) {
      return {
        message: "An error occurred while creating your account.",
      };
    }
    await createSession(user.id, user.role);
    isSuccess = true;
  } catch (error) {
    console.error("Failed to Signup", error);
    Sentry.logger.error("Failed to Sigup", { error });
    return { success: false };
  }
  if (isSuccess) {
    redirect("/");
  }
}

export async function signin(state: FormState, formData: FormData) {
  let isSuccess = false;
  try {
    try {
      const ip = getClientIp();
      await rateLimit(`signin:${ip}:${formData.get("email")}`, 5, 60);
    } catch (error) {
      Sentry.logger.error("Auth API RateLimited: ", { error });
      return {
        message: "Too many SignIn attempts, Please try after later.",
      };
    }

    const validateFields = SigninSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!validateFields.success) {
      return {
        errors: validateFields.error.flatten().fieldErrors,
      };
    }
    const { email, password } = validateFields.data;

    const data = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    const user = data[0];

    if (!user) {
      return {
        message: "Invalid email or password",
      };
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return {
        message: "Incorrect password",
      };
    }
    await createSession(user.id, user.role);

    isSuccess = true;
  } catch (error) {
    console.error("Failed to SignIn: ", error);
    Sentry.logger.error("Failed to SigIn", { error });
  }
  if (isSuccess) {
    redirect("/");
  }
}

export async function logout() {
  let isSuccess = false;
  try {
    await deleteCookieSession();
    isSuccess = true;
  } catch (error) {
    console.error("Failed to Logout: ", error);
    Sentry.logger.error("Failed to Logout", { error });
    return { success: false };
  }
  if (isSuccess) {
    redirect("/signin");
  }
}

export async function getCurrentUser() {
  try {
    const cookie = (await cookies()).get("refreshToken")?.value;
    if (!cookie) return null;
    const session = SessionSchema.parse(await decrypt(cookie));
    const data = await getUserById(session.userId);
    return data;
  } catch (error) {
    console.error("Failed to Get the current user", error);
    Sentry.logger.error("Failed to Get the current user", { error });
  }
}
