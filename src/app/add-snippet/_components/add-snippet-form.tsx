"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { addSnippetAction } from "../actions";

export default function AddSnippetForm({}) {
	const [codeSnippet, setCodeSnippet] = useState("");
	const [codeLanguage, setCodeLanguage] = useState("");
	const [canUpload, setCanUpload] = useState(false);

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

	function handleCodeSnippetChange(e: ChangeEvent<HTMLTextAreaElement>){

		setCodeSnippet(e.target.value)
		
		if(codeSnippet.replace(/[\n\t\s]/g, "").length >= 30){
			setCanUpload(true);
		}else
			setCanUpload(false)

	}
	return (
		<form
			onSubmit={handleSubmit}
			action=""
			className="flex flex-col gap-3 mt-5"
		>
			<div>
				<select
					onChange={(e) => setCodeLanguage(e.target.value)}
					className="w-full px-4 py-3"
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
					onChange={(e) => handleCodeSnippetChange(e)}
					name=""
					value={codeSnippet}
					id=""
					rows={8}
					className="w-full p-2 border"
				></textarea>
			</div>
			<Button className={`w-fit`} disabled={!canUpload} >Upload</Button>
		</form>
	);
}
