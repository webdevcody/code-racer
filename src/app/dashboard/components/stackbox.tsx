import { Card } from "@/components/ui/card";
import ProgressBar from "./progressBar";
import { ReactNode } from "react";

export interface StackProps {
    title: string;
    subtitle: string;
    size?: number;
    icon?: ReactNode;
    value?: number;
    totalValue?: number;
}

export default function StackCard({ title, icon, subtitle, size, value, totalValue }: StackProps) {
    return (
        <Card className="flex p-5 justify-center rounded-xl border-primary">
            <div className="flex flex-col sm:flex-row w-full justify-between">
                <div className="flex flex-col justify-start">
                    <div className="flex gap-2">
                        <>{icon}</>
                        <h4 className="font-bold">{title}</h4>
                    </div>
                    <div className="flex flex-col justify-between">
                        <p className="text-sm">{subtitle}</p>
                    </div>
                </div>
                <div className="flex p-3 text-center justify-center items-center rounded-full shadow-xl">
                    <ProgressBar size={size} value={value} totalValue={totalValue} />
                </div>
            </div>
        </Card>
    )
}
