"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

// see https://github.com/vercel/next.js/discussions/50284

const ModalCatchAllFix = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (!(pathname.includes("/create") || pathname.includes("/join"))) {
    return null;
  }

  return <>{children}</>;
};

export default ModalCatchAllFix;
