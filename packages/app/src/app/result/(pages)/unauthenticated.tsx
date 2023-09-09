
import Link from "next/link";

import { getSnippetById } from "../../race/(play)/loaders";

import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ReplayCode } from "../_components/replay-timestamps";
import { ResultChart } from "../_components/result-chart";
import { TopTable } from "../_components/topten";

type UnauthenticatedPageProps = {
  snippetId: string;
};

const UnauthenticatedPage: React.FC<UnauthenticatedPageProps> = async ({
  snippetId
}) => {
  const currentSnippet = await getSnippetById(snippetId);

  return (
    <main className="w-auto mb-32 lg:mb-40">
      <div className="flex flex-col justify-center gap-4 mt-5">
        <Heading
          centered
          title="Your Race Results"
          description="You did great! View your race results below"
        />
      </div>

      <div className="flex flex-col px-8 rounded-xl">
        <Tabs defaultValue="Results" className="w-full m-5">
          <TabsList className="m-5">
            <TabsTrigger value="Results">Results</TabsTrigger>
            <TabsTrigger value="Replay">Replay</TabsTrigger>
            <TabsTrigger value="TopTen">Top 10</TabsTrigger>
          </TabsList>
          <TabsContent value="Results">
            <span className="text-2xl mx-auto text-primary flex-wrap sm:hidden">
              View in Larger Screen to Unlock Exciting Features!
            </span>
            <ResultChart code={currentSnippet?.code} />
          </TabsContent>
          <TabsContent value="Replay">
            <ReplayCode code={currentSnippet?.code} />
          </TabsContent>
          <TabsContent value="TopTen">
            <TopTable snippetId={currentSnippet?.id} />
            <h1 className="text-lg mx-auto text-muted-foreground">
              Login to be able to get to the top 10!
            </h1>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 p-2">
        <Link
          title="Retry"
          className={cn(buttonVariants(), "gap-2 text-accent")}
          href={`/race/practice?snippetId=${snippetId}`}
        >
          <Icons.refresh className="w-5 h-5" aria-hidden="true" /> Retry
        </Link>
        <Link
          title="New Race"
          className={cn(buttonVariants(), "text-accent")}
          href="/race"
        >
          <Icons.chevronRight className="w-5 h-5" aria-hidden="true" /> New Race
        </Link>
      </div>

      <div className="flex items-center justify-center m-2">
        <Badge
          variant="outline"
          className="flex items-center justify-center text-base border-2"
        >
          <Badge variant="secondary" className="text-warning">
            Tab
          </Badge>
          <span className="m-1">+</span>
          <Badge variant="secondary" className="text-warning">
            Enter
          </Badge>
          <span className="m-1">Restart Game</span>
        </Badge>
      </div>
    </main>
  );
}

export default UnauthenticatedPage;