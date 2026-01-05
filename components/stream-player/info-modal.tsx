"use client";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState, useTransition, useRef, ElementRef } from "react";
import { updateStream } from "@/Actions/stream";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { Hint } from "../hint";
import { Trash } from "lucide-react";
import Image from "next/image";

interface InfoModalProps {
  initialName: string;
  initialThumbnail: string | null;
}

export const InfoModal = ({
  initialName,
  initialThumbnail,
}: InfoModalProps) => {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnail);
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<ElementRef<"button">>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      updateStream({ name: name })
        .then(() => {
          toast.success("Stream updated");
          closeRef?.current?.click();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onRemove = () => {
    startTransition(() => {
      updateStream({ thumbnailUrl: null })
        .then(() => {
          toast.success("Thumbnail removed");
          setThumbnailUrl(null);
          closeRef?.current?.click();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="ml-auto text-white">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-0">
        <DialogHeader>
          <DialogTitle>Edit stream info</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-14">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              className="bg-gray-900 border-white/10"
              placeholder="Stream name"
              onChange={onChange}
              value={name}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            {thumbnailUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <div className="absolute top-2 right-2 z-[10]">
                  <Hint label="Remove thumbnail" side="left">
                    <Button
                      type="button"
                      disabled={isPending}
                      onClick={onRemove}
                      className="h-auto w-auto p-1.5 "
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                  </Hint>
                </div>
                <Image
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="rounded-xl border outline-dashed outline-muted">
                <UploadDropzone
                  endpoint="thumbnailUploader"
                  appearance={{
                    label: {
                      color: "#FFFFFF",
                    },
                    allowedContent: {
                      color: `#FFFFFF`,
                    },
                  }}
                  onClientUploadComplete={(res) => {
                    setThumbnailUrl(res?.[0]?.ufsUrl);
                    router.refresh();
                    closeRef?.current?.click();
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <DialogClose asChild ref={closeRef}>
              <Button type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="primary" disabled={isPending}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
