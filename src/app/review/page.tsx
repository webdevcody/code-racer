import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import ReviewButtons from "./review-buttons";
import { Heading } from "@/components/ui/heading";
import { getSnippetsInReview } from "./loaders";

export default async function ReviewPage() {
  const user = await getCurrentUser();

  if (user?.role !== "ADMIN") notFound();

  const downvotedSnippets = await getSnippetsInReview();

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {downvotedSnippets.map((s) => (
            <div
              className="flex flex-col justify-between gap-4 p-8 border rounded overflow-hidden min-h-[100px]"
              key={s.id}
            >
              <pre className="text-sm md:text-base whitespace-pre-wrap text-muted-foreground">
                {s.code}
              </pre>
              <span className="text-sm mt-auto">
                Total characters: {s.code.length}
              </span>
              <ReviewButtons snippetId={s.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
