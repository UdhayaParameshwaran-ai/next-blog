import { logout } from "@/actions/auth";

export default function Logout() {
  const handleClick = async () => {
    await logout();
  };
  return (
    <div>
      <button
        className="cursor-pointer border  border-black px-5 py-2 mx-18 mt-3 rounded-3xl bg-black text-white hover:bg-white hover:text-black transition-colors"
        onClick={handleClick}
      >
        Log Out
      </button>
    </div>
  );
}
