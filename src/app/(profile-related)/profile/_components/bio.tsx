"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateBio } from "../actions";
import { useState } from "react";

import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { DialogClose } from "@radix-ui/react-dialog";

interface BioProps {
  bio: string | null;
}

export function Bio({ bio }: BioProps) {
  const [optimisticBio, setOptimisticBio] = useState(bio);
  const { pending } = useFormStatus();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={pending} 
          className="h-fit mx-auto text-center font-bold border-2 hover:border-dashed hover:border-primary hover:bg-background"
          variant="outline">
          {optimisticBio && optimisticBio.length ? optimisticBio : "No bio yet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bio</DialogTitle>
          <DialogDescription>
            This is your public display information
          </DialogDescription>
        </DialogHeader>
        <form action={updateBio}>
          <div className="grid gap-4 py-4">
            <Textarea
              name="bio"
              defaultValue={bio ?? ""}
              placeholder="Add your bio"
              id="bio"
              onChange={(e) => {
                setOptimisticBio(e.currentTarget.value);
                console.log(optimisticBio);
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose
              disabled={pending}
              className={buttonVariants()}
              type="submit"
            >
              Save
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
