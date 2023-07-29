"use client"

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { VariantProps } from "class-variance-authority";

interface NoHistoryButtonProps extends React.HTMLAttributes<HTMLButtonElement>,
VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  path: string;
}

// prevents from adding URL to a history stack
// useful for modal button as it calls router.back() to close itself

export function NoHistoryButton({
  path,
  children,
  ...props
}: NoHistoryButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.replace(path);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
