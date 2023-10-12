"use client";
import { Heading } from "@/components/ui/heading";
import AddSnippetForm from "./_components/add-snippet-form";
import { z } from "zod";
import { languageTypes } from "@/lib/validations/room";

export default function AddSnippet({
  searchParams,
}: {
  searchParams: {
    lang: z.infer<typeof languageTypes>;
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
