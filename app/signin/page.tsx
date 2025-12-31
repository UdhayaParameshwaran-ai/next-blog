"use client";
import { signin } from "@/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function Signin() {
  const [state, action, pending] = useActionState(signin, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="p-10 border-2 border-black bg-white w-fit rounded-xl flex">
        <form action={action} className="space-y-5 text-black">
          <div className="flex items-center justify-center text-2xl mb-4 font-bold">
            Sign In
          </div>
          <div className="flex items-center">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="ml-11 border border-black rounded-lg px-2 py-1 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {state?.errors?.email && (
            <p className="text-sm text-red-500">{state.errors.email}</p>
          )}
          <div className="flex items-center">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="ml-4 border border-black rounded-lg px-2 py-1 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {state?.errors?.password && (
            <div className="text-sm text-red-500">
              <p>Password must:</p>
              <ul className="list-disc list-inside">
                {state.errors.password.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center text-blue-500">
            <Link href={"/signup"}>Don't have an Account? Sign Up</Link>
          </div>
          <div>
            {state?.message && (
              <p className="text-sm text-red-500">*{state?.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="cursor-pointer border  border-black px-5 py-2 mx-18 mt-3 rounded-3xl bg-black text-white hover:bg-white hover:text-black transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
