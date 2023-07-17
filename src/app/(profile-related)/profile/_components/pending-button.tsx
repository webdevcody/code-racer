"use client"

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export function PendingButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit">
      {pending ? (
        <>
          <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
          Saving
        </>
      ) : (
        "Save"
      )}
    </Button>
  );
}
