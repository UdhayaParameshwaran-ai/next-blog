"use server";

import { commentsTable, usersTable } from "@/db/schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import * as Sentry from "@sentry/nextjs";

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
    Sentry.logger.error("Failed to Get the comments", { error });
  }
}

export async function addComment(
  extraData: { post: number; author: number },
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
        data: comment[0],
      };
    }
  } catch (error) {
    console.error("Failed to add Comment: ", error);
    Sentry.logger.error("Failed to add comments", { error });
  }
}
