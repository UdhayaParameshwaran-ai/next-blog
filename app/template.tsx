import React, { ReactNode } from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer/>
    </div>
  );
}
