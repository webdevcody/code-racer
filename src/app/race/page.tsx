import { Heading } from "@/components/ui/heading";
import PracticeRace from "./_components/practice-race";
import MultiplayerRace from "./_components/multiplayer-race";
import FriendsRace from "./_components/friends-race";

export default function RacePage() {
  return (
    <main className="pt-12">
      <Heading
        title="Choose a Race Mode"
        description="Practice your typing skills by yourself, with friends, or with other soy devs online"
        centered
      />
      <div className="grid grid-cols-1 gap-8 my-10 lg:grid-cols-3">
        <PracticeRace /> {/* <MultiplayerRace /> <FriendsRace /> */}
        <MultiplayerRace />
        <FriendsRace />
      </div>
    </main>
  );
}
