import { useEffect, useRef, useState } from "react";

const DEFAULT_UPDATE_INTERVAL_MS = 100;

export default function RaceTimer({
  stopTimer = false,
}: {
  stopTimer?: boolean;
}) {
  const [elapsedTime, setElapsedTime] = useState("0");
  const interval = useRef<NodeJS.Timer>();

  useEffect(() => {
    function updateElapsedTime() {
      setElapsedTime((previousTime) =>
        (+previousTime + DEFAULT_UPDATE_INTERVAL_MS / 1000).toFixed(1),
      );
    }

    interval.current = setInterval(() => {
      updateElapsedTime();
    }, DEFAULT_UPDATE_INTERVAL_MS);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    if (stopTimer) clearInterval(interval.current);
  }, [stopTimer]);

  return <p>Elapsed Time: {`${elapsedTime}s`}</p>;
}
