import { getCurrentUser } from "@/actions/auth";
import { postTable } from "@/db/schema";
import { db } from "@/index";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  const id = (await params).id;
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
  const post = data[0];
  if (!post) {
    return NextResponse.json({ message: "No Such Post" });
  }
  return NextResponse.json(post);
}
