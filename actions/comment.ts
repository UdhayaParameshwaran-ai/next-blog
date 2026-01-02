"use server"

import { commentsTable, usersTable } from "@/db/schema";
import { db } from "..";
import { eq } from "drizzle-orm";

export async function getCommentsbyPostId(postId:number){
    console.log("postId",postId)

    const data=await db
    .select({
      id: commentsTable.id,
      comment: commentsTable.comment,
      author: usersTable.name, 
    })
    .from(commentsTable)
    .innerJoin(usersTable, eq(commentsTable.author, usersTable.id))
    .where(eq(commentsTable.post, postId));
    return data;
}

export async function addComment(extraData: { post: number; author: number }, formData: FormData) {
    const commentText = formData.get("comment") as string;
    
    await db.insert(commentsTable).values({
        comment: commentText,
        post: extraData.post,
        author: extraData.author
    });
}