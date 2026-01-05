import { WifiOff } from "lucide-react";

interface offlineVideoProps {
  username: string;
}

export const OfflineVideo = ({ username }: offlineVideoProps) => {
  return (
    <div className="flex flex-col h-full space-y-4 justify-center items-center">
      <WifiOff className="h-20 w-20 text-muted-foreground " />
      <p className="text-muted-foreground"> {username} is offline </p>
    </div>
  );
};
