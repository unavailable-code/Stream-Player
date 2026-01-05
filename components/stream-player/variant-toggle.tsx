"use client";

import { MessageSquare, User } from "lucide-react";
import { Hint } from "../hint";
import { Button } from "../ui/button";
import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebbar";

export const VariantToggle = () => {
  const { variant, onChangeVariant } = useChatSidebar((state) => state);
  const isChat = variant === ChatVariant.CHAT;
  const Icon = isChat ? User : MessageSquare;
  const onToggle = () => {
    const newVariant = isChat ? ChatVariant.COMMUNITY : ChatVariant.CHAT;
    onChangeVariant(newVariant);
  };

  const label = isChat ? "Community" : "Go back to chat";
  return (
    <Button
      onClick={onToggle}
      className="h-auto p-2 hover:bg-white/10  bg-transparent"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};
