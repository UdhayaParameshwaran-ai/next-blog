import { UserRound } from "lucide-react";

type CommentBoxProps = {
  authorName: string;
  comment: string;
};

export default function CommentBox({ authorName, comment }: CommentBoxProps) {
  return (
    <div className="border-b border-gray-800 text-gray-800">
      <div className="flex flex-cols space-x-1 ">
        <UserRound width={15} />
        <div className="mb-2">
          {authorName} <span className="text-sm text-gray-800">commented</span>
        </div>
      </div>
      <div className="mb-2">{comment}</div>
    </div>
  );
}
