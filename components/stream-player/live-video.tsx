"use client";

import { Participant, Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";
import { useEffect, useRef, useState } from "react";
import { VolumeControl } from "./volume-control";
import { FullScreenControl } from "./fullscreen-control";

interface LiveVideoProps {
  participant: Participant;
}

export const LiveVideo = ({ participant }: LiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [volume, setVolume] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // ScreenShare gets priority automatically
  const tracks = useTracks([
    Track.Source.ScreenShare,
    Track.Source.Camera,
  ]).filter((t) => t.participant.identity === participant.identity);

  // Attach track
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const videoTrack = tracks.find(
      (t) => t.publication?.kind === "video" && !t.publication?.track?.isMuted
    );

    if (!videoTrack?.publication?.track) return;

    const track = videoTrack.publication.track;
    track.attach(videoElement);

    return () => {
      track.detach(videoElement);
    };
  }, [tracks.length]);

  // Volume sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = volume === 0;
    }
  }, [volume]);

  // Fullscreen state sync
  useEffect(() => {
    const handleChange = () => {
      setIsFullScreen(document.fullscreenElement === wrapperRef.current);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // Fullscreen toggle
  const toggleFullScreen = () => {
    if (!wrapperRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapperRef.current.requestFullscreen();
    }
  };

  const toggleMute = () => {
    setVolume((v) => (v === 0 ? 50 : 0));
  };

  return (
    <div ref={wrapperRef} className="relative h-full w-full bg-black group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />

      {/* 🎛 Controls overlay */}
      <div className="absolute bottom-3 right-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <VolumeControl
          value={volume}
          onChange={setVolume}
          onToggle={toggleMute}
        />
        <FullScreenControl
          isFullScreen={isFullScreen}
          onToggle={toggleFullScreen}
        />
      </div>
    </div>
  );
};
