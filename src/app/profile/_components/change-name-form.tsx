"use client";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { updateUserAction } from "../actions";

async function handleSubmit({ typedName }: { typedName: string }) {
  const session = await getSession();
  const displayName = session?.user.name;

  if (displayName === typedName) {
    console.error("The current username and the new one is still the same!");
    throw new Error("The current username and the new one is still the same!");
  }

  await updateUserAction({
    newName: typedName,
  });
}

export default function ChangeNameForm() {
  const [typedName, setTypedName] = useState("");
  const router = useRouter();
  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSubmit({ typedName });
          router.refresh();
        }}
        className="z-10 w-[90%] p-6 h-48 max-w-[30rem] rounded-md shadow-monochrome shadow-lg bg-secondary flex flex-col justify-center gap-4"
      >
        <div title="Type in new username">
          <label htmlFor="username-input" className="text-lg lg:text-xl">
            Type in your new username
          </label>
          <div className="block cursor-text rounded-sm relative w-full h-12 p-3 mt-2 border-[1px] border-solid border-primary">
            <input
              type="text"
              name="username-input"
              placeholder={"your new username"}
              id="username-input"
              onChange={(e) => setTypedName(e.target.value)}
              className="outline-none bg-transparent h-full w-full z-10 relative"
              required
              value={typedName}
              minLength={3}
            />
          </div>
        </div>
        <div>
          <Button
            type="submit"
            variant={"destructive"}
            className="py-6 w-full text-lg"
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
