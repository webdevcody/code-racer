import RaceTimer from "./race-timer";
import RestartButton from "./buttons/restart-button";

type Props = {
  code: string;
  input: string;
  startTime: Date | null;
  handleRestart: () => void;
};

export default function Footer({
  code,
  input,
  startTime,
  handleRestart,
}: Props) {
  const isRaceFinished = input === code;

  return (
    <>
      {input !== code.slice(0, input.length) && (
        <span className="text-red-500">
          You must fix all errors before you can finish the race!
        </span>
      )}

      {isRaceFinished && (
        <div className="flex flex-col items-center text-2xl font-bold space-y-8">
          <div className="w-8 h-8 border-4 border-muted-foreground rounded-full border-t-4 border-t-warning animate-spin"></div>
          Loading race results, please wait...
        </div>
      )}

      <div className="flex justify-between items-center">
        {startTime !== null && (
          <>
            <RaceTimer stopTimer={isRaceFinished} />
            <RestartButton handleRestart={handleRestart} />
          </>
        )}
      </div>
    </>
  );
}
