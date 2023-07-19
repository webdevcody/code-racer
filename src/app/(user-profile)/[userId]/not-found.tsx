"use client";

import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <article className="my-auto flex flex-col gap-8 min-h-[30rem] items-center justify-center py-12 text-center">
        <div>
          <Heading title="Oh no!" />
          <Heading title="This user is nowhere to be seen." />
          <section className="mt-4">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Go back to home
            </Link>
          </section>
        </div>
        <div className="w-[clamp(20rem,calc(1rem+2vw),100rem)]">
          <Image
            src="/images/achievement_page.svg"
            width={400}
            height={400}
            alt="image"
            className="w-full h-full object-contain"
          />
        </div>
      </article>
    </main>
  );
}
