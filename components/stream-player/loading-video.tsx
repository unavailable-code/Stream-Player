import { Loader } from "lucide-react";

interface LoadingVideoProps {
  label: string;
}

export const LoadingVideo = ({ label }: LoadingVideoProps) => {
  return (
    <div className="flex flex-col h-full space-y-4 justify-center items-center">
      <Loader className="h-20 w-20 text-muted-foreground animate-spin capitalize" />
      <p className="text-muted-foreground"> {label} </p>
    </div>
  );
};
