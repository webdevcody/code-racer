import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NoSnippetProps {
  message: string;
}

export default function NoSnippet({ message }: NoSnippetProps) {
  return (
    <div className="flex flex-col items-center justify-start gap-7">
      <p className="text-xl text-primary">{message}</p>
      <Link href={"/add-snippet"}>
        <Button>Create New Snippet</Button>
      </Link>
    </div>
  );
}
