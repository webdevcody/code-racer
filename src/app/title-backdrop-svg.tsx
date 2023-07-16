"use client";
import { useEffect, useState } from "react";

export type configType = {
  count: number;
  line1: string;
  line2: string;
  dashLengthInit: number;
  strokeWidth: number;
  speed: number;
  width: number;
  height: number;
};

type lineObject = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
  animationDelay: string;
  animationDuration: string;
};

const useWindowWide = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setWidth]);

  return width;
};

const config = {
  count: 100,
  line1: "#009090",
  line2: "#884242",
  dashLengthInit: 0.6,
  strokeWidth: 1,
  speed: 0.5,
  width: 500,
  height: 400,
};

export default function TitleBackdropSvg() {
  const [lines, setLines] = useState<lineObject[]>([]);
  const windowWidth = useWindowWide();
  const width = Math.min(windowWidth, config.width);

  useEffect(() => {
    const lineArray = [];
    const w = width;
    const lineLength = w * config.dashLengthInit;

    for (let i = 0; i < config.count; ++i) {
      const yStartCoordinate = 0;
      const yEndCoordinate = -(
        Math.random() * lineLength * 0.5 +
        lineLength * 0.2
      );
      const xCoordinate = Math.random() * w;
      const strokeWidth = Math.random() * 5 * config.strokeWidth;
      const stroke =
        Math.ceil(Math.random() * 2) === 2 ? config.line2 : config.line1;
      const delay = Math.random() / config.speed;
      const dur = (Math.ceil(Math.random() * 5) * 0.5) / config.speed;

      lineArray.push({
        x1: xCoordinate,
        x2: xCoordinate,
        y1: yStartCoordinate,
        y2: yEndCoordinate,
        stroke: stroke,
        strokeWidth: strokeWidth,
        animationDelay: `-${delay}s`,
        animationDuration: `${dur}s`,
      });
    }
    setLines(lineArray);
  }, [width]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // width={width}
      // height={config.height}
      // viewBox={`0 0 ${width} ${config.height}`}
      className="absolute h-full w-full left-0 top-0 z-[-1]"
      fill="none"
    >
      <g id="dashContainer" className="[&>*]:animate-dash md:translate-y-[15%]">
        {lines.map((item, index) => (
          <line
            key={index}
            x1={item.y1}
            x2={item.y2}
            y1={item.x1}
            y2={item.x2}
            stroke={item.stroke}
            strokeWidth={item.strokeWidth}
            strokeLinecap="round"
            className="origin-[50%_50%]"
            style={{
              animationDelay: item.animationDelay,
              animationDuration: item.animationDuration,
            }}
          ></line>
        ))}
      </g>
    </svg>
  );
}
