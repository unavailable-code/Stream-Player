"use client";

import { ReactNode } from "react";
import { useStreamLive } from "@/store/use-stream-live";

interface StreamLiveGateProps {
  hostIdentity: string;
  children: ReactNode;
}

export const StreamLiveGate = ({
  hostIdentity,
  children,
}: StreamLiveGateProps) => {
  const isLive = useStreamLive(hostIdentity);

  if (!isLive) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        <p className="text-lg text-muted-foreground">User is offline</p>
      </div>
    );
  }

  return <>{children}</>;
};
