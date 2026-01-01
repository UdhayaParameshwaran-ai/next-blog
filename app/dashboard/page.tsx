import { getAllPosts } from "@/actions/post";

export default async function page() {
  const data = await getAllPosts();
  console.log(data);
  return <div>Dashboard</div>;
}
