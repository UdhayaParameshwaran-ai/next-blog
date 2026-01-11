"use client";

import { useActionState, startTransition } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signup } from "@/actions/auth";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Signup() {
  const [state, action, pending] = useActionState(signup, undefined);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });
  const onSubmit = (data: any) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      action(formData);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="p-10 border-2 border-black bg-white w-full max-w-md rounded-xl">
        <div className="flex items-center justify-center text-2xl mb-6 font-bold text-black">
          Sign Up
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="font-semibold min-w-[70px]">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        className="border-black focus-visible:ring-black"
                      />
                    </FormControl>
                  </div>
                  {state?.errors?.name && (
                    <p className="text-sm text-red-500">{state.errors.name}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="font-semibold min-w-[70px]">
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
                    <FormLabel className="font-semibold min-w-[70px]">
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
                        {state.errors.password.map((error) => (
                          <li key={error}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {state?.message && (
              <p className="text-sm text-red-500 font-medium">
                *{state.message}
              </p>
            )}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="font-semibold min-w-[70px]">
                      Role
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-black focus:ring-black">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col items-center gap-4 pt-2">
              <Link
                href="/signin"
                className="text-blue-500 text-sm hover:underline"
              >
                Already have an Account? Sign in
              </Link>
              <Button type="submit" disabled={pending}>
                {pending ? "Signing Up..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
