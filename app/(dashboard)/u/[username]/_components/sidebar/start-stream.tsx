"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBroadcaster } from "@/store/use-broadcatser";
import { Minus, Plus } from "lucide-react";

export const BrowserStream = () => {
  const { start, stop, isBrowserLive } = useBroadcaster();
  const handleClick = () => {
    if (isBrowserLive) {
      stop();
    } else {
      start();
    }
  };
  return (
    <Button
      variant={isBrowserLive ? "destructive" : "primary"}
      className={cn("w-full flex items-center justify-center text-wrap h-12")}
      onClick={handleClick}
    >
      <span className="block lg:hidden text-xl font-bold">
        {isBrowserLive ? <Minus /> : <Plus />}
      </span>

    <span className="hidden lg:inline ">
  {isBrowserLive ? "End Stream" : "Start Stream"}
</span>

    </Button>
  );
};
