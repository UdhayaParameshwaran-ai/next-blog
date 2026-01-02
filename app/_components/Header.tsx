"use client"
import { useUser } from "@/context/AuthContext";
import { CircleUserRound } from "lucide-react";
import Logout from "./Logout";

export default function Header() {
  const { user } = useUser();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">
        Blog Application
      </h1>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <CircleUserRound className="w-6 h-6 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {user?.name || "Guest"}
          </span>
        </div>
        <div className="h-6 w-[1px] bg-gray-300" />

        <Logout />
      </div>
    </header>
  );
}