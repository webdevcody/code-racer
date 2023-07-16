import { useState } from "react";
import prettyMilliseconds from "pretty-ms";

interface RaceTimerProps {
    startTime: Date | null;
    isRaceFinished: boolean;
    updateInterval?: number; // in milliseconds
    hidden?: boolean;
}

const DEFAULT_UPDATE_INTERVAL_MS = 100;

export default function RaceTimer({startTime, isRaceFinished, updateInterval = DEFAULT_UPDATE_INTERVAL_MS, hidden = false }: RaceTimerProps) {
    const [elapsedTime, setElapsedTime] = useState<number>(0); // in milliseconds

    function displayElapsedTime(elapsedTime: number) : string{
        return prettyMilliseconds(elapsedTime, {unitCount: 2});
    }

    function updateElapsedTime() {
        if(!startTime) {
            return;
        }
        const newElapsedTime = Date.now() - startTime.getTime();
        setElapsedTime(newElapsedTime);

    }

    if (startTime && !isRaceFinished) {
        setTimeout(() => updateElapsedTime(), updateInterval);
    }

    return (
        <>
            {
                !hidden &&
                <p>{startTime ? displayElapsedTime(elapsedTime) : "0s"}</p>
            }
        </>

    )
}