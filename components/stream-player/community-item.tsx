"use client";
import { toast } from "sonner";
import { cn, stringToColor } from "@/lib/utils";
import { onBlock } from "@/Actions/block";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { MinusCircle } from "lucide-react";
import { Hint } from "../hint";

interface CommunityItemProps {
  hostName: string;
  viewerName: string;
  participantName?: string;
  participantIdentity: string;
}

export const CommunityItem = ({
  hostName,
  viewerName,
  participantIdentity,
  participantName,
}: CommunityItemProps) => {
  const [isPending, startTransition] = useTransition();
  const color = stringToColor(participantName || "");
  const isSelf = participantName === viewerName;
  const isHost = viewerName === hostName;

  const handleBlock = () => {
    if (!participantName || isSelf || !isHost) return;
    console.log("Return nhi hua");
    startTransition(() => {
      onBlock(participantIdentity)
        .then(() => toast.success(`Blocked ${participantName}`))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between w-full p-2 rounded-md text-sm hover:bg-white/10",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      <p style={{ color: color }}>{participantName}</p>
      {isHost && !isSelf && (
        <Hint label="Block">
          <Button
            disabled={isPending}
            onClick={handleBlock}
            className="h-auto w-auto p-1 opacity-0 group-hover:opacity-100 transition bg-transparent hover:bg-transparent"
          >
            <MinusCircle className="h-6 w-6 text-muted-foreground" />
          </Button>
        </Hint>
      )}
    </div>
  );
};
