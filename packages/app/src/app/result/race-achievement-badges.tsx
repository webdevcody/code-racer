import { AchievementBadge } from "@/components/achievement";
import { getFifthRaceBadge, getFirstRaceBadge } from "./loaders";

export async function RaceAchievementBadges() {
  const [firstRaceBadge, fifthRaceBadge] = await Promise.all([
    getFirstRaceBadge(),
    getFifthRaceBadge(),
  ]);

  return (
    <>
      {firstRaceBadge && (
        <AchievementBadge
          name="First Race"
          description="Congrats on completing your first race!"
          image={firstRaceBadge.image}
        />
      )}
      {fifthRaceBadge && (
        <AchievementBadge
          name="Fifth Race"
          title="You are in the Club"
          description="Congrats on completing your fifth race! You will now show up in the leaderboards."
          image={fifthRaceBadge.image}
        />
      )}
    </>
  );
}
