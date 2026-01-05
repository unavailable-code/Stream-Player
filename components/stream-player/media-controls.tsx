"use client";

import { Mic, MicOff, Monitor, MonitorOff } from "lucide-react";
import { Hint } from "../hint";

interface MediaControlsProps {
  micEnabled: boolean;
  screenEnabled: boolean;
  onToggleMic: () => void;
  onToggleScreen: () => void;
}

export const MediaControls = ({
  micEnabled,
  screenEnabled,
  onToggleMic,
  onToggleScreen,
}: MediaControlsProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* 🎤 Mic */}
      <Hint label={micEnabled ? "Mute mic" : "Unmute mic"}>
        <button
          onClick={onToggleMic}
          className="p-1.5 rounded-lg text-white hover:bg-white/10"
        >
          {micEnabled ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5 text-red-500" />
          )}
        </button>
      </Hint>

      {/* 🖥 Screen */}
      <Hint label={screenEnabled ? "Stop sharing" : "Share screen"}>
        <button
          onClick={onToggleScreen}
          className="p-1.5 rounded-lg text-white hover:bg-white/10"
        >
          {screenEnabled ? (
            <Monitor className="h-5 w-5" />
          ) : (
            <MonitorOff className="h-5 w-5 text-red-500" />
          )}
        </button>
      </Hint>
    </div>
  );
};
