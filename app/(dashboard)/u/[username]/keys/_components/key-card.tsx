"use client";

import { Input } from "@/components/ui/input";
import CopyButton from "./copy-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface KeyCardProps {
  value: string | null;
}

const KeyCard = ({ value }: KeyCardProps) => {
  const [show, setShow] = useState(false);
  return (
    <div className="rounded-xl bg-gray-800 p-6 text-white">
      <div className="flex items-start gap-x-10">
        <p className="font-semibold shrink-0">StreamKey</p>
        <div className="space-y-2 w-full">
          <div className="w-full flex items-center gap-x-2">
            <Input
              value={value || ""}
              type={show ? "text" : "password"}
              disabled
              placeholder="Stream Key"
              className="bg-black border-0"
            />
            <CopyButton value={value || ""} />
          </div>
          <Button
            size="sm"
            variant="link"
            className="text-white"
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeyCard;
