"use server";
import { FormState, PostFormState, PostSchema } from "@/lib/definitions";
import { getCurrentUser } from "./auth";
import { postTable, updatedPostTable } from "@/db/schema";
import { db } from "..";
import { eq, sql } from "drizzle-orm";

export async function createPost(state: PostFormState, formData: FormData) {
  const user = await getCurrentUser();
  const validateFields = PostSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }
  const { title, description } = validateFields.data;

  const data = await db
    .insert(postTable)
    .values({
      title: title,
      description: description,
      author: user.id,
      status: user.id === 5 ? "approved" : "submitted",
      upvotes: 0,
      published_at: sql`NOW()`,
    })
    .returning();
  const post = data[0];
  if (post) {
    return {
      success: true,
    };
  }
  return {
    errors: {
      title: "Something went wrong",
    },
  };
}

export async function getUserPosts() {
  const user = await getCurrentUser();
  const data = await db
    .select()
    .from(postTable)
    .where(eq(postTable.author, user.id));
  return data;
}

export async function updatePost(postId: number, formData: FormData) {
  const user = await getCurrentUser();
  const validateFields = PostSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const { title, description } = validateFields.data;
  if (user.id == 5) {
    //if user is admin
    const updatedData = await db
      .update(postTable)
      .set({
        title: title,
        description: description,
        status: "approved",
        updated_at: sql`NOW()`,
      })
      .where(eq(postTable.id, postId))
      .returning();
    const post = updatedData[0];
    if (post) {
      return {
        success: true,
      };
    }
    return {
      error: "Error while updating post.",
    };
  } else {
    //if user is not admin
    //check if the post already in updated table if it is, overwrite the older updated version
    const alreadyExists = await db
      .select()
      .from(updatedPostTable)
      .where(eq(updatedPostTable.postId, postId));

    if (alreadyExists) {
      const updatedData = await db
        .update(updatedPostTable)
        .set({ updatedTitle: title, updatedDescripton: description })
        .where(eq(updatedPostTable.postId, postId))
        .returning();

      const post = updatedData[0];
      if (post) {
        return {
          success: true,
        };
      }
      return {
        error: "Error while updating post.",
      };
    }

    const updatedData = await db
      .insert(updatedPostTable)
      .values({
        updatedTitle: title,
        postId: postId,
        updatedDescripton: description,
        updated_at: sql`NOW()`,
      })
      .returning();
    const post = updatedData[0];
    if (post) {
      return {
        success: true,
      };
    }
    return {
      error: "Error while updating post.",
    };
  }
}

export async function deletePost(postId: number | undefined) {
  if (!postId) {
    return {
      message: "Post ID not mentioned",
    };
  }
  await db.delete(postTable).where(eq(postTable.id, postId));
  return {
    message: "Post Deleted Successfully",
  };
}

export async function getAllPosts() {
  const posts = await db.select().from(postTable);
  return posts;
}

export async function getApprovedPosts() {
  const posts = await db
    .select()
    .from(postTable)
    .where(eq(postTable.status, "approved"));
  return posts;
}

export async function getPostbyId(postId: number) {
  const post = await db
    .select()
    .from(postTable)
    .where(eq(postTable.id, postId));
  return post;
}

export async function likePostbyId(postId: number) {
  try {
    const updatedPost = await db
      .update(postTable)
      .set({
        upvotes: sql`${postTable.upvotes} + 1`,
      })
      .where(eq(postTable.id, postId))
      .returning();

    return { success: true, data: updatedPost[0] };
  } catch (error) {
    console.error("Failed to like post:", error);
    return { success: false };
  }
}

export async function unlikePostbyId(postId: number) {
  try {
    const updatedPost = await db
      .update(postTable)
      .set({
        upvotes: sql`${postTable.upvotes} - 1`,
      })
      .where(eq(postTable.id, postId))
      .returning();

    return { success: true, data: updatedPost[0] };
  } catch (error) {
    console.error("Failed to like post:", error);
    return { success: false };
  }
}

export async function getUpdatedPosts() {
  const updatedPosts = await db.select().from(updatedPostTable);
  return updatedPosts;
}

export async function approveUpdate(postId: number) {
  const updatedPostTableData = await db
    .select()
    .from(updatedPostTable)
    .where(eq(updatedPostTable.postId, postId));
  const updatedPostData = updatedPostTableData[0];
  const updatedPost = await db
    .update(postTable)
    .set({
      title: updatedPostData.updatedTitle,
      description: updatedPostData.updatedDescripton,
      updated_at: updatedPostData.updated_at,
      status: "approved",
    })
    //@ts-ignore
    .where(eq(postTable.id, updatedPostData.postId))
    .returning();
  await db.delete(updatedPostTable).where(eq(updatedPostTable.postId, postId));
  return updatePost;
}
