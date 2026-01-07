import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardFooterProps extends React.ComponentProps<"div"> {
  href?: string;
  likes?: number | null;
}
type PostStatus = "submitted" | "approved" | "rejected" | "blocked" | "updated";

interface CardHeaderProps extends React.ComponentProps<"div"> {
  postStatus?: PostStatus;
}

const statusStyles: Record<PostStatus, string> = {
  submitted: "bg-blue-100 text-blue-700 border-blue-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  blocked: "bg-gray-100 text-gray-700 border-gray-200",
  updated: "bg-yellow-200 text-yellow-700 border-yellow-700",
};

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-5 py-4 px-4 rounded-xl border shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  postStatus,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        "flex flex-row justify-between items-center",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5">{children}</div>

      {postStatus && (
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0",
            statusStyles[postStatus]
          )}
        >
          {postStatus.charAt(0).toUpperCase() + postStatus.slice(1)}
        </span>
      )}
    </div>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-xl font-bold text-gray-900 line-clamp-1", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-gray-500 mb-2 line-clamp-2", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-2 text-sm text-gray-500 line-clamp-2", className)}
      {...props}
    />
  );
}

function CardFooter({
  className,
  children,
  href,
  likes,
  ...props
}: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "px-2 flex justify-between gap-x-5 items-center",
        className
      )}
      {...props}
    >
      {href && (
        <Link
          href={href}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold cursor-pointer"
        >
          View Details →
        </Link>
      )}
      {likes !== undefined && likes !== null && (
        <span className="text-sm text-gray-600">{likes} Like(s)</span>
      )}
      {children}
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
