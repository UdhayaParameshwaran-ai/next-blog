"use client";

import { updatePost, deletePost } from "@/actions/post";
import { PostShimmer } from "@/app/_components/PostShimmer";
import { useUser } from "@/context/AuthContext";
import { Post } from "@/lib/definitions";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const isUser = user?.id != 5;
  const [post, setPost] = useState<Post>();
  const [isLoading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchPost = async () => {
    const res = await fetch(`/api/post/${id}`);
    if (!res.ok) return setLoading(false);
    const data = await res.json();
    setPost(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

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
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border rounded-2xl hover:bg-gray-100 cursor-pointer"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
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
  async function handleSubmit(formData: FormData) {
    await updatePost(post.id, formData);
    onComplete();
  }
  return (
    <form action={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded">
      <input
        name="title"
        defaultValue={post.title}
        className="w-full border p-2 rounded"
      />
      <textarea
        name="description"
        defaultValue={post.description}
        className="w-full border p-2 rounded"
        rows={4}
      />
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded-2xl"
      >
        Request Update
      </button>
    </form>
  );
}
