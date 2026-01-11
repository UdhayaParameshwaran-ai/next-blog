"use client";
import React, { ReactNode } from "react";
import Header from "./_components/Header";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader =
    pathname === "/signup" ||
    pathname === "/signin" ||
    pathname === "/unauthorized";
  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <Header />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
