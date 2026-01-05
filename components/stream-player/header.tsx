"use client";

import {
  useParticipants,
  useRemoteParticipant,
} from "@livekit/components-react";
import { UserAvatar, UserAvatarSkeleton } from "../user-avatar";
import { VerifiedMarks } from "./verified-marks";
import { UserIcon } from "lucide-react";
import { Actions, ActionsSkeleton } from "./actions";
import { Skeleton } from "../ui/skeleton";
import { InfoModal } from "./info-modal";
import { isFollowing } from "@/lib/follow-service";

interface HeaderProps {
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  isHost: boolean;
  name: string;
  imageUrl: string;
  isFollowing: boolean;
}

export const Header = ({
  hostName,
  isHost,
  name,
  imageUrl,
  hostIdentity,
  isFollowing,
}: HeaderProps) => {
  const participats = useParticipants();
  const participant = useRemoteParticipant(hostIdentity);

  const isLive = !!participant;
  const participantCount = participats.length - 1;
  return (
    <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-start justify-between px-4">
      <div className="flex items-center gap-x-3">
        <UserAvatar imageUrl={imageUrl} username={hostName} size="lg" isLive />
        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <h2 className="text-lg font-semibold">{hostName}</h2>
            <VerifiedMarks />
          </div>
          <p className="text-sm font-semibold">{name}</p>
          {isLive ? (
            <div className="font-semibold flex gap-x-1 items-center text-xs text-rose-500">
              <UserIcon className="h-5 w-5" />
              <p>
                {participantCount}{" "}
                {participantCount === 1 ? "viewer" : "viewers"}
              </p>
            </div>
          ) : (
            <p className="font-semibold text-xs text-muted-foreground">
              Offline
            </p>
          )}
        </div>
      </div>
      <Actions
        isFollowing={isFollowing}
        hostIdentity={hostIdentity}
        isHost={isHost}
      />
    </div>
  );
};

export const HeaderSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-start justify-between px-4">
      <div className="flex items-center gap-x-3">
        <UserAvatarSkeleton size="lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <ActionsSkeleton />
    </div>
  );
};
