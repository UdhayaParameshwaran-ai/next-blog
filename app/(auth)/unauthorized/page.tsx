import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="flex flex-col items-center text-center max-w-md  border-2 p-10 rounded-xl">
        <div className="bg-red-100 p-4 rounded-full mb-6">
          <ShieldAlert className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-black mb-2">Access Denied</h1>

        <p className="text-gray-600 mb-8">
          {"Oops! You don't have the permission level required to view the"}
          <strong> Dashboard</strong>. Please contact your administrator if you
          believe this is a mistake.
        </p>

        <div className="flex flex-col w-full gap-3">
          <Button asChild variant="default">
            <Link href="/">Back to Home</Link>
          </Button>

          <Link
            href="/signin"
            className="text-sm text-gray-500 hover:text-black hover:underline transition-all"
          >
            Sign in with a different account
          </Link>
        </div>
      </div>
    </div>
  );
}
