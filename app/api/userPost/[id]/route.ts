import { getCurrentUser } from "@/actions/auth";
import { postTable } from "@/db/schema";
import { db } from "@/index";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (user?.role != "admin") {
      return NextResponse.json(
        { error: "Not a Authenticated person" },
        { status: 401 }
      );
    }
    const postId = (await params).id;
    const data = await db
      .select()
      .from(postTable)
      .where(eq(postTable.id, Number(postId)));
    const post = data[0];
    if (!post) {
      return NextResponse.json({ message: "No Such Post" });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.log("Error while fetching the user post in API: ", error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (user?.id != 5) {
    return NextResponse.json(
      { error: "Not a Authenticated person" },
      { status: 401 }
    );
  }

  const postId = (await params).id;
  const body = await request.json();
  const { status } = body;

  const data = await db
    .update(postTable)
    .set({
      status: status,
      published_at: sql`CASE WHEN ${postTable.published_at} IS NULL THEN NOW() ELSE ${postTable.published_at} END`,
      updated_at: sql`CASE WHEN ${postTable.published_at} IS NOT NULL THEN NOW() ELSE ${postTable.updated_at} END`,
    })
    .where(eq(postTable.id, Number(postId)))
    .returning();
  return NextResponse.json(data, { status: 200 });
}
