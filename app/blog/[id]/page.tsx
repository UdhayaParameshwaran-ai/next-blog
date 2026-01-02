"use client";
import { addComment, getCommentsbyPostId } from "@/actions/comment";
import { getPostbyId } from "@/actions/post";
import { getUserById } from "@/actions/user";
import CommentBox from "@/app/_components/CommentBox";
import { useUser } from "@/context/AuthContext";
import { Comments, Post } from "@/lib/definitions";
import { PencilLine } from "lucide-react";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams();
  const [post, setPost] = useState<Post>();
  const [isLoading, setLoading] = useState(false);
  const [author, setAuthor] = useState<string>();
  const [comments, setComments] = useState<Comments[]>([]);

  const { user } = useUser();

  const addCommentWithIds = addComment.bind(null, {
    post: Number(id),
    //@ts-ignore
    author: user?.id,
  });

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        console.log("PostId: ", id);
        const res = await getPostbyId(Number(id));
        const data = res[0];
        setPost(data as Post);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);
  useEffect(() => {
    const fetchAuthorName = async () => {
      if (!post?.author) return;
      const res = await getUserById(post.author);
      setAuthor(res.name);
    };

    fetchAuthorName();
  }, [post?.author]);

  useEffect(()=>{
    const fetchComments=async()=>{
      if(!post?.id) return;
      const res =await getCommentsbyPostId(post.id);
      setComments(res)
    }
   fetchComments();
  },[post?.id])

  if (isLoading) return <p className="p-10 text-center">Loading...</p>;
  if (!post) return <p className="p-10 text-center">Post not found</p>;
  console.log("Comments: ",comments)
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
        <p className="text-lg text-gray-700">{post.description}</p>
      </div>
      <div className="space-y-2 w-full">
        <div className="text-2xl w-full">Comments</div>
        <form action={addCommentWithIds} className="flex space-x-3 w-full">
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
