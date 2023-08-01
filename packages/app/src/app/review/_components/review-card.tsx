/* eslint-disable */
"use client";

import ReviewButtons from "./review-buttons";
import { snippetLanguages } from "@/config/languages";
import { type Snippet } from "@/lib/prisma";
import { useEffect, useRef, useState } from "react";

interface ReviewCardProps {
  snippet: Snippet;
}

export default function ReviewCard({ snippet }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentCode, setCurrentCode] = useState<string>(snippet.code);
  const textarea = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (textarea.current) {
      textarea.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      className="flex flex-col justify-between gap-4 p-6 border rounded overflow-hidden min-h-[100px] w-full"
      key={snippet.id}
    >
      <p className="font-special text-center font-bold text-3xl text-primary">
        {snippetLanguages.find((l) => l.value === snippet.language)?.label ??
          snippet.language}
      </p>
      {!isEditing && (
        <span onClick={() => setIsEditing(true)}>
          <pre className="text-sm md:text-base whitespace-pre-wrap text-muted-foreground bg-muted w-full h-full p-4 rounded-md">
            {currentCode}
          </pre>
        </span>
      )}
      {isEditing && (
        <textarea
          ref={textarea}
          className="w-full h-48 p-4 text-sm md:text-base whitespace-pre-wrap text-muted-foreground bg-muted rounded-md"
          defaultValue={currentCode}
          onBlur={() => {
            setIsEditing(false);
          }}
          onChange={() => {
            setCurrentCode(textarea?.current?.value ?? snippet.code);
          }}
        ></textarea>
      )}
      <div className="flex flex-col gap-1 mt-2">
        <span className="text-sm mt-auto font-semibold text-muted-foreground">
          Total characters: {currentCode.length}
        </span>
        <span className="text-sm mt-auto font-semibold text-muted-foreground">
          Rating: {snippet.rating}
        </span>
      </div>
      <ReviewButtons
        snippetId={snippet.id}
        edited={currentCode !== snippet.code}
        code={currentCode}
      />
    </div>
  );
}
