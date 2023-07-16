"use client"

import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function ProgressBar({ title, size = 60, value = 50, totalValue = 100 }: { title: string; size?: number, value?: number; totalValue?: number }) {
    const [hoverText, setHoverText] = useState(title);

    const progress = value / totalValue;
    const angle = (progress * 360);
    const fractionText = `${value} / ${totalValue}`;

    const backgroundColor = "hsl(var(--accent))";
    const progressColor = "hsl(var(--warning-dark))";
    const progressColorUnfilled = "hsl(var(--warning-light))";

    function ProgressCircle() {
        return (
            <div
                style={{
                    background: `
                    radial-gradient(${backgroundColor} 55%, transparent 56%),
                    conic-gradient(${progressColor} 0deg ${angle}deg, ${progressColorUnfilled} ${angle}deg 360deg),
                    ${backgroundColor}`,
                    borderRadius: "50%",
                    width: `${size}px`,
                    height: `${size}px`,
                }}
                onMouseEnter={() => setHoverText(fractionText)}
                onMouseLeave={() => setHoverText(title)}
            >
                <div className="flex w-full h-full text-sm justify-center items-center text-center p-0">
                    {hoverText}
                </div>
            </div>
        )
    }

    return (
        <Card className="bg-transparent shadow-xl border-none">
            <ProgressCircle />
        </Card>
    )
}
