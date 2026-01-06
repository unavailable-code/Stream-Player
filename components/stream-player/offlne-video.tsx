import { WifiOff } from "lucide-react";

interface offlineVideoProps {
  username: string;
}

export const OfflineVideo = ({ username }: offlineVideoProps) => {
  return (
    <div className="flex flex-col h-full space-y-4 justify-center items-center">
      <WifiOff className="h-20 w-20 text-muted" />
      <p className="text-muted"> {username} is offline </p>
    </div>
  );
};
