"use client";
import { useUser } from "@/context/AuthContext";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";

export default function Header() {
  const { user } = useUser();
  const isAdmin = user?.id == 5;
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <Link href="/">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          Blog Application
        </h1>
      </Link>
      <nav className="flex justify-between items-center px-8 py-3 bg-white">
        <ul className="flex items-center gap-8">
          <li>
            <Link
              href="/"
              className="font-medium  text-black hover:opacity-50 transition-opacity"
            >
              Home
            </Link>
          </li>
          <div className="h-6 w-[1px] bg-gray-300" />
          <li>
            <Link
              href="/post"
              className="font-medium text-black hover:opacity-50 transition-opacity"
            >
              Your Posts
            </Link>
          </li>
          {isAdmin && (
            <>
              <div className="h-6 w-[1px] bg-gray-300" />
              <li>
                <Link
                  href="/dashboard"
                  className="font-medium text-black hover:opacity-50 transition-opacity"
                >
                  Admin Dashboard
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <CircleUserRound className="w-6 h-6 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {user?.name || "Guest"}
          </span>
        </div>
        <div className="h-6 w-[1px] bg-gray-300" />
        {/* <Logout /> */}
        <Button onClick={handleLogout} variant="outline">
          Log out
        </Button>
      </div>
    </header>
  );
}
