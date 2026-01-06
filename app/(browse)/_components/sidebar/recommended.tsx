"use client";
import { useSidebar } from "@/store/use-sidebar";
import type { User } from "@prisma/client";
import { UserItem, UserItemSkeleton } from "./user-item";

interface RecommendedProps {
  data: (User & {
    stream: { isLive: boolean } | null;
  })[];
}
export const Recommended = ({ data }: RecommendedProps) => {
  const { collapsed } = useSidebar((state) => state);
  const showLabel = !collapsed && data.length > 0;
  console.log(data.length);
  return (
    <div>
      {showLabel && (
        <div className="pt-6 mb-4">
          <p className="text-sm text-muted text-center">
            Recommended
          </p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((user) => (
          <UserItem
            key={user.id}
            username={user.username}
            imageUrl={user.imgUrl}
            isLive={user.stream?.isLive ?? false}
            showBadge={true}
          />
        ))}
      </ul>
    </div>
  );
};

export const RecommendedSkeleton = () => {
  return (
    <ul className="">
      {[...Array(3)].map((_, i) => (
        <UserItemSkeleton key={i} />
      ))}
    </ul>
  );
};
