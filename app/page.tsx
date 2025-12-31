"use client";
import { useUser } from "@/context/AuthContext";
import Image from "next/image";
import { useContext } from "react";
import Logout from "./_components/Logout";
import { useRouter } from "next/navigation";

export default function Home() {
  let { user } = useUser();
  if (!user) {
    return <p>Loading user Info....</p>;
  }

  return (
    <div>
      <h1>Home</h1>
      <div>
        <h2>{user.name}</h2>
        <h2>{user.email}</h2>
      </div>
      <Logout />
    </div>
  );
}
