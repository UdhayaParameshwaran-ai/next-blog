"use client";

import { useActionState, startTransition } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signin } from "@/actions/auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Signin() {
  const [state, action, pending] = useActionState(signin, undefined);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: any) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      action(formData);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="p-10 border-2 border-black bg-white w-full max-w-md rounded-xl">
        <div className="flex items-center justify-center text-2xl mb-6 font-bold text-black">
          Sign In
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="font-semibold min-w-[80px]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        {...field}
                        className="border-black focus-visible:ring-black"
                      />
                    </FormControl>
                  </div>
                  {state?.errors?.email && (
                    <p className="text-sm text-red-500">{state.errors.email}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="font-semibold min-w-[80px]">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="border-black focus-visible:ring-black"
                      />
                    </FormControl>
                  </div>
                  {state?.errors?.password && (
                    <div className="text-sm text-red-500 mt-2">
                      <p>Password must:</p>
                      <ul className="list-disc list-inside">
                        {state.errors.password.map((error: string) => (
                          <li key={error}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4 items-center">
              <Link
                href="/signup"
                className="text-blue-500 text-sm hover:underline"
              >
                Don't have an Account? Sign Up
              </Link>

              {state?.message && (
                <p className="text-sm text-red-500 font-medium">
                  *{state.message}
                </p>
              )}

              <Button
                type="submit"
                disabled={pending}
                className="w-1/2 bg-black text-white rounded-3xl hover:bg-white hover:text-black border border-black transition-colors"
              >
                {pending ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
