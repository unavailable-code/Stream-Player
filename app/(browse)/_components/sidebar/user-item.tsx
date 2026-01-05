"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/store/use-sidebar";
import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { LiveBadge } from "@/components/live-badge";
interface UserItemProps {
  username: string;
  imageUrl: string;
  isLive: boolean;
  showBadge: boolean;
}
export const UserItem = ({ username, imageUrl, isLive }: UserItemProps) => {
  const pathname = usePathname();
  const { collapsed } = useSidebar((state) => state);
  const href = `/${username}`;
  const isActive = pathname === href;
  return (
    <Button
      asChild
      className={cn(
        "w-full h-12 z-0 bg-transparent",
        collapsed ? "justify-center" : "justify-start",
        isActive && "bg-black"
      )}
    >
      <Link href={href}>
        <div
          className={cn(
            "flex items-center w-full gap-x-4",
            collapsed && "justify-center"
          )}
        >
          <UserAvatar
            imageUrl={imageUrl}
            username={username}
            isLive={isLive}
            showBadge={false}
          />
          {!collapsed && (
            <div>
              <p className="truncate">{username}</p>
            </div>
          )}
          {!collapsed && isLive && <LiveBadge className="ml-auto" />}
        </div>
      </Link>
    </Button>
  );
};

export const UserItemSkeleton = () => {
  return (
    <li className="flex items-center gap-x-4 px-3 py-2 bg-[#2D2E35]">
      <Skeleton className="min-h-[32px] min-w-[32px] rounded-full bg-[#191a1d]" />
      <div className="flex-1">
        <Skeleton className="h-6 " />
      </div>
    </li>
  );
};
