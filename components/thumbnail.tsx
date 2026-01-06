import Image from "next/image";
import { UserAvatar } from "./user-avatar";
import { Skeleton } from "./ui/skeleton";
import { LiveBadge } from "./live-badge";

interface ThumbnailProps {
  src: string | null;
  fallback: string;
  isLive: boolean;
  username: string;
}

export const Thumbnail = ({
  src,
  fallback,
  isLive,
  username,
}: ThumbnailProps) => {
  return (
    <div className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl bg-muted">
      <div className="absolute inset-0 z-1 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100" />

      {!src ? (
        <div className="flex h-full w-full items-center justify-center border border-dashed  border-border bg-muted !rounded-none">
          <UserAvatar
            size="lg"
            showBadge
            username={username}
            imageUrl={fallback}
            isLive={isLive}
          />
        </div>
      ) : (
        <Image
          src={src}
          fill
          alt={`${username}'s stream thumbnail`}
          className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw "
          priority
        />
      )}

      {isLive && src && (
        <div className="absolute left-2 top-2 z-20 transition-transform group-hover:translate-x-1 group-hover:translate-y-1">
          <LiveBadge />
        </div>
      )}
    </div>
  );
};
export const ThumbnailSkeleton = () => {
  return (
    <div className="aspect-video overflow-hidden rounded-xl">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
