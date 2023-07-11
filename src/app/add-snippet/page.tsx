"use client";
import AddSnippetForm from "./_components/add-snippet-form";

export default function AddSnippet() {
	return (
		<div className="min-h-screen py-24 ">
			<section className="max-w-xl mx-auto ">
				<h2 className="text-4xl font-bold">Add Your Snippet</h2>
				<AddSnippetForm />
			</section>
		</div>
	);
}
