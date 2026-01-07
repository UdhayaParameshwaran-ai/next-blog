"use server";
import { PostFormState, PostSchema } from "@/lib/definitions";
import { getCurrentUser } from "./auth";
import { postTable, updatedPostTable, usersTable } from "@/db/schema";
import { db } from "..";
import { and, eq, sql } from "drizzle-orm";

export async function createPost(state: PostFormState, formData: FormData) {
  try {
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
        author: user?.id,
        status: user?.id === 5 ? "approved" : "submitted",
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
  } catch (error) {
    console.error("Failed to CreatePost: ", error);
    return { success: false };
  }
}

export async function getUserPosts() {
  try {
    const user = await getCurrentUser();
    const data = await db
      .select()
      .from(postTable)
      //@ts-ignore
      .where(eq(postTable.author, user?.id));
    return data;
  } catch (error) {
    console.error("Failed to Get User Posts: ", error);
    return { success: false };
  }
}

export async function updatePost(postId: number, formData: FormData) {
  try {
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
    if (user?.id == 5) {
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

      console.debug("Entered Update post action", postId, alreadyExists);
      if (alreadyExists.length != 0) {
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
  } catch (error) {
    console.error("Failed to update the Post: ", error);
    return { success: false };
  }
}

export async function deletePost(postId: number | undefined) {
  try {
    if (!postId) {
      return {
        message: "Post ID not mentioned",
      };
    }
    await db.delete(postTable).where(eq(postTable.id, postId));
    return {
      message: "Post Deleted Successfully",
    };
  } catch (error) {
    console.error("Failed to Delete the post.");
    return { success: false };
  }
}

export async function getAllPosts() {
  try {
    const posts = await db.select().from(postTable);
    return posts;
  } catch (error) {
    console.error("Failed to fetch the Posts: ", error);
    return { success: false };
  }
}

export async function getApprovedPosts() {
  try {
    const posts = await db
      .select()
      .from(postTable)
      .where(eq(postTable.status, "approved"));
    return posts;
  } catch (error) {
    console.error("Failed to Get Approved Posts: ", error);
    return { success: false };
  }
}

export async function getPostbyId(postId: number) {
  try {
    const post = await db
      .select()
      .from(postTable)
      .where(eq(postTable.id, postId));
    const postData = post[0];

    const author = await db
      .select()
      .from(usersTable)
      //@ts-ignore
      .where(eq(usersTable.id, postData.author));
    const authorData = author[0];
    return {
      success: true,
      data: {
        ...postData,
        authorName: authorData?.name || "Unknown Author",
      },
    };
  } catch (error) {
    console.error("Failed to Get the Post: ", error);
    return { success: false };
  }
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
    console.error("Failed to Unlike post:", error);
    return { success: false };
  }
}

export async function getUpdatedPosts() {
  try {
    const updatedPosts = await db.select().from(updatedPostTable);
    return updatedPosts;
  } catch (error) {
    console.error("Failed to Get Updated Posts: ", error);
    return { success: false };
  }
}

export async function approveUpdate(postId: number) {
  try {
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
    await db
      .delete(updatedPostTable)
      .where(eq(updatedPostTable.postId, postId));
    return updatedPost;
  } catch (error) {
    console.error("Failed to Approve the Updated post: ", error);
    return { success: false };
  }
}

export async function getUSerPostById(id: number) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return { error: "Unauthorized", data: null };
    }
    const data = await db
      .select()
      .from(postTable)
      .where(
        and(
          //@ts-ignore
          eq(postTable.author, user.id),
          //@ts-ignore
          eq(postTable.id, parseInt(id))
        )
      );
    const post = data[0];
    if (!post) {
      return { error: "No Such Post", data: null };
    }
    return { error: null, data: post };
  } catch (error) {
    console.error("Action Error:", error);
    return { error: "Internal Server Error", data: null };
  }
}

export async function getUSerPosts(id: number) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return { error: "Unauthorized", data: null };
    }
    const data = await db.select().from(postTable).where(
      //@ts-ignore
      eq(postTable.author, user.id)
    );
    const post = data[0];
    if (!post) {
      return { error: "No Such Post", data: null };
    }
    return { error: null, data: post };
  } catch (error) {
    console.error("Action Error:", error);
    return { error: "Internal Server Error", data: null };
  }
}

export async function getPaginatedApprovedPosts(pageNumber: number) {
  const page = pageNumber || 1;
  const limit = 8;
  const posts = await db
    .select()
    .from(postTable)
    .where(eq(postTable.status, "approved"));
  //return posts;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const paginatedData = posts.slice(startIndex, startIndex + limit);
  return paginatedData;
}
