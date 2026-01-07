import { getCurrentUser } from "@/actions/auth";
import { postTable } from "@/db/schema";
import { db } from "@/index";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
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
  const data = await db
    .select()
    .from(postTable)
    //@ts-ignore
    .where(eq(postTable.id, postId));
  const post = data[0];
  if (!post) {
    return NextResponse.json({ message: "No Such Post" });
  }
  return NextResponse.json(post);
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
  console.log(body);
  const { status } = body;
  console.log(status);

  const data = await db
    .update(postTable)
    .set({
      status: status,
      published_at: sql`CASE WHEN ${postTable.published_at} IS NULL THEN NOW() ELSE ${postTable.published_at} END`,
      updated_at: sql`CASE WHEN ${postTable.published_at} IS NOT NULL THEN NOW() ELSE ${postTable.updated_at} END`,
    })
    //@ts-ignore
    .where(eq(postTable.id, postId))
    .returning();
  return NextResponse.json(data, { status: 200 });
}
