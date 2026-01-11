"use client";
import { approveUpdate, getAllPosts, getUpdatedPosts } from "@/actions/post";
import { useEffect, useState } from "react";
import { Post } from "@/lib/definitions";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostCardShimmer } from "@/app/_components/PostCardShimmer";

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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isHandling, setIsHandling] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [allPostsData, updatedPostsData] = await Promise.all([
        getAllPosts(),
        getUpdatedPosts(),
      ]);
      if (Array.isArray(allPostsData) && Array.isArray(updatedPostsData)) {
        setPosts(allPostsData);
        setUpdatedPosts(updatedPostsData);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveUpdate = async () => {
    setIsHandling(true);
    if (selectedPost?.postId == null) return;
    const update = await approveUpdate(selectedPost?.postId);
    if (update) toast.success("Approved the updated post.");
    setSelectedPost(null);
    setIsHandling(false);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPosts = posts.filter((post) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "updated") return false;
    return post.status === statusFilter;
  });
  const filteredUpdates = updatedPosts.filter((post) => {
    if (statusFilter === "all" || statusFilter === "updated") return true;
    return false;
  });

  if (isLoading)
    return (
      <div className="grid space-x-2 grid-cols-4">
        <PostCardShimmer />
        <PostCardShimmer />
        <PostCardShimmer />
        <PostCardShimmer />
      </div>
    );

  return (
    <div className="px-10 ">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px] m-5">
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Filters</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch mt-5">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader postStatus={post.status}>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.description}</p>
            </CardContent>
            <CardFooter
              href={`dashboard/userPost/${post.id}`}
              likes={post.upvotes}
            ></CardFooter>
          </Card>
        ))}
        {filteredUpdates.map((post) => (
          <Card key={post.id}>
            <CardHeader postStatus="updated">
              <CardTitle>{post.updatedTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.updatedDescripton}</p>
            </CardContent>
            <CardFooter>
              <button
                onClick={() => setSelectedPost(post)}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold cursor-pointer"
              >
                View Details →
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          />
          <div className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200"
            >
              ✕
            </button>

            <div className="p-6 overflow-y-auto">
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
                  disabled={isHandling}
                  onClick={handleApproveUpdate}
                  className="px-3 py-2 mb-1 bg-black text-white rounded-3xl font-semibold cursor-pointer"
                >
                  Update the post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
