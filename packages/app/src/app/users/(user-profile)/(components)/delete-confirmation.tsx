"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { AlertTriangle } from "lucide-react";
import { catchError } from "@/lib/utils";
import { deleteUserAction } from "./actions";

export default function DeleteConfirmation({
  setWillDelete,
  displayName,
}: {
  setWillDelete: React.Dispatch<React.SetStateAction<boolean>>;
  displayName: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = () => setWillDelete(false);
    const el = divRef.current;
    if (!el) return;
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [divRef, setWillDelete]);

  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();
    try {
      await deleteUserAction({});
      await signOut({
        callbackUrl: "/",
      });
    } catch (err) {
      catchError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-10 grid w-full h-full place-items-center bg-monochrome-with-bg-opacity bg-opacity-5">
      <div className="absolute inset-0 w-full h-full -z-10" ref={divRef} />
      <div className="w-[95%] max-w-[22.5rem]">
        <div className="flex items-center justify-end"></div>
        <div className="bg-background  min-h-[12.5rem] mt-2 rounded-lg p-6">
          <span className="flex items-center justify-center gap-2 text-red-500">
            <AlertTriangle className="stroke-red-500" />
            DELETE ACCOUNT
            <AlertTriangle className="stroke-red-500" />
          </span>

          <form
            className="flex flex-col gap-2 mt-4 select-none"
            onSubmit={handleDelete}
          >
            <p>Please type &quot;{displayName}&quot; to confirm:</p>
            <Input
              type="text"
              name="name"
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your username to confirm"
              value={inputValue}
              required
            />
            <Button
              variant={"destructive"}
              className="mt-2"
              tabIndex={inputValue === displayName ? 0 : -1}
              title="Delete your account"
              disabled={
                (inputValue === displayName ? undefined : true) || isLoading
              }
            >
              {isLoading ? "DELETING..." : "CONFIRM"}
            </Button>
            <Button
              className="text-accent"
              onClick={() => setWillDelete(false)}
            >
              CANCEL
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
