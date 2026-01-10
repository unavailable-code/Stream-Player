"use client";
import { useState, useTransition, useRef, ElementRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Hint } from "../hint";
import { Textarea } from "../ui/textarea";
import { updateUser } from "@/Actions/user";
import { toast } from "sonner";
interface BioModalProps {
  initialValue: string | null;
}
export const BioModal = ({ initialValue }: BioModalProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [value, setValue] = useState(initialValue || "");
  const [isPending, startTransition] = useTransition();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    startTransition(() => {
      updateUser({ bio: value })
        .then(() => {
          toast.success("User bio updated");
          closeRef?.current?.click();
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
    e.preventDefault();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="ml-auto text-theme">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-theme text-theme border-0">
        <DialogHeader>
          <DialogTitle>Edit bio</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Textarea
            placeholder="Edit your bio"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            disabled={isPending}
            className="resize-none bg-theme text-theme  border-theme/10"
          />
          <div className="flex justify-between">
            <DialogClose ref={closeRef}>Cancel</DialogClose>
            <Button variant="primary" type="submit" disabled={isPending}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
