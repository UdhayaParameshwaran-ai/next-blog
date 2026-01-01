import { getCurrentUser } from "@/actions/auth";
import { postTable } from "@/db/schema";
import { db } from "@/index";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (params) {
    const id = (await params).id;
    if (id) {
      const data = await db
        .select()
        .from(postTable)
        .where(
          and(
            eq(postTable.author, user.id),
            //@ts-ignore
            eq(postTable.id, id)
          )
        );
      return NextResponse.json(data);
    }
  }
  const data = await db
    .select()
    .from(postTable)
    .where(eq(postTable.author, user.id));
  return NextResponse.json(data);
}
