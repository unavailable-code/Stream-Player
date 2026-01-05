import { cn } from "@/lib/utils";

interface LiveBadgeProps{
    className?: string
}
export const LiveBadge=({
    className,
}:LiveBadgeProps)=>{
    return(
        <div className={cn(
            "z-50 bg-rose-500 text-center p-0.5  px-1.5 rounded-md uppercase text-[10]px border-2 font-semibold tracking-wide shadow-lg border-white", className
        )}>
            Live
        </div>  
    )
}