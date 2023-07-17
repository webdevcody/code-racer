"use client";
import { Heading } from "@/components/ui/heading";
import AddSnippetForm from "./_components/add-snippet-form";

export default function AddSnippet({
  searchParams,
}: {
  searchParams: {
    lang: string;
  };
}) {
  const language = searchParams.lang;
  return (
    <div className="py-16">
      <section className="max-w-xl mx-auto">
        <Heading
          title="Add Your Snippet"
          description="Add Your Snippet to get started"
        />
        <AddSnippetForm lang={language} />
      </section>
    </div>
  );
}
