import { z } from "zod";

export const SignupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must atleast 2 Chars long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
  role: z.enum(["user", "admin"]).default("user"),
});

export const SigninSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const PostSchema = z.object({
  title: z.string().min(3, { message: "Title should atleast 3 chars" }).trim(),
  description: z
    .string()
    .min(20, { message: "Description should atleast 20 chars" }),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
      };
      message?: string;
    }
  | undefined;

export type PostFormState =
  | {
      error?: {
        title?: string[];
        description?: string[];
      };
      message?: string;
    }
  | {
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: number;
  expiresAt?: Date;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type Post = {
  id: number;
  title: string;
  description: string;
  author: number | null;
  upvotes: number | null;
  status: "submitted" | "approved" | "rejected" | "blocked";
  updated_at: string | null;
  published_at: string | null;
};

export type Comments = {
  id: number;
  //post:number,
  comment: string;
  author: string;
};

export type CommentFormState =
  | {
      error?: {
        comment?: string[];
      };
      message?: string;
    }
  | {
      message?: string;
    }
  | undefined;
