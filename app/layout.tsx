import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/actions/auth";
import { AuthProvider } from "@/context/AuthContext";
import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("sonner").then((mod) => mod.Toaster));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Blog",
  description: "Blog application build with NextJS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <AuthProvider initialUser={user}>
          {children}
          <Toaster position="bottom-center" className="border" />
        </AuthProvider>
      </body>
    </html>
  );
}
