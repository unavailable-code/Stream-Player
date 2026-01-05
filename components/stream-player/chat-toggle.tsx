"use client";

import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { Button } from "../ui/button";
import { useChatSidebar } from "@/store/use-chat-sidebbar";

export const ChatToggle = () => {
  const { collapsed, onCollapse, onExpand } = useChatSidebar((state) => state);

  const Icon = collapsed ? ArrowLeftFromLine : ArrowRightFromLine;
  const onToggle = () => {
    if (collapsed) {
      onExpand();
    } else {
      onCollapse();
    }
  };

  const label = collapsed ? "Expand" : "Collapse";
  return (
    <Button
      onClick={onToggle}
      className="h-auto p-2 hover:bg-white/10  bg-transparent"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};
