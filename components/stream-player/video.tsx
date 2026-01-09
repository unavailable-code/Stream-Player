"use client";

import { ConnectionState, Track, Participant } from "livekit-client";
import {
  useConnectionState,
  useRemoteParticipant,
  useTracks,
  useLocalParticipant,
} from "@livekit/components-react";
import { memo, useMemo, useCallback, useState } from "react";
import { OfflineVideo } from "./offlne-video";
import { LoadingVideo } from "./loading-video";
import { LiveVideo } from "./live-video";
import { Skeleton } from "../ui/skeleton";

interface VideoProps {
  hostName: string;
  hostIdentity: string;
  showBrowserControls: boolean;
}

export const Video = memo(
  ({ hostName, hostIdentity, showBrowserControls }: VideoProps) => {
    const connectionState = useConnectionState();
    const participant = useRemoteParticipant(hostIdentity);
    const { localParticipant } = useLocalParticipant();

    const tracks = useTracks([
      Track.Source.Camera,
      Track.Source.ScreenShare,
      Track.Source.ScreenShareAudio,
      Track.Source.Microphone,
    ]).filter((t) => t.participant.identity === hostIdentity);

    const isHostOnline = !!participant;
    const hasVideoTracks = useMemo(
      () => tracks.some((t) => t.publication?.kind === "video"),
      [tracks]
    );

    const isCurrentUser = useMemo(
      () => localParticipant?.identity === hostIdentity,
      [localParticipant?.identity, hostIdentity]
    );

    const [isMicEnabled, setIsMicEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const handleToggleMic = useCallback(async () => {
      if (!localParticipant) return;

      try {
        const micTrack = localParticipant.getTrackPublication(
          Track.Source.Microphone
        );

        if (micTrack) {
          if (isMicEnabled) {
            await localParticipant.setMicrophoneEnabled(false);
            setIsMicEnabled(false);
            console.log("Microphone muted");
          } else {
            await localParticipant.setMicrophoneEnabled(true);
            setIsMicEnabled(true);
            console.log("Microphone unmuted");
          }
        }
      } catch (error) {
        console.error("Error toggling microphone:", error);
        alert("Failed to toggle microphone");
      }
    }, [localParticipant, isMicEnabled]);

    // Toggle Screen Share
    const handleToggleScreenShare = useCallback(async () => {
      if (!localParticipant) return;

      try {
        if (isScreenSharing) {
          // Stop screen share
          await localParticipant.setScreenShareEnabled(false);
          setIsScreenSharing(false);
          console.log("Screen sharing stopped");
        } else {
          await localParticipant.setScreenShareEnabled(true, {
            audio: true,
            selfBrowserSurface: "include",
            surfaceSwitching: "include",
            systemAudio: "include",
          });
          setIsScreenSharing(true);
          console.log("🖥️ Screen sharing started");
        }
      } catch (error) {
        console.error("Error toggling screen share:", error);
        alert("Failed to toggle screen share");
      }
    }, [localParticipant, isScreenSharing]);

    const content = useMemo(() => {
      if (connectionState === ConnectionState.Disconnected) {
        return <OfflineVideo username={hostName} />;
      }

      if (connectionState === ConnectionState.Connecting) {
        return <LoadingVideo label="Connecting..." />;
      }

      if (!isHostOnline) {
        return <OfflineVideo username={hostName} />;
      }

      if (isHostOnline && !hasVideoTracks) {
        return (
          <div className="flex items-center justify-center h-full bg-gray-900 text-white">
            <div className="text-center">
              <p className="text-sm text-gray-400 mt-2">
                Waiting for video stream...
              </p>
            </div>
          </div>
        );
      }

      return (
        <LiveVideo
          participant={participant as Participant}
          showBrowserControls={showBrowserControls}
          isCurrentUser={isCurrentUser}
          onToggleMic={isCurrentUser ? handleToggleMic : undefined}
          onToggleScreenShare={
            isCurrentUser ? handleToggleScreenShare : undefined
          }
          isMicEnabled={isMicEnabled}
          isScreenSharing={isScreenSharing}
        />
      );
    }, [
      connectionState,
      isHostOnline,
      hasVideoTracks,
      participant,
      hostName,
      showBrowserControls,
      isCurrentUser,
      handleToggleMic,
      handleToggleScreenShare,
      isMicEnabled,
      isScreenSharing,
    ]);

    return (
      <div className="border-b aspect-video relative bg-black">{content}</div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.hostIdentity === nextProps.hostIdentity &&
      prevProps.showBrowserControls === nextProps.showBrowserControls
    );
  }
);

export const VideoSkeleton = () => {
  return (
    <div className="aspect-video bg-gray-800">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  );
};
