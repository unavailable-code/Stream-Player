import { isFollowing } from "@/lib/follow-service";
import getUserByUsername from "@/lib/user-service";
import { notFound } from "next/navigation";
import Actions from "./_components/actions";
import { isBlockedByUser } from "@/lib/block-service";
import { StreamPlayer } from "@/components/stream-player";

interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user || !user.stream) {
    notFound();
  }
  const isFollowed = await isFollowing(user.id);
  const isBlocked = await isBlockedByUser(user.id);
  if (isBlocked) {
    notFound();
  }
  return (
    <StreamPlayer user={user} isFollowing={isFollowed} stream={user.stream} />
  );
};

export default UserPage;
