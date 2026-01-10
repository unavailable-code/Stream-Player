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
      
      const room = new Room();

      await room.connect(
        process.env.NEXT_PUBLIC_LIVEKIT_WS_URL!,
        token
      );
      try {
        await room.localParticipant.setScreenShareEnabled(true);
      } catch (err) {
        console.error("Failed to enable Screenshare:", err);
      }

      try {
        await room.localParticipant.setMicrophoneEnabled(true);
      } catch (err) {
        console.error("Failed to enable microphone:", err);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));


      set({ room, isBrowserLive: true });
    } catch (error) {
      set({ room: null, isBrowserLive: false });
      throw error;
    }
  },

  stop: async () => {
    const room = get().room;
    if (room) {
      await room.disconnect();
    }
    set({ room: null, isBrowserLive: false });
  },

  toggleMic: async () => {
    const p = get().room?.localParticipant;
    if (!p) return;
    
    const newState = !p.isMicrophoneEnabled;
    await p.setMicrophoneEnabled(newState);;
  },

  toggleScreenShare: async () => {
    const p = get().room?.localParticipant;
    if (!p) return;

    try {
      const currentState = p.isScreenShareEnabled;
      
      if (currentState) {
        await p.setScreenShareEnabled(false);
      } else {
        await p.setScreenShareEnabled(true, { audio: true });
      }
    } catch (error) {
    }
  },
}));