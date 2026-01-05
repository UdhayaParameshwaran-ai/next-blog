"use client";
import { addComment, getCommentsbyPostId } from "@/actions/comment";
import { getPostbyId, likePostbyId, unlikePostbyId } from "@/actions/post";
import { getUserById } from "@/actions/user";
import CommentBox from "@/app/_components/CommentBox";
import { useUser } from "@/context/AuthContext";
import { Comments, Post } from "@/lib/definitions";
import { PencilLine, ThumbsUp } from "lucide-react";
import { useParams } from "next/navigation";
import { use, useActionState, useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams();
  const [post, setPost] = useState<Post>();
  const [isLoading, setLoading] = useState(false);
  const [author, setAuthor] = useState<string>();
  const [comments, setComments] = useState<Comments[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  const { user } = useUser();
  const initialState = { message: null, success: false };
  const addCommentWithIds = addComment.bind(null, {
    post: Number(id),
    //@ts-ignore
    author: user?.id,
  });
  const [state, formAction] = useActionState(addCommentWithIds, initialState);

  const handleLike = async () => {
    if (isLiked) {
      const res = await unlikePostbyId(Number(id));
      setPost(res.data as Post);
      setIsLiked((prev) => !prev);
    } else {
      const res = await likePostbyId(Number(id));
      setPost(res.data as Post);
      setIsLiked((prev) => !prev);
    }
  };
  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetching the post first
        const postRes = await getPostbyId(Number(id));
        const postData = postRes[0];
        setPost(postData);

        // Fetching Authorname and Comments in parallel
        const [authorRes, commentsRes] = await Promise.all([
          postData?.author ? getUserById(postData.author) : null,
          getCommentsbyPostId(Number(id)),
        ]);

        if (authorRes) setAuthor(authorRes.name);
        setComments(commentsRes);
      } catch (err) {
        console.error("Error loading page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id, state?.success]);

  if (isLoading) return <p className="p-10 text-center">Loading...</p>;
  if (!post) return <p className="p-10 text-center">Post not found</p>;
  return (
    <div className="max-w-3/4 mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="flex space-x-2">
          <PencilLine width={18} />
          <span>Author Name: {author}</span>
        </div>
      </div>
      <div className="prose">
        <p className="text-lg text-gray-900">{post.description}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleLike}
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
      <div className="space-y-2 w-full">
        <div className="text-2xl w-full text-gray-800">Comments</div>
        <form action={formAction} className="flex space-x-3 w-full">
          <input
            type="text"
            className="border p-2 px-4 flex-1 rounded-3xl "
            name="comment"
            required
          />
          <button
            type="submit"
            className="bg-black text-white cursor-pointer p-2 rounded-3xl"
          >
            Post Comment
          </button>
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
