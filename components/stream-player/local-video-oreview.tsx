"use client";

import { useEffect, useRef, useState } from "react";
import { useBroadcaster } from "@/store/use-broadcatser";
import { Track } from "livekit-client";

export const LocalVideoPreview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { room } = useBroadcaster();
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    if (!room) {
      console.log("No broadcaster room yet");
      return;
    }

    // Wait for video element to be ready
    const videoElement = videoRef.current;
    if (!videoElement) {
      console.log("Video element not ready, retrying...");
      // Retry after a short delay
      const timeout = setTimeout(() => {
        if (videoRef.current) {
          attachVideo();
        }
      }, 100);
      return () => clearTimeout(timeout);
    }

    attachVideo();

    function attachVideo() {
      if (!room || !videoRef.current) return;

      const localParticipant = room.localParticipant;
      const videoElement = videoRef.current;

      console.log(
        "Local participant tracks:",
        Array.from(localParticipant.trackPublications.values()).map((p) => ({
          source: p.source,
          kind: p.kind,
          sid: p.trackSid,
        }))
      );

      const handleTrackPublished = () => {
        const cameraPublication = Array.from(
          localParticipant.trackPublications.values()
        ).find(
          (pub) => pub.source === Track.Source.Camera && pub.kind === "video"
        );

        console.log(
          "Looking for camera track, found:",
          cameraPublication?.trackSid
        );

        if (!cameraPublication?.track) {
          console.log("No camera track available yet");
          return;
        }

        const track = cameraPublication.track;
        console.log("✅ Attaching local video preview");
        track.attach(videoElement);
        setHasVideo(true);
      };

      // Try immediately
      handleTrackPublished();

      // Also listen for future track publications
      localParticipant.on("trackPublished", handleTrackPublished);
    }

    return () => {
      if (!room) return;

      const localParticipant = room.localParticipant;
      localParticipant.off("trackPublished", attachVideo);

      // Detach all tracks
      const cameraPublication = Array.from(
        localParticipant.trackPublications.values()
      ).find((pub) => pub.source === Track.Source.Camera);

      if (cameraPublication?.track && videoRef.current) {
        console.log("Detaching local video preview");
        cameraPublication.track.detach(videoRef.current);
      }
    };
  }, [room, videoRef.current]); // Re-run when ref becomes available

  // Always render the video element
  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      {!hasVideo && room && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <p className="text-gray-400">Waiting for camera...</p>
        </div>
      )}
      {!room && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <p className="text-gray-400">Starting broadcast...</p>
        </div>
      )}
    </>
  );
};
