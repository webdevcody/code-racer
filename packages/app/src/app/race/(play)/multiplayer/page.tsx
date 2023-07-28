import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import RaceMultiplayer from "../../_components/race/race-multiplayer";
import { Language, isValidLanguage } from "@/config/languages";

export default async function MultiplayerRacePage({
  searchParams,
}: {
  searchParams: {
    lang: string;
  };
}) {
  if (!searchParams.lang) {
    redirect("/race");
  }
  const isValidLang = isValidLanguage(searchParams.lang);

  if (!isValidLang) {
    redirect("/race");
  }

  const user = await getCurrentUser();

  return (
    <main className="flex flex-col items-center justify-between py-10 lg:p-24">
      <RaceMultiplayer user={user} language={searchParams.lang as Language} />
    </main>
  );
}
