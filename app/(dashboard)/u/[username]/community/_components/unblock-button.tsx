"use client";

import { onUnblock } from "@/Actions/block";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

interface UnblockUserProps {
  userId: string;
}

export const UnblockUser = ({ userId }: UnblockUserProps) => {
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(() => {
      onUnblock(userId)
        .then((result) =>
          toast.success(`User ${result.blocked.username} unblocked`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };
  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      size="sm"
      className="text-blue-500 w-full"
    >
      Unblock
    </Button>
  );
};
