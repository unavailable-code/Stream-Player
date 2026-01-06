"use client";

import { Pencil } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { InfoModal } from "./info-modal";

interface InfoCardProps {
  name: string;
  hostIdentity: string;
  isHost: boolean;
  viewerIdentity: string;
  thumbnailUrl: string | null;
}
export const InfoCard = ({
  name,
  hostIdentity,
  viewerIdentity,
  isHost,
  thumbnailUrl,
}: InfoCardProps) => {
  const hostAsViewer = `host-${hostIdentity}`;
  // const isHost = viewerIdentity === hostAsViewer;

  if (!isHost) return null;
  return (
<div className="px-4">
  <div className="rounded-2xl bg-card border border-white/10 shadow-sm">
    {/* HEADER */}
    <div className="flex items-start justify-between p-4 lg:p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-600/20 p-2 text-blue-400">
          <Pencil className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-theme lg:text-lg font-semibold">
            Edit your stream info
          </h2>
          <p className="text-xs lg:text-sm text-muted-foreground">
            Maximize your visibility
          </p>
        </div>
      </div>

      {/* ACTION */}
      <InfoModal
        initialName={name}
        initialThumbnail={thumbnailUrl}
      />
    </div>

    <Separator className="bg-white" />

    {/* CONTENT */}
    <div className="p-4 lg:p-6 space-y-6">
      {/* NAME */}
      <div className="space-y-1">
        <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
          Stream Name
        </h3>
        <p className="text-sm lg:text-base font-medium">
          {name}
        </p>
      </div>

      {/* THUMBNAIL */}
      {thumbnailUrl && (
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
            Thumbnail
          </h3>

          <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-white/10 bg-black">
            <Image
              fill
              src={thumbnailUrl}
              alt={name}
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  </div>
</div>

  );
};
