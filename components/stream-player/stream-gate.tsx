"use client";

import { Track } from "livekit-client";
import {
  useRemoteParticipant,
  useLocalParticipant,
  useTracks,
} from "@livekit/components-react";

import { cn } from "@/lib/utils";
import { ChatToggle } from "./chat-toggle";
import { Video } from "./video";
import { Header } from "./header";
import { InfoCard } from "./info-card";
import { AboutCard } from "./about-card";
import { Chat } from "./chat";

interface StreamGateProps {
  user: any;
  stream: any;
  isFollowing: boolean;
  viewerName: string;
  viewerIdentity: string;
  collapsed: boolean;
}

export const StreamGate = ({
  user,
  stream,
  isFollowing,
  viewerName,
  viewerIdentity,
  collapsed,
}: StreamGateProps) => {
  /**
   * 🔹 Viewer ke liye → OBS = remote participant
   * 🔹 Host ke liye   → OBS = local participant
   */
  const remoteParticipant = useRemoteParticipant(user.id);
  const localParticipant = useLocalParticipant();

  /**
   * 🔹 Room ke saare video tracks
   */
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);

  /**
   * 🔹 Sirf host ke tracks
   */
  const hostTracks = tracks.filter((t) => t.participant.identity === user.id);

  const isHost = localParticipant.identity === user.id;

  /**
   * ✅ STREAM LIVE CONDITION (FINAL)
   */
  const isLive = hostTracks.length > 0 && (remoteParticipant || isHost);

  /* ❌ STREAM NOT LIVE */
  if (!isLive) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        User is offline
      </div>
    );
  }

  /* ✅ STREAM LIVE → POORA UI */
  return (
    <>
      {collapsed && (
        <div className="hidden lg:block fixed top-[100px] right-2 z-50">
          <ChatToggle />
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full",
          collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
        )}
      >
        {/* LEFT SIDE */}
        <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-4 pb-10">
          <Video hostName={user.username} hostIdentity={user.id} />

          <Header
            hostName={user.username}
            hostIdentity={user.id}
            viewerIdentity={viewerIdentity}
            imageUrl={user.imgUrl}
            isFollowing={isFollowing}
            name={stream.name}
          />

          <InfoCard
            hostIdentity={user.id}
            viewerIdentity={viewerIdentity}
            name={stream.name}
            thumbnailUrl={stream.thumbnailUrl}
          />

          <AboutCard
            hostName={user.username}
            hostIdentity={user.id}
            viewerIdentity={viewerIdentity}
            bio={user.bio}
            followedByCount={user._count.followedBy}
          />
        </div>

        {/* RIGHT SIDE – CHAT */}
        {!collapsed && (
          <div className="2xl:col-span-2 col-span-1">
            <Chat
              viewerName={viewerName}
              hostName={user.username}
              hostIdentity={user.id}
              isFollowing={isFollowing}
              isChatEnabled={stream.isChatEnabled}
              isChatDelayed={stream.isChatDelayed}
              isChatFollowersOnly={stream.isChatFollowersOnly}
            />
          </div>
        )}
      </div>
    </>
  );
};
