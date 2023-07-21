"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * The purpose of this component is to force some pages to ALWAYS be fresh data.  Due to how caching
 * inside of next.js client side routing, sometimes RSC will always load stale data unless the user
 * waits for 30 seconds before navigating to this page.  This is an issue on the Race page because often it will
 * load the exact same snippet every single time as you navigate to and away from the Race page.
 * @returns
 */
export function CacheBuster() {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <></>;
}
