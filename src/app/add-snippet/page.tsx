"use client";
import { Heading } from "@/components/ui/heading";
import AddSnippetForm from "./_components/add-snippet-form";

interface AddSnippetPageSearchParams {
  lang: string;
}
export default function AddSnippet({
  searchParams,
}: {
  searchParams: AddSnippetPageSearchParams;
}) {
  const language = searchParams.lang;
  return (
    <div className="py-16">
      <section className="max-w-xl mx-auto">
        {/* <h2 className="text-4xl font-bold">Add Your Snippet</h2> */}
        <Heading
          title="Add Your Snippet"
          description="Add Your Snippet to get started"
        />
        <AddSnippetForm lang={language} />
      </section>
    </div>
  );
}
