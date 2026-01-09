"use client";

import { useViewerToken } from "@/app/hooks/use-viewer-token";
import { LiveKitRoom } from "@livekit/components-react";
import { Video, VideoSkeleton } from "./video";
import { cn } from "@/lib/utils";
import { useChatSidebar } from "@/store/use-chat-sidebbar";
import { Chat, ChatSkeleton } from "./chat";
import { ChatToggle } from "./chat-toggle";
import { Header, HeaderSkeleton } from "./header";
import { InfoCard } from "./info-card";
import { AboutCard } from "./about-card";
import { useBroadcaster } from "@/store/use-broadcatser";
import { BroadcastRoomWrapper } from "./broadcast-room-wapper";

type CustomStream = {
  id: string;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
  isChatEnabled: boolean;
  name: string;
  isLive: boolean;
  thumbnailUrl: string | null;
};

type CustomUser = {
  id: string;
  username: string;
  bio: string | null;
  stream: CustomStream | null;
  imgUrl: string;
  _count: { followedBy: number };
};

interface StreamPlayerProps {
  user: CustomUser;
  stream: CustomStream;
  isFollowing: boolean;
}

export const StreamPlayer = ({
  user,
  stream,
  isFollowing,
}: StreamPlayerProps) => {
  const { name, identity, token } = useViewerToken(user.id);
  const { collapsed } = useChatSidebar();
  const { isBrowserLive } = useBroadcaster();

  const normalizeIdentity = (id: string) =>
    id.startsWith("obs-") ? id.replace("obs-", "") : id;

  const isHost = normalizeIdentity(identity) === normalizeIdentity(user.id);

  console.log("Viewer id is ", user.id);
  console.log("Host id is ", identity);
  console.log("Is Host :", isHost);

  const Layout = (
    <div
      className={cn(
        // MOBILE
        "min-h-screen flex flex-col overflow-y-auto",

        // DESKTOP
        "md:h-dvh md:flex-row md:overflow-hidden"
      )}
    >
      {/* MAIN CONTENT */}
      <div
        className="
    flex-1
    space-y-4
    bg-theme
    md:pb-16
    md:h-full
    md:overflow-y-auto hidden-scrollbar
  "
      >
        <Video
          hostName={user.username}
          hostIdentity={user.id}
          showBrowserControls={isBrowserLive && isHost}
        />
        <Header
          hostName={user.username}
          hostIdentity={user.id}
          viewerIdentity={identity}
          isHost={isHost}
          imageUrl={user.imgUrl}
          isFollowing={isFollowing}
          name={stream.name}
        />
        <InfoCard
          hostIdentity={user.id}
          viewerIdentity={identity}
          isHost={isHost}
          name={stream.name}
          thumbnailUrl={stream.thumbnailUrl}
        />
        <AboutCard
          hostName={user.username}
          hostIdentity={user.id}
          viewerIdentity={identity}
          isHost={isHost}
          bio={user.bio}
          followedByCount={user._count.followedBy}
        />
      </div>

      {/* CHAT PANEL */}
      {!collapsed && (
        <div className="w-full md:w-[380px] md:h-full md:overflow-y-auto border-l">
          <Chat
            viewerName={name}
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
  );

  return (
    <>
      {collapsed && (
        <div className="hidden lg:block fixed top-[100px] right-2 z-50">
          <ChatToggle />
        </div>
      )}

      {isBrowserLive ? (
        <BroadcastRoomWrapper>{Layout}</BroadcastRoomWrapper>
      ) : (
        <LiveKitRoom
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
          connect={!isHost || stream.isLive}
        >
          {Layout}
        </LiveKitRoom>
      )}
    </>
  );
};
