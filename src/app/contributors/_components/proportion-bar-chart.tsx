import { cn } from "@/lib/utils";

interface ProportionBarChartProps {
  className?: string;
  a: number;
  b: number;
}

const DEFAULT_CLASS_NAME =
  "flex justify-start bg-red-500 rounded-full overflow-clip box-border";

export default function ProportionBarChart({
  a,
  b,
  className,
}: ProportionBarChartProps) {
  return (
    <div className={cn(DEFAULT_CLASS_NAME, "w-72", "h2", className)}>
      <span
        className="h-full bg-green-500 box-border"
        style={{ width: `${(a / (a + Math.abs(b))) * 100}%` }}
      ></span>
    </div>
  );
}
