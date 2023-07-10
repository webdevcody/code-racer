"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function SearchParamProfilePicture() {
  const searchParam = useSearchParams();

  if (!searchParam) {
    return (
      <h1 className="text-center">
        Please provide an image link to view it on full screen!
      </h1>
    );
  }
  return (
    <Image
      src={searchParam.get("photoURL") as string}
      alt="Profile Picture"
      width={1044}
      height={861}
      className="w-full h-full object-contain"
      priority
      fetchPriority="high"
      loading="eager"
    />
  );
}
