"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { addSnippetAction } from "../actions";

export default function AddSnippetForm({}) {
	const [codeSnippet, setCodeSnippet] = useState("");
	const [codeLanguage, setCodeLanguage] = useState("");

	async function handleSubmit(e: any) {
		e.preventDefault();
		await addSnippetAction({
			language: codeLanguage,
			code: codeSnippet,
		});
		console.log("language: ", codeLanguage);
		console.log("snippet: ", codeSnippet);

		resetFields();
	}
	function resetFields() {
		setCodeSnippet("");
		setCodeLanguage("");
	}
	return (
		<form
			onSubmit={handleSubmit}
			action=""
			className="mt-5 flex flex-col gap-3"
		>
			<div>
				<select
					onChange={(e) => setCodeLanguage(e.target.value)}
					className="py-3 px-4 w-full"
					name=""
					id=""
				>
					<option value="select">Select Snippet Language</option>
					<option value="typescript">Typescript</option>
					<option value="python">Python</option>
					<option value="javascript">Javascript</option>
				</select>
			</div>
			<div>
				<textarea
					onChange={(e) => setCodeSnippet(e.target.value)}
					name=""
					value={codeSnippet}
					id=""
					rows={8}
					className="border p-2 w-full"
				></textarea>
			</div>
			<Button className="w-fit">Upload</Button>
		</form>
	);
}
