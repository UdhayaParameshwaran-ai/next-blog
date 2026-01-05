import Link from "next/link";

type PostStatus = "submitted" | "approved" | "rejected" | "blocked";

interface PostCardProps {
  id: number;
  title: string;
  description: string;
  status: PostStatus;
}

const AdminPostCard = ({ id, title, description, status }: PostCardProps) => {
  const statusStyles = {
    submitted: "bg-blue-100 text-blue-700 border-blue-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    blocked: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return (
    <div className="max-w-md p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
          {title}
        </h2>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <p className="text-gray-600 text-sm line-clamp-1 mb-4">{description}</p>

      <Link
        href={`dashboard/userPost/${id}`}
        className="text-blue-600 hover:text-blue-800 text-sm font-semibold cursor-pointer"
      >
        View Details →
      </Link>
    </div>
  );
};

export default AdminPostCard;
