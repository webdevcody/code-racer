import React from "react";

export interface TimeProps extends React.TimeHTMLAttributes<HTMLTimeElement> {
  date: Date;
}

const Time = React.forwardRef<HTMLTimeElement, TimeProps>(
  ({ date, ...props }, ref) => {
    return (
      <time dateTime={date.toISOString()} ref={ref} {...props}>
        {date.toLocaleDateString("en-us", {
          dateStyle: "medium",
        })}
      </time>
    );
  },
);

Time.displayName = "Time";

export default Time;
