"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import ProfileNav from "./profile-nav";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { catchError } from "@/lib/utils";
import { updateUserProfile } from "./actions";

export default function ProfileCard({
  photoURL,
  displayName,
  bio,
  totalPoints,
  followers,
  following,
}: {
  photoURL: string;
  displayName: string;
  bio?: string | null;
  totalPoints: number;
  followers: string[];
  following: string[];
}) {
  const [mode, setMode] = React.useState<"view" | "edit">("view");

  return (
    <section className="w-full md:w-[40%] lg:w-[30%] xl:w-[25%]">
      <div data-name="profile-card">
        <Link
          href={`/users/view-photo?photoURL=${photoURL}`}
          title="View Profile Picture"
          prefetch
          className="inline-block overflow-hidden rounded-full w-32 aspect-square md:w-[90%] mx-auto"
        >
          <Image
            src={photoURL}
            alt="Profile Picture"
            width={200}
            height={200}
            loading="eager"
            fetchPriority="high"
            priority
            className="object-cover w-full h-full"
          />
        </Link>
        {mode === "view" ? (
          <ViewMode
            displayName={displayName}
            bio={bio ?? ""}
            changeMode={() => setMode("edit")}
          />
        ) : (
          <EditMode
            displayName={displayName}
            bio={bio ?? ""}
            changeMode={() => setMode("view")}
          />
        )}
        <section className="flex flex-wrap items-center gap-2 mt-4 text-xs text-monochrome/50">
          <div>Followers: {followers.length}</div>
          <div>Following: {following.length}</div>
        </section>
      </div>
      <hr className="bg-primary py-[0.1rem] rounded-full my-4" />
      <div>Total Points: {totalPoints}</div>
    </section>
  );
}

function EditMode({
  displayName,
  bio,
  changeMode,
}: {
  displayName: string;
  bio?: string | null;
  changeMode: () => void;
}) {
  const [name, setName] = React.useState(displayName);
  const [biography, setBiography] = React.useState(bio);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast, dismiss } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    // if the user clicks save but all information is the same,
    // just return.
    if (name === displayName && bio === biography) {
      changeMode();
      setIsLoading(false);
      return;
    }

    toast(
      {
        title: "Updating Information",
        description: "Your information is being updated..",
        variant: "default",
      },
      "loading-toast",
    );

    try {
      await updateUserProfile({
        displayName: name,
        biography: biography as string,
      });
      dismiss("loading-toast");
      toast(
        {
          title: "Successful update",
          description: "Hooray! Your information has been updated.",
          variant: "middle",
        },
        "",
      );

      changeMode();
      setIsLoading(false);
    } catch (error) {
      catchError(error);
      changeMode();
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="w-full">
        <Label htmlFor="username-input">Name*</Label>
        <Input
          type="text"
          placeholder="Enter your name"
          name="username-input"
          id="username-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
          className="mt-1"
        />
        {!name ? (
          <p className="text-destructive text-sm mt-1">Name cannot be empty.</p>
        ) : null}
      </div>
      <div className="w-full">
        <div className="w-full relative">
          <Label htmlFor="biography-input">Biography*</Label>
          <div className="absolute right-1 top-1 text-sm">
            {biography?.length} / 128
          </div>
        </div>
        <Textarea
          maxLength={128}
          name="bio"
          defaultValue={biography ?? ""}
          placeholder="Tell others who you are..."
          id="biography-input"
          onChange={(e) => setBiography(e.target.value)}
          disabled={isLoading}
          className="mt-1"
        />
      </div>

      <div className="w-full flex items-center justify-start gap-4 mt-2">
        <Button type="submit" className="text-accent" disabled={isLoading}>
          Save
        </Button>
        <Button
          type="button"
          variant={"secondary"}
          onClick={changeMode}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function ViewMode({
  displayName,
  bio,
  changeMode,
}: {
  displayName: string;
  bio?: string | null;
  changeMode: () => void;
}) {
  return (
    <>
      <h2 className="text-monochrome/60 text-2xl mt-2 break-words w-full max-w-sm md:max-w-none">
        {displayName}
      </h2>
      {bio && <p className="md:max-w-xs break-words mt-4">{bio}</p>}
      <div className="flex pt-4 gap-6 justify-start items-center">
        <Button variant={"outline"} onClick={changeMode}>
          Edit Profile
        </Button>
        <ProfileNav displayName={displayName} />
      </div>
    </>
  );
}
