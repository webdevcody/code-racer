import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { getSnippetsInReview } from "./loaders";
import ReviewCard from "./_components/review-card";
import { type Snippet } from "@/lib/prisma";

export default async function ReviewPage() {
  const user = await getCurrentUser();

  if (user?.role !== "ADMIN") notFound();

  const downvotedSnippets = (await getSnippetsInReview()) as Snippet[];

  return (
    <div className="container flex flex-col items-center p-4 space-y-4">
      <Heading
        centered
        title="Review page"
        description="Review snippets to either approve or remove"
      />
      {downvotedSnippets.length === 0 ? (
        <div>No downvoted snippets to review</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 w-full">
          {downvotedSnippets.map((s, index) => (
            <ReviewCard key={index} snippet={s} />
          ))}
        </div>
      )}
    </div>
  );
}
