"use client";

import { Participant, Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";
import { useEffect, useRef, useState, memo, useCallback } from "react";
import { VolumeControl } from "./volume-control";
import { FullScreenControl } from "./fullscreen-control";
import { Mic, MicOff, Monitor, MonitorOff } from "lucide-react";

interface LiveVideoProps {
  participant: Participant;
  showBrowserControls: boolean;
  isCurrentUser?: boolean;
  onToggleMic?: () => void; // NEW: Mic toggle callback
  onToggleScreenShare?: () => void; // NEW: Screen share callback
  isMicEnabled?: boolean; // NEW: Mic state
  isScreenSharing?: boolean; // NEW: Screen share state
}

export const LiveVideo = memo(
  ({
    participant,
    showBrowserControls,
    isCurrentUser = false,
    onToggleMic,
    onToggleScreenShare,
    isMicEnabled = true,
    isScreenSharing = false,
  }: LiveVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const attachedTracksRef = useRef<Set<string>>(new Set());

    const [volume, setVolume] = useState(100);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // 🎯 Include ScreenShareAudio for tab audio
    const tracks = useTracks([
      Track.Source.ScreenShare,
      Track.Source.ScreenShareAudio, // NEW: Tab audio
      Track.Source.Camera,
      Track.Source.Microphone,
    ]).filter((t) => t.participant.identity === participant.identity);

    // Attach/detach tracks
    useEffect(() => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      // Find video track (screenshare > camera)
      const videoTrack =
        tracks.find(
          (t) => t.source === Track.Source.ScreenShare && t.publication?.track
        ) ||
        tracks.find(
          (t) => t.source === Track.Source.Camera && t.publication?.track
        );

      // Find microphone audio
      const micAudioTrack = tracks.find(
        (t) => t.source === Track.Source.Microphone && t.publication?.track
      );

      // 🔊 NEW: Find screen share audio (tab audio)
      const screenAudioTrack = tracks.find(
        (t) =>
          t.source === Track.Source.ScreenShareAudio && t.publication?.track
      );

      const newAttachedTracks = new Set<string>();

      // Attach video track
      if (videoTrack?.publication?.track) {
        const trackSid = videoTrack.publication.trackSid;
        if (!attachedTracksRef.current.has(trackSid)) {
          console.log("🎥 Attaching video track:", trackSid);
          videoTrack.publication.track.attach(videoElement);
          attachedTracksRef.current.add(trackSid);
        }
        newAttachedTracks.add(trackSid);
      }

      // Attach mic audio (skip if current user to avoid feedback)
      if (micAudioTrack?.publication?.track && !isCurrentUser) {
        const trackSid = micAudioTrack.publication.trackSid;
        if (!attachedTracksRef.current.has(trackSid)) {
          console.log("🎤 Attaching mic audio track:", trackSid);
          micAudioTrack.publication.track.attach(videoElement);
          attachedTracksRef.current.add(trackSid);
        }
        newAttachedTracks.add(trackSid);
      }

      // 🔊 NEW: Attach screen share audio (ALWAYS, even for current user)
      // Tab audio should be heard by everyone including host
      if (screenAudioTrack?.publication?.track) {
        const trackSid = screenAudioTrack.publication.trackSid;
        if (!attachedTracksRef.current.has(trackSid)) {
          console.log("🔊 Attaching screen share audio:", trackSid);
          screenAudioTrack.publication.track.attach(videoElement);
          attachedTracksRef.current.add(trackSid);
        }
        newAttachedTracks.add(trackSid);
      }

      // Detach removed tracks
      const tracksToDetach = Array.from(attachedTracksRef.current).filter(
        (sid) => !newAttachedTracks.has(sid)
      );

      tracksToDetach.forEach((sid) => {
        const track = tracks.find((t) => t.publication?.trackSid === sid);
        if (track?.publication?.track) {
          console.log("🔇 Detaching track:", sid);
          track.publication.track.detach(videoElement);
        }
        attachedTracksRef.current.delete(sid);
      });

      // Set audio state
      // If host AND no screen audio, mute. Otherwise follow volume settings
      const shouldMute = isCurrentUser && !screenAudioTrack;

      if (shouldMute) {
        videoElement.muted = true;
        videoElement.volume = 0;
      } else {
        videoElement.muted = volume === 0;
        videoElement.volume = volume / 100;
      }

      // Try to play
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Autoplay prevented:", err.message);
        });
      }
    }, [tracks, volume, isCurrentUser]);

    // Volume control
    const handleVolumeChange = useCallback((newVolume: number) => {
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume / 100;
        videoRef.current.muted = newVolume === 0;
      }
    }, []);

    const toggleMute = useCallback(() => {
      setVolume((v) => {
        const newVolume = v === 0 ? 50 : 0;
        if (videoRef.current) {
          videoRef.current.volume = newVolume / 100;
          videoRef.current.muted = newVolume === 0;
        }
        return newVolume;
      });
    }, []);

    // Fullscreen
    useEffect(() => {
      const handleChange = () => {
        setIsFullScreen(document.fullscreenElement === wrapperRef.current);
      };

      document.addEventListener("fullscreenchange", handleChange);
      return () =>
        document.removeEventListener("fullscreenchange", handleChange);
    }, []);

    const toggleFullScreen = useCallback(() => {
      if (!wrapperRef.current) return;

      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        wrapperRef.current.requestFullscreen();
      }
    }, []);

    return (
      <div ref={wrapperRef} className="relative h-full w-full bg-black group">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={false} // Let logic handle muting
          className="h-full w-full object-cover"
        />

        {/* Host Controls - Top Left */}
        {isCurrentUser && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
            {/* Mic Toggle */}
            {onToggleMic && (
              <button
                onClick={onToggleMic}
                className={`p-2 rounded-lg transition-colors ${
                  isMicEnabled
                    ? "bg-white/20 hover:bg-white/30 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
                title={isMicEnabled ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isMicEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </button>
            )}

            {/* Screen Share Toggle */}
            {onToggleScreenShare && (
              <button
                onClick={onToggleScreenShare}
                className={`p-2 rounded-lg transition-colors hidden ${
                  isScreenSharing
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
                title={
                  isScreenSharing ? "Stop Screen Share" : "Start Screen Share"
                }
              >
                {isScreenSharing ? (
                  <MonitorOff className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        )}

        {/* Viewer Controls - Bottom Right */}
        {!showBrowserControls && (
          <div className="absolute bottom-3 right-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <VolumeControl
              value={volume}
              onChange={handleVolumeChange}
              onToggle={toggleMute}
            />
            <FullScreenControl
              isFullScreen={isFullScreen}
              onToggle={toggleFullScreen}
            />
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.participant.identity === nextProps.participant.identity &&
      prevProps.showBrowserControls === nextProps.showBrowserControls &&
      prevProps.isCurrentUser === nextProps.isCurrentUser &&
      prevProps.isMicEnabled === nextProps.isMicEnabled &&
      prevProps.isScreenSharing === nextProps.isScreenSharing
    );
  }
);

LiveVideo.displayName = "LiveVideo";
