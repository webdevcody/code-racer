import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/">
            <Image
              unoptimized
              src="/static/logo.png"
              width={36}
              height={36}
              alt="Code Racer Logo"
            />
          </Link>
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href="https://twitter.com/webdevcody"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Cody
            </a>{" "}
            & his community. The source code is available on{" "}
            <a
              href="https://github.com/webdevcody/code-racer"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
