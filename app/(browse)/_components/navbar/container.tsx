"use client";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";
import { useMediaQuery } from "usehooks-ts";
import { useEffect } from "react";

import { useRouter } from "next/navigation";
interface ContainerProps {
  children: React.ReactNode;
}
export const Container = ({ children }: ContainerProps) => {
  const route = useRouter();
  const matches = useMediaQuery("(max-width:1024px)");
  const { collapsed, onCollapse, onExpand } = useSidebar((state) => state);
  useEffect(() => {
    if (matches) {
      onCollapse();
    } else {
      onExpand();
    }
  }, [matches, onCollapse, onExpand]);
  return (
    <div
      className={cn(
        "flex-1 h-screen w-full bg-black text-white",
        collapsed ? "ml-20" : "ml-20 lg:ml-60 h-screen w-full"
      )}
    >
      {children}
    </div>
  );
};
