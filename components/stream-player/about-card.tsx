"use client";

import { BioModal } from "./bio-modal";
import { VerifiedMarks } from "./verified-marks";

interface aboutCardProps {
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  isHost: boolean;
  bio: string | null;
  followedByCount: number;
}

export const AboutCard = ({
  hostName,
  hostIdentity,
  viewerIdentity,
  isHost,
  bio,
  followedByCount,
}: aboutCardProps) => {
  const hostAsViewer = `host-${hostIdentity}`;
  // const isHost = viewerIdentity === hostAsViewer;

  const followedByLabel = followedByCount === 1 ? "Follower" : "Followers";
  return (
    <div className="px-4 hidden-scrollbar">
      <div className="group rounded-xl bg-gray-800 p-6 lg:p-10 flex flex-col gap-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 font-semibold text-lg lg:text-2xl">
            About {hostName}
            <VerifiedMarks />
          </div>
          {isHost && <BioModal initialValue={bio} />}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold">{followedByCount}</span>{" "}
          {followedByLabel}
        </div>
        <p className="text-sm">
          {bio || "I think our friend here is a little shy"}
        </p>
      </div>
    </div>
  );
};
