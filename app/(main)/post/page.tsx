"use client";

import { useEffect, useState } from "react";

import { Post } from "@/lib/definitions";
import { Button } from "@/components/ui/button";

import { getUserPostsPaginated } from "@/actions/post";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/context/AuthContext";
import { PostCardShimmer } from "@/app/_components/PostCardShimmer";
import CreatePostForm from "@/app/_components/CreatePost";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState<Post[] | undefined>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getUserPostsPaginated(currentPage);
      setPost(data?.paginatedData);
      setTotalPages(data?.totalPages ?? 1);
    } catch (err) {
      console.error("Failed to fetch the User posts: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
    <div className="px-10 py-5 h-[80vh] flex flex-col">
      <div className="flex  justify-between items-center">
        <h1 className="text-xl font-bold">Your Posts</h1>
        <Button onClick={() => setOpen(true)}>Create a post +</Button>
      </div>
      {post?.length == 0 && (
        <p className="text-gray-900 font-medium mt-10">
          No Posts Yet. Create a post!
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch mt-5">
        {post?.map((p) => (
          <Card key={p.id}>
            <CardHeader postStatus={isAdmin ? undefined : p.status}>
              <CardTitle>{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{p.description}</p>
            </CardContent>
            <CardFooter
              href={`/post/${p.id}`}
              likes={p.upvotes == null ? 0 : p.upvotes}
            ></CardFooter>
          </Card>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-[400px] relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200  cursor-pointer"
            >
              ✕
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
      {/**Pagination */}
      <div className="mt-auto flex justify-center w-full ">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={
                  currentPage == 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => prev - 1);
                }}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink className="bg-gray-100">
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => prev + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
