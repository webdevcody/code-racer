import { Loader } from "lucide-react";

export const metadata = {
  title: {
    absolute: "Loading Profile Page",
  },
};

export default function Loading() {
  return (
    <div className="grid h-[70dvh] place-items-center">
      <div className="flex flex-col items-center gap-2">
        <Loader className=" animate-spin" />
        <div>Processing Request...</div>
      </div>
    </div>
  );
}
