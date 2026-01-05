"use client";

import { useBroadcaster } from "@/store/use-broadcatser";
import { RoomContext } from "@livekit/components-react";
import { ReactNode } from "react";

interface BroadcastRoomWrapperProps {
  children: ReactNode;
}

export const BroadcastRoomWrapper = ({
  children,
}: BroadcastRoomWrapperProps) => {
  const { room } = useBroadcaster();

  if (!room) {
    return <>{children}</>;
  }

  // Provide the broadcaster room as context so LiveKit hooks work
  return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>;
};
