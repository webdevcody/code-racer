"use server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export interface Snippet {
	code: string;
	language: string;
}



export async function addSnippetAction({ code, language }: Snippet) {
	const user = await getCurrentUser();

	if (!user) {
		return new Response("user-not-defined", { status: 401 });
	}
	
	if(code.replace(/[\n\t\s]/g, "").length < 30)
		return new Response("minimum number of character is not met", { status: 400 });

	
	// why am i getting errors here with where?
	await prisma.snippet.create({
		data: {
			userId: user?.id,
			code,
			language,
		},
	});
}
