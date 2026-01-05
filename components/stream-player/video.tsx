"use client";

import { ConnectionState, Track, Participant } from "livekit-client";
import {
  useConnectionState,
  useRemoteParticipant,
  useTracks,
} from "@livekit/components-react";
import { OfflineVideo } from "./offlne-video";
import { LoadingVideo } from "./loading-video";
import { LiveVideo } from "./live-video";
import { Skeleton } from "../ui/skeleton";

interface VideoProps {
  hostName: string;
  hostIdentity: string;
  showBrowserControls: boolean;
}

export const Video = ({
  hostName,
  hostIdentity,
  showBrowserControls,
}: VideoProps) => {
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);
  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.ScreenShare,
  ]).filter((t) => t.participant.identity === hostIdentity);

  const isHostOnline = !!participant;
  const hasVideoTracks = tracks.length > 0;

  console.log("=== Video Debug ===");
  console.log("Connection State:", connectionState);
  console.log("Host Identity:", hostIdentity);
  console.log("Participant found:", participant?.identity);
  console.log("Tracks found:", tracks.length);

  let content;
  if (connectionState === ConnectionState.Disconnected) {
    content = <OfflineVideo username={hostName} />;
  } else if (connectionState === ConnectionState.Connecting) {
    content = <LoadingVideo label="Connecting..." />;
  } else if (!isHostOnline) {
    content = <OfflineVideo username={hostName} />;
  } else if (isHostOnline && !hasVideoTracks) {
    content = (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-sm text-gray-400 mt-2">
            Waiting for video stream...
          </p>
        </div>
      </div>
    );
  } else {
    console.log("✅ Showing live video!");
    content = (
      <LiveVideo
        participant={participant as Participant}
        showBrowserControls={showBrowserControls}
      />
    );
  }

  return (
    <div className="border-b aspect-video relative bg-black">{content}</div>
  );
};

export const VideoSkeleton = () => {
  return (
    <div className="aspect-video bg-gray-800">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  );
};
