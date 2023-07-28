import { useEffect, useState } from "react";

const DEFAULT_UPDATE_INTERVAL_MS = 100;

export default function RaceTimer() {
  const [elapsedTime, setElapsedTime] = useState("0");

  useEffect(() => {
    function updateElapsedTime() {
      setElapsedTime((previousTime) =>
        (+previousTime + DEFAULT_UPDATE_INTERVAL_MS / 1000).toFixed(1),
      );
    }

    const interval = setInterval(() => {
      updateElapsedTime();
    }, DEFAULT_UPDATE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <p>Elapsed Time: {`${elapsedTime}s`}</p>;
}
