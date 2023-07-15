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
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";

export function AddBio() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Your Bio</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Bio</DialogTitle>
          <DialogDescription>
            Tell us something about you. Only share information you are
            comfortable with. This will be public information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="bio" className="text-left">
            Biography
          </Label>
          <Textarea placeholder="Add your bio" id="bio" />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
