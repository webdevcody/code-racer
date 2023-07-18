import * as React from "react";

import { cn } from "@/lib/utils";

interface ShellProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children: React.ReactNode;
  layout?: "default" | "dashboard" | "auth";
}

export default function Shell({
  children,
  className,
  layout = "default",
  ...props
}: ShellProps) {
  return (
    <section
      className={cn(
        "grid items-center md:gap-8 pb-8 pt-6 md:py-8",
        layout === "default" && "container",
        layout === "auth" && "container max-w-lg",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
