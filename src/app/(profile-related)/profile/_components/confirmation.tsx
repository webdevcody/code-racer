"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { deleteUserAction } from "../actions";
import { signOut } from "next-auth/react";
import { CloseButton } from "@/components/ui/buttons";

interface DeleteConfirmationProps {
  setWillDelete: React.Dispatch<React.SetStateAction<boolean>>;
  displayName: string
}

export default function DeleteConfirmation({ setWillDelete, displayName }: DeleteConfirmationProps) {
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
    e.preventDefault();
    await deleteUserAction();
    await signOut({ callbackUrl: `${window.location.origin}` })
  }

  return (
    <div className="fixed inset-0 w-full h-full grid place-items-center bg-monochrome-with-bg-opacity bg-opacity-5 z-10">
      <div className="w-full h-full absolute inset-0 -z-10" ref={divRef} />
      <div className="w-[95%] max-w-[22.5rem]">
        <div className="bg-background  min-h-[12.5rem] mt-2 rounded-lg p-4">
          <div className="flex items-center justify-end">
            <CloseButton
              onClick={() => setWillDelete(false)}
              title="Close"
            />
          </div>
          <div className="p-2">
            <span className="text-red-500 flex gap-2 items-center justify-center">
              <AlertTriangle className="stroke-red-500" />
              DELETE ACCOUNT
              <AlertTriangle className="stroke-red-500" />
            </span>
            <form
              className="mt-4 select-none flex flex-col gap-2"
              onSubmit={handleDelete}
            >
              <p>Please type &quot;{displayName}&quot; to confirm:</p>
              <Input
                type="text"
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your username to confirm"
                value={inputValue}
                required
              />
              <Button
                variant={"destructive"}
                type="submit"
                className="mt-2"
                tabIndex={inputValue === displayName ? 0 : -1}
                title="Delete your account"
                disabled={inputValue === displayName ? undefined : true}
              >
                CONFIRM
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
