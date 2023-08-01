export const snippetLanguages = [
  { label: "C++", value: "c++" },
  { label: "C#", value: "c#" },
  { label: "Go", value: "go" },
  { label: "HTML", value: "html" },
  { label: "Java", value: "java" },
  { label: "Javascript", value: "javascript" },
  { label: "PHP", value: "php" },
  { label: "Python", value: "python" },
  { label: "Ruby", value: "ruby" },
  { label: "Swift", value: "swift" },
  { label: "Typescript", value: "typescript" },
] as const;

export type Language = (typeof snippetLanguages)[number]["value"];

export function isValidLanguage(lang: string): boolean {
  return snippetLanguages.some((l) => l.value === lang);
}
