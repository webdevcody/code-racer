"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { achievements } from "@/config/achievements";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { addSnippetAction, addSnippetForReviewAction } from "./actions";
import LanguageDropDown from "./language-dropdown";
import { catchError } from "@/lib/utils";
import { unlockAchievement } from "@/components/achievement";

const formDataSchema = z.object({
  codeLanguage: z
    .string({
      required_error: "Please select a language",
    })
    .nonempty(),
  codeSnippet: z
    .string({
      required_error: "Please enter a code snippet",
    })
    .min(30, "Code snippet must be at least 30 characters long"),
});

type FormData = z.infer<typeof formDataSchema>;

export default function AddSnippetForm({ lang }: { lang: string }) {
  const { toast, dismiss } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    mode: "onSubmit",
    defaultValues: {
      codeLanguage: lang,
      codeSnippet: "",
    },
  });

  async function onSubmitForReview(data: FormData) {
    try {
      await addSnippetForReviewAction({
        language: data.codeLanguage,
        code: data.codeSnippet,
      });

      toast({
        title: "Success!",
        description: "Snippet submitted for review",
        duration: 5000,
      });
    } catch (err) {
      catchError(err);
    }
  }

  async function onSubmit(data: FormData) {
    try {
      const responseData = await addSnippetAction({
        language: data.codeLanguage,
        code: data.codeSnippet,
      });

      if (responseData?.failure) {
        const failureToast = toast({
          title: "Error!",
          description: `${
            responseData?.failure.reason ?? "Something went wrong!"
          }`,
          duration: 5000,
          style: {
            background: "hsl(var(--destructive))",
          },
          action: (
            <Button
              className="py-7"
              variant="secondary"
              onClick={() => {
                dismiss(failureToast.id);
                onSubmitForReview(data);
              }}
            >
              Submit for Review
            </Button>
          ),
        });
        return;
      }

      if (
        responseData?.message === "snippet-created-and-achievement-unlocked"
      ) {
        const firstSnippetAchievement = achievements.find(
          (achievement) => achievement.type === "FIRST_SNIPPET",
        );
        if (firstSnippetAchievement)
          unlockAchievement({
            name: firstSnippetAchievement.name,
            description:
              "Thank you! Your first snippet is successfully uploaded!",
            image: firstSnippetAchievement.image,
          });
      }

      toast({
        title: "Success!",
        description: "Snippet added successfully",
        duration: 5000,
        variant: "middle",
        action: (
          <Link href="/race" className={buttonVariants({ variant: "outline" })}>
            Click to Race
          </Link>
        ),
      });

      form.reset();
    } catch (err) {
      catchError(err);
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3 mt-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="codeLanguage"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Language</FormLabel>
              <FormControl>
                <LanguageDropDown
                  codeLanguage={field.value}
                  setCodeLanguage={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="codeSnippet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code Snippet</FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
                  className="w-full p-2 border"
                  placeholder="Type your custom code here... Minimum 30 characters required."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-fit text-accent" type="submit">
          Upload
        </Button>
      </form>
    </Form>
  );
}
