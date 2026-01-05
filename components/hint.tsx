import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export const Hint = ({ label, children, side, align }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="text-black bg-white"
          side={side}
          align={align}
        >
          <p>{label} </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
