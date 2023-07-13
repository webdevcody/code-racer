import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NoSnippetProps {
  message: string;
}

export default function NoSnippet({ message }: NoSnippetProps) {
  return (
    <div className="flex flex-col gap-7 justify-start items-center">
      <p className="text-primary text-xl">{message}</p>
      <Link href={"/add-snippet"}>
        <Button>Create New Snippet</Button>
      </Link>
    </div>
  );
}
