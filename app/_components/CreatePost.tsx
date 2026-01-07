"use client";

import { createPost } from "@/actions/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      <Input name="title" placeholder="Post title" />
      {state?.error?.title && (
        <p className="text-sm text-red-500">{state?.error?.title}</p>
      )}

      <Textarea name="description" placeholder="Post content" />

      {state?.error?.description && (
        <p className="text-sm text-red-500">{state?.error?.description}</p>
      )}

      {state?.success && (
        <p className="text-sm text-green-600">Post created successfully</p>
      )}

      <Button disabled={pending}>
        {pending ? "Creating..." : "Create Post"}
      </Button>
    </form>
  );
}
