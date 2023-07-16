import { useEffect, useState } from "react";
import prettyMilliseconds from "pretty-ms";

interface RaceTimerProps {
    toggle: boolean;
    updateInterval?: number; // in milliseconds
    hidden?: boolean;
    postToggleBehavior?: PostToggleBehavior
}

type PostToggleBehavior = "RESET" | "SHOW_CURRENT_TIME";

const DEFAULT_UPDATE_INTERVAL_MS = 100;
const DEFAULT_POST_TOGGLE_BEHAVIOR = "RESET";

export default function RaceTimer({ toggle, updateInterval = DEFAULT_UPDATE_INTERVAL_MS, hidden = false, postToggleBehavior = DEFAULT_POST_TOGGLE_BEHAVIOR }: RaceTimerProps) {
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    useEffect(() => {
        if (!toggle) {
            setStartTime(null);
            if (postToggleBehavior === "RESET") {
                console.log("Resetting elapsed time")
                setElapsedTime(0);
            }
        }
    }, [toggle, elapsedTime])

    function displayElapsedTime(elapsedTime: number) : string{
        return prettyMilliseconds(elapsedTime, {unitCount: 2});
    }

    function updateElapsedTime() {
        const currentStartTime = startTime ?? new Date();
        if(!startTime) {
            setStartTime(currentStartTime);
        }

        if(toggle) {
            const newElapsedTime = Date.now() - currentStartTime.getTime();
            setElapsedTime(newElapsedTime);
        }
    }

    if (toggle) {
        setTimeout(() => updateElapsedTime(), updateInterval);
    }

    return (
        <>
            {
                !hidden &&
                <p>{displayElapsedTime(elapsedTime)}</p>
            }
        </>

    )
}