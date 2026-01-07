"use server";

import { commentsTable, usersTable } from "@/db/schema";
import { db } from "..";
import { eq } from "drizzle-orm";
export async function getCommentsbyPostId(postId: number) {
  try {
    const data = await db
      .select({
        id: commentsTable.id,
        comment: commentsTable.comment,
        author: usersTable.name,
      })
      .from(commentsTable)
      .innerJoin(usersTable, eq(commentsTable.author, usersTable.id))
      .where(eq(commentsTable.post, postId));
    return data;
  } catch (error) {
    console.error("Failed to get the Comments: ", error);
  }
}

export async function addComment(
  extraData: { post: number; author: number },
  prevState: any,
  formData: FormData
) {
  try {
    const commentText = formData.get("comment") as string;

    const comment = await db
      .insert(commentsTable)
      .values({
        comment: commentText,
        post: extraData.post,
        author: extraData.author,
      })
      .returning();
    if (comment) {
      return {
        success: true,
      };
    }
  } catch (error) {
    console.error("Failed to add Comment: ", error);
  }
}
