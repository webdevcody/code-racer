import { useEffect, useState } from "react";
import prettyMilliseconds from "pretty-ms";

const DEFAULT_UPDATE_INTERVAL_MS = 100;

export default function RaceTimer() {
  const [startTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    function updateElapsedTime() {
      setElapsedTime(Date.now() - startTime.getTime());
    }

    const interval = setInterval(() => {
      updateElapsedTime();
    }, DEFAULT_UPDATE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  function displayElapsedTime(elapsedTime: number): string {
    return prettyMilliseconds(elapsedTime, { unitCount: 2 });
  }

  return <p>Elapsed Time: {displayElapsedTime(elapsedTime)}</p>;
}
