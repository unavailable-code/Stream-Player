"use client";

import { Button } from "@/components/ui/button";
import { Check, CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  value: string | null;
}
const CopyButton = ({ value }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const onCopy = () => {
    if (!value) return;

    setIsCopied(true);
    navigator.clipboard.writeText(value);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const Icon = isCopied ? CheckCheck : Copy;
  return (
    <Button
      onClick={onCopy}
      disabled={!value || isCopied}
      size="sm"
      className="bg-transparent text-theme"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};
export default CopyButton;
