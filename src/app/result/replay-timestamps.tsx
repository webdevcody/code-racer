import { useState, useEffect } from "react";
import Code from "../race/code";

interface replayTimeStampProps {
    char: string;
    textIndicatorPosition: number | number[];
    currentLineNumber: number;
    currentCharPosition: number;
    errors: number[];
    totalErrors: number;
    time: number;
}

export const ReplayCode = ({ code, replayTimeStamp }: { code?: string, replayTimeStamp?: replayTimeStampProps[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (replayTimeStamp && currentIndex < replayTimeStamp.length) {
            const currentTimestamp = replayTimeStamp[currentIndex];
            const nextTimestampDelay = currentIndex + 1 < replayTimeStamp.length
                ? replayTimeStamp[currentIndex + 1].time - currentTimestamp.time
                : null;

            const timeout = setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
            }, nextTimestampDelay || currentTimestamp.time);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, replayTimeStamp]);

    if (!code || !replayTimeStamp || replayTimeStamp.length === 0) {
        return null;
    }

    const currentTimestamp = replayTimeStamp[currentIndex];
    return (
        <div className="px-2 absolute bg-accent text-primary border-2 border-white">
            <Code
                code={code}
                userInput={currentTimestamp.char}
                textIndicatorPosition={currentTimestamp.textIndicatorPosition}
                currentLineNumber={currentTimestamp.currentLineNumber}
                currentCharPosition={currentTimestamp.currentCharPosition}
                errors={currentTimestamp.errors}
                totalErrors={currentTimestamp.totalErrors}
            />
        </div>
    );
}