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
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) {
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

      const handleTrackPublished = () => {
        const cameraPublication = Array.from(
          localParticipant.trackPublications.values()
        ).find(
          (pub) => pub.source === Track.Source.Camera && pub.kind === "video"
        );

        if (!cameraPublication?.track) {
          return;
        }

        const track = cameraPublication.track;
        track.attach(videoElement);
        setHasVideo(true);
      };

      handleTrackPublished();
      localParticipant.on("trackPublished", handleTrackPublished);
    }

    return () => {
      if (!room) return;

      const localParticipant = room.localParticipant;
      localParticipant.off("trackPublished", attachVideo);
      const cameraPublication = Array.from(
        localParticipant.trackPublications.values()
      ).find((pub) => pub.source === Track.Source.Camera);

      if (cameraPublication?.track && videoRef.current) {
        cameraPublication.track.detach(videoRef.current);
      }
    };
  }, [room, videoRef.current]);

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
