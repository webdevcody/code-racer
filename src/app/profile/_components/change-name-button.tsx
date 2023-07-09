"use client";
import { Button } from "@/components/ui/button";

export default function ChangeNameButton({
  setWillEdit
}: {
  setWillEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) {

  return (
    <Button
      type="button"
      title="Edit username"
      variant={"outline"}
      onClick={() => setWillEdit(true)}
    >
      Edit username
    </Button>
  );
};