import { Button } from "@/components/ui/button";
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
import { PendingButton } from "./pending-button";
import { updateBio } from "../actions";

interface BioProps {
  bio: string | null;
}

export function Bio({ bio }: BioProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-fit mx-4" variant="outline">
          {bio && bio.length ? bio : "No bio yet"}
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
            />
          </div>
          <DialogFooter>
            <PendingButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
