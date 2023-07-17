import Shell from "@/components/shell";
import CpmChart from "../components/cpmChart";
import { getRecentGames } from "../loaders";
import { Heading } from "@/components/ui/heading";

export default async function CpmPage() {
  const recentGames = await getRecentGames();
  return (
    <Shell layout="dashboard">
      <Heading title="Characters per minute" description="Checkout your cpm chart" />
      <CpmChart recentGames={recentGames} />
    </Shell>
  );
}
