import { getAllPosts } from "@/actions/post";
import AdminPostCard from "../_components/AdminPostCard";

export default async function page() {
  const data = await getAllPosts();
  console.log(data);
  return (
    <div>
      <div>Dashboard</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch mt-5">
        {data.map((d) => (
          <div key={d.id}>
            <AdminPostCard
              id={d.id}
              title={d.title}
              description={d.description}
              status={d.status}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
