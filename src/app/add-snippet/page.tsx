"use client";
import { Heading } from "@/components/ui/heading";
import AddSnippetForm from "./_components/add-snippet-form";

export default function AddSnippet() {
  return (
    <div className="py-16">
      <section className="max-w-xl mx-auto">
        {/* <h2 className="text-4xl font-bold">Add Your Snippet</h2> */}
        <Heading
          title="Add Your Snippet"
          description="Add Your Snippet to get started"
        />
        <AddSnippetForm />
      </section>
    </div>
  );
}
