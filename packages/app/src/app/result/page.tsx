import React from "react";

import { Heading } from "@/components/ui/heading";

import MainContent from "./main-content";

export default function ResultPage() {
  return (
    <React.Fragment>
      <header className="pt-12">
        <Heading
          typeOfHeading="h1"
          size="h1"
          title="Your Race Results"
          description="You were amazing! Now, let's see your results below."
        />
      </header>

      <main className="py-12">
        <MainContent />
      </main>
    </React.Fragment>
  );
}
