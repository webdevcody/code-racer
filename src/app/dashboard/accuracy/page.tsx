import Shell from "@/components/shell";
import AccuracyChart from "../components/accuracyChart";
import { getRecentGames } from "../loaders";
import { Heading } from "@/components/ui/heading";

export default async function CpmPage() {
  const recentGames = await getRecentGames();
  return (
    <Shell layout="dashboard">
      <Heading title="Accuracy" description="Checkout your accuracy chart" />
      <AccuracyChart recentGames={recentGames} />
    </Shell>
  );
}
