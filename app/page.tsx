import { getApprovedPosts } from "@/actions/post";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const posts = await getApprovedPosts();
  if (!Array.isArray(posts)) {
    toast.error("Failed to Fetch Posts");
    return;
  }
  return (
    <div className="px-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch mt-5">
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
    </div>
  );
}
