import { getApprovedPosts } from "@/actions/post";
import HomePostCard from "./_components/HomePostCard";

export default async function Home() {
  const posts=await getApprovedPosts();
  console.log(posts)
  return (
    <div>
      Home
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch mt-5">
        {posts.map((post)=>(
          <div key={post.id}>
           <HomePostCard id={post.id} title={post.title} description={post.description} upvotes={post.upvotes} author={post.author}/>
          </div>
        ))}
      </div>
    </div>
  );
}
