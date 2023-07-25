"use server";

import { safeAction } from "@/lib/actions";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { getCurrentUser } from "@/lib/session";
import { snippetSchema } from "@/lib/validations/snippet";
import { Configuration, OpenAIApi } from "openai";
import { prisma } from "@/lib/prisma";
import { env } from "@/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const addSnippetAction = safeAction(snippetSchema)(async (input) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  if (env.OPENAI_API_KEY) {
    try {
      const validationResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: `As a GPT system, your singular task is to determine the syntactic validity 
          of code snippets across various programming languages. Your goal is to identify 
          if the provided code follows the correct syntax rules of the specific programming 
          language it is written in. No further explanation or correction is required; your 
          function is simply to confirm or deny the syntactic validity of the code.`,
          },
          {
            role: "user",
            content: `Programming Language: ${input.language} Code Snippet: ${input.code}`,
          },
        ],
        functions: [
          {
            name: "validate_snippet",
            description:
              "Validates a code snippet in a given programming language.",
            parameters: {
              type: "object",
              properties: {
                valid: {
                  type: "boolean",
                  description: "Whether the code snippet is valid or not.",
                },
              },
              required: ["valid"],
            },
          },
        ],
        function_call: { name: "validate_snippet" },
      });

      const validationArguments =
        validationResponse.data.choices[0].message?.function_call?.arguments;

      if (!validationArguments) {
        return {
          failure: {
            reason: "Unable to validate snippet.",
          },
        };
      }

      const { valid } = JSON.parse(validationArguments);

      if (!valid) {
        return {
          failure: {
            reason: `The snippet is not valid ${input.language}`,
          },
        };
      }
    } catch (error) {
      return {
        failure: {
          reason: "Unable to validate snippet.",
        },
      };
    }
  }

  await prisma.snippet.create({
    data: {
      userId: user?.id,
      ...input,
    },
  });

  const firstSnippetAchievement = await prisma.achievement.findFirst({
    where: {
      achievementType: "FIRST_SNIPPET",
      userId: user.id,
    },
  });

  if (!firstSnippetAchievement) {
    await prisma.achievement.create({
      data: {
        userId: user.id,
        achievementType: "FIRST_SNIPPET",
      },
    });
    return {
      message: "snippet-created-and-achievement-unlocked",
      status: 200,
    };
  }
  return { message: "snippet-created", status: 200 };
});

export const addSnippetForReviewAction = safeAction(snippetSchema)(async (
  input,
) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  await prisma.snippet.create({
    data: {
      userId: user?.id,
      ...input,
      onReview: true,
    },
  });

  return { message: "snippet-created-for-review", status: 200 };
});
