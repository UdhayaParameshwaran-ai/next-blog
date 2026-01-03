"use client";

import { useEffect, useState } from "react";
import CreatePostForm from "../_components/CreatePost";
import { Post } from "@/lib/definitions";
import PostCard from "../_components/PostCard";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState(true);
  
  const fetchPosts = async () => {
    const res = await fetch("/api/post/");
    const data = await res.json();
    setPost(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!post) return <p>No profile data</p>;
  console.log(post);

  return (
    <div className="px-10 py-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Posts</h1>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-2xl"
        >
          Add Post
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch mt-5">
        {post.map((p) => (
          <div key={p.id}>
            <PostCard
              id={p.id}
              title={p.title}
              description={p.description}
              status={p.status}
            />
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-[400px] relative">
            <button
              onClick={() => setOpen(false)}
              className="border bg-black/40 text-white p-2 rounded-lg absolute right-5 top-3 cursor-pointer"
            >
              X
            </button>
            <CreatePostForm
              onSuccess={() => {
                fetchPosts();
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
