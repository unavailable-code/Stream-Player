"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/store/use-sidebar";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

export const Toggle = () => {
  const { collapsed, onExpand, onCollapse } = useSidebar((state) => state);
  const label = collapsed ? "Expand" : "Collapse";
  return (
    <>
      {collapsed && (
        <div className="hidden lg:flex items-center justify-center pt-4 mb-4">
          <Hint label={label} asChild side="right">
            <Button
              className="h-auto p-2 text-white bg-primary hover:text-muted"
              onClick={onExpand}
            >
              <ArrowRightFromLine className="h-10 w-4" />
            </Button>
          </Hint>
        </div>
      )}

      {!collapsed && (
        <div className="flex items-center w-full p-3 pl-6 mb-2 ">
          <p className="font-semibold text-theme">For u</p>
          <Hint label={label} side="right" asChild align="center">
            <Button
              onClick={onCollapse}
              className="ml-auto h-8 p-2 text-white bg-primary hover:text-muted-foreground"
            >
              <ArrowLeftFromLine className="h-8 w-4" />
            </Button>
          </Hint>
        </div>
      )}
    </>
  );
};

export const ToggleSkeleton = () => {
  return (
    <div className="p-3 pl-6 mb-2 hidden lg:flex items-center justify-between w-full bg-theme">
      <Skeleton className="h-6 w-[100px]" />
      <Skeleton className="h-6 w-6" />
    </div>
  );
};
