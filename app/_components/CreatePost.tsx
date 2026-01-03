"use client";

import { createPost } from "@/actions/post";
import { useActionState, useEffect } from "react";

interface Props {
  onSuccess: () => void;
}

export default function CreatePostForm({ onSuccess }: Props) {
  const [state, action, pending] = useActionState(createPost, undefined);

  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state?.success, onSuccess]);

  return (
    <form action={action} className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold">Create Post</h2>
      <input
        name="title"
        placeholder="Post title"
        className="w-full border px-3 py-2 rounded"
      />
      {state?.error?.title && (
        <p className="text-sm text-red-500">{state?.error?.title}</p>
      )}

      <textarea
        name="description"
        placeholder="Post content"
        rows={4}
        className="w-full border px-3 py-2 rounded"
      />

      {state?.error?.description && (
        <p className="text-sm text-red-500">{state?.error?.description}</p>
      )}

      {state?.success && (
        <p className="text-sm text-green-600">Post created successfully</p>
      )}

      <button
        disabled={pending}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
