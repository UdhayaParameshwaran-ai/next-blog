import { postTable } from "@/db/schema";
import { db } from "@/index";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, author, upvotes } = body;

  const data = await db
    .insert(postTable)
    .values({
      title: title,
      description: description,
      author: author,
    })
    .returning();
  const post = data[0];
  if (!post) {
    return {
      message: "An error occurred while creating your account.",
    };
  }
  return NextResponse.json(post);
}
