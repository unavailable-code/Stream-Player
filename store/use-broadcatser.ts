import { create } from "zustand";
import { Room } from "livekit-client";
import { getBroadcasterToken } from "@/Actions/broadcast";

interface BroadcasterState {
  room: Room | null;
  isBrowserLive: boolean;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  toggleMic: () => Promise<void>;
  
  toggleScreenShare: () => Promise<void>;
}

export const useBroadcaster = create<BroadcasterState>((set, get) => ({
  room: null,
  isBrowserLive: false,

  start: async () => {
    if (get().isBrowserLive) return;
    
    try {
      const token = await getBroadcasterToken();
      console.log("Generated broadcaster token");
      
      const room = new Room();

      await room.connect(
        process.env.NEXT_PUBLIC_LIVEKIT_WS_URL!,
        token
      );

      console.log("Room connected, local participant:", room.localParticipant.identity);

      // Add event listeners BEFORE enabling tracks
      room.localParticipant.on("trackPublished", (pub) => {
        console.log("✅ Track published:", pub.source, pub.kind, pub.trackSid);
      });

      room.localParticipant.on("trackUnpublished", (pub) => {
        console.log("❌ Track unpublished:", pub.source);
      });

      room.on("disconnected", () => {
        console.log("Room disconnected");
        set({ room: null, isBrowserLive: false });
      });

      room.on("participantConnected", (participant) => {
        console.log("Participant connected:", participant.identity);
      });

      // Enable camera and microphone with proper error handling
      try {
        console.log("Enabling camera...");
        await room.localParticipant.setScreenShareEnabled(true);
        console.log("Screenshare enabled");
      } catch (err) {
        console.error("Failed to enable Screenshare:", err);
      }

      try {
        console.log("Enabling microphone...");
        await room.localParticipant.setMicrophoneEnabled(true);
        console.log("Microphone enabled");
      } catch (err) {
        console.error("Failed to enable microphone:", err);
      }

      // Wait a bit for tracks to publish
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Published tracks:", 
        Array.from(room.localParticipant.trackPublications.values()).map(p => ({
          source: p.source,
          kind: p.kind,
          sid: p.trackSid,
        }))
      );

      set({ room, isBrowserLive: true });
      console.log("✅ Broadcasting started successfully");
    } catch (error) {
      console.error("❌ Error starting broadcast:", error);
      set({ room: null, isBrowserLive: false });
      throw error;
    }
  },

  stop: async () => {
    const room = get().room;
    if (room) {
      await room.disconnect();
      console.log("Broadcasting stopped");
    }
    set({ room: null, isBrowserLive: false });
  },

  toggleMic: async () => {
    const p = get().room?.localParticipant;
    if (!p) return;
    
    const newState = !p.isMicrophoneEnabled;
    await p.setMicrophoneEnabled(newState);
    console.log("Microphone:", newState ? "enabled" : "disabled");
  },

  toggleScreenShare: async () => {
    const p = get().room?.localParticipant;
    if (!p) return;

    try {
      const currentState = p.isScreenShareEnabled;
      
      if (currentState) {
        await p.setScreenShareEnabled(false);
        console.log("Screen sharing stopped");
      } else {
        await p.setScreenShareEnabled(true, { audio: true });
        console.log("Screen sharing started");
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  },
}));