import { logout } from "@/actions/auth";

export default function Logout() {
  const handleClick = async () => {
    await logout();
  };
  return (
    <div>
      <button
        className="cursor-pointer border text-sm  border-black px-5 py-1 mx-3 rounded-3xl bg-black text-white hover:bg-white hover:text-black transition-colors"
        onClick={handleClick}
      >
        Log Out
      </button>
    </div>
  );
}
