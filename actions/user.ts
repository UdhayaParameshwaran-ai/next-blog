"use server";
import { usersTable } from "@/db/schema";
import { db } from "..";
import { eq } from "drizzle-orm";

export async function getUserById(userId: number) {
  try {
    const data = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    const user = data[0];
    return user;
  } catch (error) {
    console.error("Failed to Get the current user: ", error);
  }
}
