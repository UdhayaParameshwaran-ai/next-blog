"use client";
import { approveUpdate, getAllPosts, getUpdatedPosts } from "@/actions/post";
import AdminPostCard from "../_components/AdminPostCard";
import { useEffect, useState } from "react";
import { Post } from "@/lib/definitions";
import Link from "next/link";

interface UpdatedPost {
  id: number;
  postId: number | null;
  updatedTitle: string;
  updatedDescripton: string;
  updated_at: string | null;
}

export default function page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [updatedPosts, setUpdatedPosts] = useState<UpdatedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<UpdatedPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleApproveUpdate = async () => {
    if (selectedPost?.postId == null) return;
    const update = await approveUpdate(selectedPost?.postId);
    if (update.length != 0) {
      console.log("Admin approve Updated successful");
    }
    setSelectedPost(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [allPostsData, updatedPostsData] = await Promise.all([
          getAllPosts(),
          getUpdatedPosts(),
        ]);
        setPosts(allPostsData);
        setUpdatedPosts(updatedPostsData);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading) return <p>Loading posts...</p>;

  return (
    <div>
      <div>Dashboard</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch mt-5">
        {posts.map((post) => (
          <div key={post.id}>
            <AdminPostCard
              id={post.id}
              title={post.title}
              description={post.description}
              status={post.status}
            />
          </div>
        ))}
        {/* 1. Grid of Updated Post Cards */}
        {updatedPosts.map((post) => (
          <div
            key={post.id}
            className="max-w-md p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                {post.updatedTitle}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border bg-yellow-200 text-yellow-700 border-yellow-700`}
              >
                Updated
              </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-1 mb-4">
              {post.updatedDescripton}
            </p>
            <button
              onClick={() => setSelectedPost(post)}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold cursor-pointer"
            >
              View Details →
            </button>
          </div>
        ))}
      </div>
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          />
          <div className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200"
            >
              ✕
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                {selectedPost.updatedTitle}
              </h2>
              <p className="text-gray-600 mb-6">
                {selectedPost.updatedDescripton}
              </p>

              <div className="flex justify-between space-x-2">
                <Link
                  href={`dashboard/userPost/${selectedPost.postId}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold cursor-pointer"
                >
                  Compare Old post
                </Link>
                <button
                  onClick={handleApproveUpdate}
                  className="px-3 py-2 mb-1 bg-black text-white rounded-3xl font-semibold cursor-pointer"
                >
                  Update post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
