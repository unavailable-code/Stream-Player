"use client";
import { Skeleton } from "../ui/skeleton";
import { ChatToggle } from "./chat-toggle";
import { VariantToggle } from "./variant-toggle";
export const ChatHeader = () => {
  return (
    <div className="relative bottom-b p-3">
      <div className="absolute hidden lg:block top-2 left-2">
        <ChatToggle />
      </div>
      <p className="font-semibold text-center ">Stream Chat</p>
      <div className="absolute right-2 top-2">
        <VariantToggle />
      </div>
    </div>
  );
};

export const ChatHeaderSkeleton = () => {
  return (
    <div className="p-3 relative bottom-b hidden md:block">
      <Skeleton className="h-6 w-6 absolute left-3 top-3" />
      <Skeleton className="w-28 h-6 mx-auto" />
    </div>
  );
};
