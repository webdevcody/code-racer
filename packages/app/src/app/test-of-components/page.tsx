import { redirect } from "next/navigation";
import { TestComponent } from "./test";
import { getRandomSnippet } from "../race/(play)/loaders";

const TestOfComponents = async () => {
  if (process.env.NODE_ENV !== "development") {
    return redirect("/");
  }
  const snippet = await getRandomSnippet({ language: "html" });

  return <TestComponent snippet={snippet} />;
};

export default TestOfComponents;
