"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";

const DeleteConfirmation = dynamic(() => import("./confirmation"));

export default function ProfileNav({ displayName }: { displayName: string }) {
  const [willDelete, setWillDelete] = useState(false);

  return (
    <>
      <div className="flex justify-end w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 px-0">
              <Icons.settings />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              title="Delete Account"
              className="cursor-pointer"
              onClick={() => setWillDelete(true)}
            >
              <Trash className="w-4 h-4 mr-2 stroke-red-500" />
              <span className="text-red-500">Delete Account</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {willDelete ? (
        <Suspense>
          <DeleteConfirmation
            setWillDelete={setWillDelete}
            displayName={displayName}
          />
        </Suspense>
      ) : null}
    </>
  );
}
