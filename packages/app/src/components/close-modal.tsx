"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type CloseModalProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const CloseModal: FC<CloseModalProps> = ({ className }) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className={cn("h-6 w-6 rounded-md p-0", className)}
      onClick={() => router.back()}
    >
      <X aria-label="close modal" className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;