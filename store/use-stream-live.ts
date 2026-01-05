"use client";

import { Track } from "livekit-client";
import {
  useRemoteParticipant,
  useTracks,
} from "@livekit/components-react";

export const useStreamLive = (hostIdentity: string) => {
  const participant = useRemoteParticipant(hostIdentity);

  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.ScreenShare,
  ]).filter(
    (t) => t.participant.identity === hostIdentity
  );

  // ✅ LIVE only if video tracks exist
  return !!participant && tracks.length > 0;
};
