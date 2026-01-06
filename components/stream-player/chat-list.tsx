"use client";
import { ReceivedChatMessage } from "@livekit/components-react";
import { ChatMessages } from "./chat-message";
import { Skeleton } from "../ui/skeleton";

interface ChatListProps {
  isHidden: boolean;
  messages: ReceivedChatMessage[];
}

export const ChatList = ({ isHidden, messages }: ChatListProps) => {
  if (isHidden || !messages || messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center ">
        <p className="text-sm text-muted">
          {isHidden ? "Chat is Disabled" : "Welcome to chat"}
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col-reverse flex-1 overflow-y-auto p-3 h-full ">
      {messages.map((messages) => (
        <ChatMessages key={messages.timestamp} data={messages} />
      ))}
    </div>
  );
};

export const ChatListSkeleton = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Skeleton className="w-1/2 h-6" />
    </div>
  );
};
