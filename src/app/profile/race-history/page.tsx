import Time from "@/components/ui/time";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Race History"
};

async function RaceHistoryCard() {
  const historyMatches = [
    {
      date: "March 20, 2023",
      averageSpeed: 2000,
      versus: "Xx_deadlyMamba_xX",
      status: "lost"
    }, {
      date: "March 21, 2023",
      averageSpeed: 1000,
      versus: "funnyGuy123",
      status: "won"
    }, {
      date: "April 22, 2023",
      averageSpeed: 10000,
      versus: "masterOfAll",
      status: "draw"
    }
  ];
  {/** Dynamic data coming soon... */ }
  const descendingOrder = historyMatches.sort((a, b) => {
    if (new Date(a.date) > new Date(b.date)) {
      return -1;
    }

    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    }

    return 0;
  });

  return (
    <section className="grid grid-cols-[1fr] 2xl:grid-cols-[1fr,1fr] gap-x-8 gap-y-4">
      {
        descendingOrder.map(match => {
          let name = match.versus;
          /** If the name length > 11 chars, then cut it. This is to avoid overflows */
          if (match.versus.length > 11) {
            name = `${match.versus.slice(0, 11)}...`;
          }
          const statusColor = match.status === "won"
            ? "text-green-400"
            : match.status === "lost"
              ? "text-destructive"
              : "text-yellow-400"
          return (
            (
              /** This container can be a button or link which leads
               * to a page that'll give more information about the
               * match.
               */
              <div className="text-center shadow-md shadow-monochrome-low-opacity flex gap-4 md:gap-8 justify-between items-center bg-secondary py-2 px-4 md:py-4 md:px-8 rounded-md">
                <div className="flex-[0.85] text-start">
                  <h2 className="text-base md:text-lg font-medium">Battled vs. {name}</h2>
                  <span className="text-xs md:text-sm">Last: <Time date={new Date(match.date)} /></span>
                </div>
                <span className={`${statusColor} flex-[0.125] font-bold text-sm md:text-lg inline-block`}>{match.status.toUpperCase()}</span>
                {/**Some kind of circle here to indicate how good the speed is */}
                <div className="flex-[0.125]">{match.averageSpeed / 1000}s</div>
              </div>
            )
          )
        })
      }
    </section>
  );
};

export default function RaceHistoryPage() {
  return (
    <article>
      <h1 className="text-3xl md:text-4xl mb-8">Race History</h1>
      <Suspense>
        <RaceHistoryCard />
      </Suspense>
    </article>
  );
};