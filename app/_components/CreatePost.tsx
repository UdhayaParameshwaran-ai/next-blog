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
    <form action={action} className="flex flex-col max-w-md max-h-[80vh]">
      <div className="p-4">
        <h2 className="text-xl font-semibold">Create Post</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <div>
          <Input name="title" placeholder="Post title" />
          {state?.error?.title && (
            <p className="text-sm text-red-500 mt-1">{state?.error?.title}</p>
          )}
        </div>

        <div>
          <Textarea
            name="description"
            placeholder="Post content"
            className="min-h-[200px]"
          />
          {state?.error?.description && (
            <p className="text-sm text-red-500 mt-1">
              {state?.error?.description}
            </p>
          )}
        </div>
        {state?.success && (
          <p className="text-sm text-green-600">Post created successfully</p>
        )}
      </div>
      <div className="p-4 border-t bg-gray-50">
        <Button disabled={pending} className="w-full">
          {pending ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
