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

const DeleteConfirmation = dynamic(() => import("./delete-confirmation"));
const ResetConfirmation = dynamic(() => import("./reset-confirmation"));

export default function ProfileNav({ displayName }: { displayName: string }) {
  const [willDelete, setWillDelete] = useState(false);
  const [reset, setReset] = useState(false);

  return (
    <>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Icons.settings size={18} />
              Settings
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
            <DropdownMenuItem
              title="Reset Results"
              className="cursor-pointer"
              onClick={() => setReset(true)}
            >
              <Trash className="w-4 h-4 mr-2 stroke-yellow-500" />
              <span className="text-yellow-500">Reset Results</span>
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
      {reset ? (
        <Suspense>
          <ResetConfirmation setReset={setReset} displayName={displayName} />
        </Suspense>
      ) : null}
    </>
  );
}
