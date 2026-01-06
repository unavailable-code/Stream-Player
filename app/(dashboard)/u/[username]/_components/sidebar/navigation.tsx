"use client";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Fullscreen, Users, MessageSquare, KeyRound } from "lucide-react";
import { NavItem, NavItemSkeleton } from "./navitem";
import { Button } from "@/components/ui/button";
import { useBroadcaster } from "@/store/use-broadcatser";
import { BrowserStream } from "./start-stream";

export const Navigation = () => {
  const pathname = usePathname();
  const { user } = useUser();

  const routes = [
    { label: "Stream", href: `/u/${user?.username}`, icon: Fullscreen },
    { label: "Keys", href: `/u/${user?.username}/keys`, icon: KeyRound },
    { label: "Chat", href: `/u/${user?.username}/chat`, icon: MessageSquare },
    { label: "Community", href: `/u/${user?.username}/community`, icon: Users },
  ];


  return (
    <ul className="space-y-2 px-2 pt-4 lg:pt-0  text-theme">
      {routes.map((route) => (
        <NavItem
          key={route.href}
          label={route.label}
          icon={route.icon}
          href={route.href}
          isActive={pathname === route.href}
        />
      ))}
      <BrowserStream />
    </ul>
  );
};
