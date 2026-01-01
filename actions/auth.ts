"use server";

import { FormState, SigninSchema, SignupSchema } from "@/lib/definitions";
import bcrypt from "bcrypt";
import { db } from "..";
import { usersTable } from "@/db/schema";
import {
  createCookieSession,
  decrypt,
  deleteCookieSession,
} from "@/lib/session";
import { redirect, RedirectType } from "next/navigation";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getUserById } from "./user";

export async function signup(state: FormState, formData: FormData) {
  const validateFields = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }
  const { name, email, password } = validateFields.data;

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
    })
    .returning();
  const user = data[0];
  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }
  await createCookieSession(user.id);
  redirect("/");
}

export async function signin(state: FormState, formData: FormData) {
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
      message: "Invalid email or password",
    };
  }
  await createCookieSession(user.id);

  redirect("/");
}

export async function logout() {
  await deleteCookieSession();
  redirect("/login");
}

export async function getCurrentUser() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const userId = session?.userId;
  //@ts-ignore
  const data = await getUserById(userId);
  return data;
}
