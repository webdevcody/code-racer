"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { catchError } from "@/lib/utils";
import { deleteUserResults } from "./actions";
import { useRouter } from "next/navigation";

type ResetConfirmationProps = {
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
  displayName: string;
};

export default function ResetConfirmation({
  setReset,
  displayName,
}: ResetConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const divRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onClick = () => setReset(false);
    const el = divRef.current;
    if (!el) return;
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [divRef, setReset]);

  async function resetResults(e: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();
    try {
      await deleteUserResults({});
    } catch (err) {
      catchError(err);
    } finally {
      setIsLoading(false);
      setReset(false);
      router.refresh();
    }
  }

  return (
    <div className="fixed inset-0 z-10 grid w-full h-full place-items-center bg-monochrome-with-bg-opacity bg-opacity-5">
      <div className="absolute inset-0 w-full h-full -z-10" ref={divRef} />
      <div className="w-[95%] max-w-[22.5rem]">
        <div className="flex items-center justify-end"></div>
        <div className="bg-background  min-h-[12.5rem] mt-2 rounded-lg p-6">
          <span className="flex items-center justify-center gap-2 text-yellow-500">
            <AlertTriangle className="stroke-yellow-500" />
            Reset Results
            <AlertTriangle className="stroke-yellow-500" />
          </span>

          <form
            className="flex flex-col gap-2 mt-4 select-none"
            onSubmit={resetResults}
          >
            <p>
              Please type &quot;
              <span className="break-all">{displayName}</span>
              &quot; to confirm:
            </p>
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
              title="Reset your race results"
              disabled={
                (inputValue === displayName ? undefined : true) || isLoading
              }
            >
              {isLoading ? "Reseting Results..." : "CONFIRM"}
            </Button>
            <Button className="text-accent" onClick={() => setReset(false)}>
              CANCEL
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
