"use client";

import { PostShimmer } from "@/app/_components/PostShimmer";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/definitions";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function Page() {
  const { id } = useParams();
  const [post, setPost] = useState<Post>();
  const [isLoading, setLoading] = useState(true);
  const fetchPost = async () => {
    const res = await fetch(`/api/userPost/${id}`);
    if (!res.ok) return setLoading(false);
    const data = await res.json();
    setPost(data);
    setLoading(false);
  };
  const handleBlock = async () => {
    try {
      const response = await fetch(`/api/userPost/${post?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "blocked" }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setPost(result[0]);
    } catch (error) {
      console.error("Failed to approve post:", error);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/userPost/${post?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setPost(result[0]);
    } catch (error) {
      console.error("Failed to approve post:", error);
    }
  };
  const handleReject = async () => {
    try {
      const response = await fetch(`/api/userPost/${post?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Success:", result);
      setPost(result[0]);
    } catch (error) {
      console.error("Failed to approve post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <PostShimmer />
      </div>
    );
  if (!post) return <p className="p-10 text-center">User Post not found</p>;

  return (
    <div className="max-w-3/4 mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <span className="inline-block mt-4 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          Status: {post.status}
        </span>

        <div className="space-x-2">
          {post.status == "submitted" ? (
            <div>
              <Button onClick={handleApprove} variant="outline">
                Approve
              </Button>{" "}
              <Button onClick={handleReject} variant="destructive">
                Reject
              </Button>
            </div>
          ) : post.status == "approved" ? (
            <Button onClick={handleBlock} variant="secondary">
              Block
            </Button>
          ) : (
            <Button onClick={handleApprove} variant="outline">
              Approve
            </Button>
          )}
        </div>
      </div>
      <div className="prose">
        <p className="text-lg text-gray-700">{post.description}</p>
      </div>
    </div>
  );
}
