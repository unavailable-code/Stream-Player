"use client";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";
import { useState, useEffect } from "react";
import { ToggleSkeleton } from "./toggle";
import { RecommendedSkeleton } from "./recommended";
import { FollowingSkeleton } from "./following";

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  const [isClient, setIsClient] = useState(false);
  const { collapsed } = useSidebar((state) => state);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient)
    return (
      <aside className="fixed h-full z-50 bg-[#272935] flex flex-col border-r border-[#2D2E35] w-[70px] lg:w-60">
        <ToggleSkeleton />
        <FollowingSkeleton />
        <RecommendedSkeleton />
      </aside>
    );
  return (
    <aside
      className={cn(
        "fixed h-full z-50 bg-[#272935] flex flex-col border-r border-[#2D2E35] w-60",
        collapsed && "w-20"
      )}
    >
      {children}
    </aside>
  );
};
