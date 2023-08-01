import React from "react";
import * as Progress from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof Progress.Indicator> {
  className?: string;
  children?: React.ReactNode;
  progress: number;
}

const ProgressBar = React.forwardRef<
  React.ElementRef<typeof Progress.Root>,
  React.ComponentPropsWithoutRef<typeof Progress.Root>
>(({ className, children, ...props }, ref) => {
  return (
    <Progress.Root
      ref={ref}
      className={cn(
        "overflow-hidden border border-border rounded-full w-[100%] h-[15px]",
        className,
      )}
      {...props}
    >
      {children}
    </Progress.Root>
  );
});

ProgressBar.displayName = Progress.Root.displayName;

const ProgressIndicator = React.forwardRef<
  React.ElementRef<typeof Progress.Indicator>,
  ProgressIndicatorProps
>(({ className, children, progress, ...props }, ref) => {
  return (
    <Progress.Indicator
      ref={ref}
      className={cn(
        "bg-primary w-[0%] h-full transition-all duration-100",
        className,
      )}
      {...props}
      style={{ width: `${progress}%` }}
    >
      {children}
    </Progress.Indicator>
  );
});

ProgressIndicator.displayName = Progress.Indicator.displayName;

export { ProgressBar, ProgressIndicator };
