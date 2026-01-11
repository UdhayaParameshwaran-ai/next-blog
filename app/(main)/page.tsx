"use client";
import { getApprovedPosts, getPaginatedApprovedPosts } from "@/actions/post";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { Post } from "@/lib/definitions";
import { PostCardShimmer } from "../_components/PostCardShimmer";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getPaginatedApprovedPosts(currentPage);
        setPosts(data?.paginatedData);
        setTotalPages(data?.totalPages);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage]);

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
    <div className="flex flex-col justify-between items-end px-10 h-[80vh]">
      <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-14 items-stretch ">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.description}</p>
            </CardContent>
            <CardFooter
              href={`/blog/${post.id}`}
              likes={post.upvotes == null ? 0 : post.upvotes}
            ></CardFooter>
          </Card>
        ))}
      </div>
      {/**Pagination */}
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
  );
}
