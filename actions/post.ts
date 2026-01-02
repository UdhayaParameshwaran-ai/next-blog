"use server";
import { FormState, PostFormState, PostSchema } from "@/lib/definitions";
import { getCurrentUser } from "./auth";
import { postTable } from "@/db/schema";
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
      status: "submitted",
      upvotes: 0,
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
  const updatedData = await db
    .update(postTable)
    .set({
      title: title,
      description: description,
      status: "submitted",
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

export async function getApprovedPosts(){
  const posts =await db.select().from(postTable).where(eq(postTable.status,"approved"));
  return posts;
}

export async function getPostbyId(postId:number){
  const post=await db.select().from(postTable).where(eq(postTable.id,postId))
  return post;
}