"use client";

import { updatePost, deletePost, getUserPostById } from "@/actions/post";
import { PostShimmer } from "@/app/_components/PostShimmer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/AuthContext";
import { Post } from "@/lib/definitions";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const isUser = user?.role != "admin";
  const [post, setPost] = useState<Post | undefined>();
  const [isLoading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await getUserPostById(Number(id));
      if (!res.data) return;
      setPost(res.data);
    } catch (error) {
      console.log("Error while fetching the posts: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = () => {
    if (confirm("Are you sure?")) {
      startTransition(async () => {
        await deletePost(post?.id);
        router.push("/post");
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <PostShimmer />
      </div>
    );
  if (!post) return <p className="p-10 text-center">Post not found</p>;

  return (
    <div className="max-w-3/4 mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <UpdateForm
          post={post}
          onComplete={() => {
            setIsEditing(false);
            fetchPost();
          }}
        />
      ) : (
        <div className="prose">
          <p className="text-lg text-gray-700">{post.description}</p>
          {isUser && (
            <span className="inline-block mt-4 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              Status: {post.status}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function UpdateForm({
  post,
  onComplete,
}: {
  post: Post;
  onComplete: () => void;
}) {
  const [isHandling, setIsHandling] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsHandling(true);
    const updatingPost = await updatePost(post.id, formData);
    if (updatingPost.success) toast.success("Requested for Update.");
    onComplete();
    setIsHandling(false);
  }
  return (
    <form action={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded">
      <Input name="title" defaultValue={post.title} />
      <Textarea name="description" defaultValue={post.description} rows={4} />
      <Button disabled={isHandling} type="submit">
        Request Update
      </Button>
    </form>
  );
}
