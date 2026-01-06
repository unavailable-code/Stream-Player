"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { onFollow, onUnfollow } from "@/Actions/follow";
import { startTransition, useTransition } from "react";
import { onBlock, onUnblock } from "@/Actions/block";

interface ActionsProps {
  isFollowing: boolean;
  userId: string;
}
const Actions = ({ isFollowing, userId }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) =>
          toast.success(`You are now following ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };
  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(userId)
        .then((data) => toast.success(`Unfollowed ${data.following.username}`))
        .catch(() => toast.error("Something went wrong"));
    });
  };
  const onClick = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then((data) => toast.success(`You Blocked ${data.blocked.username}`))
        .catch((data) => toast.error("Something went wrong"));
    });
  };

  const handleUnblock = () => {
    startTransition(() => {
      onUnblock(userId)
        .then((data) => toast.success(`Unblocked ${data.blocked.username}`))
        .catch(() => toast.error("Something went wrong"));
    });
  };
  return (
    <>
      <Button disabled={isPending} className="bg-button text-theme" onClick={onClick}>
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      <Button onClick={handleUnblock} disabled={isPending}>
        Block
      </Button>
    </>
  );
};

export default Actions;
