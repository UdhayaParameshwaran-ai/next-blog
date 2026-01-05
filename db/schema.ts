import { sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const postStatusEnum = pgEnum("post_status", [
  "submitted",
  "approved",
  "rejected",
  "blocked",
]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar().notNull(),
});

export const postTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  author: integer().references(() => usersTable.id),
  upvotes: integer().default(0),
  status: postStatusEnum("status").notNull().default("submitted"),
  updated_at: timestamp("updated_at", { mode: "string" }).default(sql`now()`),
  published_at: timestamp("published_at", { mode: "string" }),
});

export const commentsTable = pgTable("comments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  comment: varchar().notNull(),
  author: integer().references(() => usersTable.id),
  post: integer().references(() => postTable.id),
});

export const updatedPostTable = pgTable("updatedPosts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  postId: integer().references(() => postTable.id),
  updatedTitle: varchar().notNull(),
  updatedDescripton: varchar().notNull(),
  updated_at: timestamp("updated_at", { mode: "string" }).default(sql`now()`),
});
