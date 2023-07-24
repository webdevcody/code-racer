"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ViewPhoto() {
  /** Tried to make the intercepting route method work in this
   * route segment for hours with a separate layout, but it kept sending errors.
   * I'll edit this after I do more studying regarding this. - Ragudos
   */
  const router = useRouter();
  const searchParam = useSearchParams();
  const photoURL = searchParam?.get("photoURL") ?? "";
  return (
    <div className="grid place-items-center h-[clamp(55rem,90dvh,65rem)] bg-monochrome-low-opacity">
      <div className="flex flex-col gap-4 justify-center h-[85%]">
        <Button
          type="button"
          variant={"ghost"}
          className="w-fit"
          title="Close"
          onClick={() => router.back()}
        >
          <ArrowLeft className="stroke-primary" />
        </Button>

        <div className="w-full h-full">
          <div className="w-[90%] h-[90%]">
            <Image
              src={photoURL as string}
              alt="Photo"
              width={500}
              height={500}
              priority
              fetchPriority="high"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
