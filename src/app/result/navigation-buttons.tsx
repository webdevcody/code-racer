"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as React from "react";

function NavigationButtons({ onReview }: { onReview?: boolean }) {
  const router = useRouter();

  const handlerChangePage = () => {
    router.push("/race");
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 p-2" tabIndex={-1}>
      <Button onClick={handlerChangePage}>
        <Icons.chevronRight className="w-5 h-5" aria-hidden="true" />
      </Button>
      {onReview ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button disabled={onReview}>
                <Icons.refresh className="w-5 h-5" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Snippet is currently on review</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Button onClick={handlerChangePage}>
          <Icons.refresh className="w-5 h-5" aria-hidden="true" />
        </Button>
      )}
      <Button>
        <Icons.picture className="w-5 h-5" aria-hidden="true" />
      </Button>
    </div>
  );
}

export default NavigationButtons;
