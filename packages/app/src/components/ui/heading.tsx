import { bruno_ace_sc } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import React from "react";

type HeadingTags = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps =
  | {
    title: string;
    description: string | undefined;
    centered?: boolean;
    fontFamily?: "bruno_ace_sc";
    typeOfHeading?: HeadingTags;
  }

const getHeadingComponent = (typeOfHeading: HeadingTags, className: string, children: React.ReactNode) => {
  switch (typeOfHeading) {
    case "h1":
      return <h1 className={className}>{children}</h1>;
    case "h2":
      return <h2 className={className}>{children}</h2>;
    case "h3":
      return <h3 className={className}>{children}</h3>;
    case "h4":
      return <h4 className={className}>{children}</h4>;
    case "h5":
      return <h5 className={className}>{children}</h5>;
    case "h6":
      return <h6 className={className}>{children}</h6>;
  }
};

export const Heading: React.FC<HeadingProps> = React.memo(({
  title,
  centered,
  description,
  fontFamily = "bruno_ace_sc",
  typeOfHeading = "h2"
}) => {
  let font: string | undefined;
  if (fontFamily === "bruno_ace_sc") {
    font = bruno_ace_sc.className;
  }
  const className = cn(font, "text-2xl md:text-4xl font-special font-bold tracking-tight text-primary");

  return (
    <div className={cn({ "text-center": centered })}>
      {getHeadingComponent(typeOfHeading, className, title)}
      {description && (
        <p className="text-sm md:text-base mt-1 text-muted-foreground font-light">
          {description}
        </p>
      )}
    </div>
  );
});

Heading.displayName = "Heading";