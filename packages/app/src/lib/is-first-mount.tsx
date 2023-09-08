"use client";

import { useEffect, useState } from "react";

export const useIsFirstMount = () => {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    setMounted(false);
  }, []);

  return mounted;
};
