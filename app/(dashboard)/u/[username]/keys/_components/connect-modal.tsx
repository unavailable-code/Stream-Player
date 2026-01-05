"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { IngressInput } from "livekit-server-sdk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IngressType } from "@/lib/ingress-type";
import { useState, useTransition, useRef, ElementRef } from "react";
import { createIngress } from "@/Actions/ingress";
import { toast } from "sonner";

const RTMP = String(IngressType.RTMP_INPUT);
const WHIP = String(IngressType.WHIP_INPUT);

type IngressType = typeof RTMP | typeof WHIP;

export const ConnectModal = () => {
  const [isPending, startTransition] = useTransition();
  const [ingressType, setIngressType] = useState<IngressType>(RTMP);
  const closeRef = useRef<ElementRef<"button">>(null);

  const onSubmit = () => {
    startTransition(() => {
      createIngress(parseInt(ingressType))
        .then(() => {
          toast.success("Ingress created");
          closeRef?.current?.click();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Generate Connection</Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-0">
        <DialogHeader>
          <DialogTitle>Generate Connection</DialogTitle>
        </DialogHeader>
        <Select
          disabled={isPending}
          value={ingressType}
          onValueChange={(value) => setIngressType(value)}
        >
          <SelectTrigger className="w-full bg-transparent text-white border-[#2a2b31]  focus:ring-0 focus:ring-offset-0 ">
            <SelectValue placeholder="Ingress Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 shadow-3xl border-[#35384b] text-white">
            <SelectItem value={RTMP}>RTMP</SelectItem>
            <SelectItem value={WHIP}>WHIP</SelectItem>
          </SelectContent>
        </Select>
        <Alert className="bg-gray-900 text-white shadow-lg border-1-white border border-[#2a2b31] ">
          <AlertTriangle className="h-4 w-4 " />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            This action will reset all active streams using the current
            connection
          </AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <DialogClose ref={closeRef}>Cancel</DialogClose>

          <Button variant="primary" onClick={onSubmit} disabled={isPending}>
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
