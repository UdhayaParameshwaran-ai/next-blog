import { getUserById } from "@/actions/user";
import Link from "next/link";

type PostStatus = "submitted" | "approved" | "rejected";

interface PostCardProps {
  id: number;
  title: string;
  description: string;
  upvotes: number | null;
  author: number | null;
}

const HomePostCard = async ({
  id,
  title,
  description,
  upvotes,
  author,
}: PostCardProps) => {
  //@ts-ignore
  const user = await getUserById(author);
  const userName = user.name;

  return (
    <div className="max-w-md p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
          {title}
        </h2>
      </div>

      <p className="text-gray-600 text-sm line-clamp-1 mb-4">{description}</p>

      <div className="flex justify-between ">
        <Link
          href={`/blog/${id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold cursor-pointer"
        >
          View Details →
        </Link>
        <span className="text-sm text-gray-600">Author: {userName}</span>
        <span className="text-sm text-gray-600">{upvotes} Likes</span>
      </div>
    </div>
  );
};

export default HomePostCard;
