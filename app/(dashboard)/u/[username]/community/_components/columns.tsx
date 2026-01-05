"use client";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { UnblockUser } from "./unblock-button";

export type BlockedUsers = {
  id: string;
  userId: string;
  imageUrl: string;
  username: string;
  createdAt: string;
};

export const columns: ColumnDef<BlockedUsers>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Username
        <ArrowUpDown className="ml-2 h- w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4 ">
        <UserAvatar
          username={row.original.username}
          imageUrl={row.original.imageUrl}
          size="default"
        />
        <span>{row.original.username}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Blocked
        <ArrowUpDown className="ml-2 h- w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UnblockUser userId={row.original.userId} />,
  },
];
