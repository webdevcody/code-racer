import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icons } from "./icons";

export function Footer() {
  return (
    <footer className="border-t-2 border-primary">
      <div className="container flex flex-col items-center justify-center gap-4 py-5 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2 md:px-0">
          <Link href="/">
            <Icons.logo width={36} height={36} />
          </Link>
          <p className="text-sm leading-loose text-center md:text-left">
            Built by{" "}
            <Link
              href={siteConfig.links.codyTwitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Cody
            </Link>{" "}
            & his community. The source code is available on{" "}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
