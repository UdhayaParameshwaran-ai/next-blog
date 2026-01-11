"use client";
import { addComment, getCommentsbyPostId } from "@/actions/comment";
import { getPostbyId, likePostbyId, unlikePostbyId } from "@/actions/post";
import CommentBox from "@/app/_components/CommentBox";
import { PostShimmer } from "@/app/_components/PostShimmer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/AuthContext";
import { Comments, Post } from "@/lib/definitions";
import { PencilLine, ThumbsUp } from "lucide-react";
import { useParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

interface PostWithAuthor extends Post {
  authorName: string;
}

export default function Page() {
  const { id } = useParams();
  const [post, setPost] = useState<PostWithAuthor>();
  const [isLoading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comments[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isHandling, setIsHandling] = useState(false);

  const { user } = useUser();
  const initialState = { message: null, success: false };
  const addCommentWithIds = addComment.bind(null, {
    post: Number(id),
    //@ts-ignore
    author: user?.id,
  });

  const [state, formAction] = useActionState(addCommentWithIds, initialState);

  const handleLike = async () => {
    setIsHandling(true);
    if (isLiked) {
      const res = await unlikePostbyId(Number(id));
      setPost(res.data as PostWithAuthor);
      setIsLiked((prev) => !prev);
    } else {
      const res = await likePostbyId(Number(id));
      setPost(res.data as PostWithAuthor);
      setIsLiked((prev) => !prev);
    }
    setIsHandling(false);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [postRes, commentsRes] = await Promise.all([
          getPostbyId(Number(id)),
          getCommentsbyPostId(Number(id)),
        ]);
        setPost(postRes?.data);

        if (Array.isArray(commentsRes)) {
          setComments(commentsRes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

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
        <div className="flex space-x-2">
          <PencilLine width={18} />
          <span>Author Name: {post.authorName}</span>
        </div>
      </div>
      <div className="prose">
        <p className="text-lg text-gray-900">{post.description}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleLike}
          disabled={isHandling}
          className="group flex items-center gap-2 transition-all active:scale-90"
        >
          <ThumbsUp
            width={17}
            className={`transition-all duration-300 ${
              isLiked
                ? "fill-blue-500 text-blue-500 scale-110"
                : "fill-none text-gray-500 hover:text-gray-700"
            }`}
          />
          <span className={isLiked ? "text-blue-500" : "text-gray-500"}>
            {post.upvotes} Like(s)
          </span>
        </button>
      </div>
      <div className="space-y-2 w-[60%]">
        <div className="text-xl w-full text-gray-800">Comments</div>
        <form action={formAction} className="flex space-x-3 w-full">
          <Input
            type="text"
            name="comment"
            placeholder="Add a comment"
            required
          />
          <Button type="submit">Add</Button>
        </form>

        {comments.length == 0 ? (
          <div>No comments</div>
        ) : (
          <div>
            {comments.map((item) => (
              <CommentBox
                key={item.id}
                comment={item.comment}
                authorName={item.author}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
