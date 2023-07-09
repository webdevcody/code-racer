import React from "react";

export interface TimeProps extends React.TimeHTMLAttributes<HTMLTimeElement> {
  date: Date;
};

const Time = React.forwardRef<HTMLTimeElement, TimeProps>(
  ({ date, children, ...props }, ref) => {

    return (
      <time dateTime={date.toISOString()} ref={ref} {...props}>
        {
          date.toLocaleDateString("en-us", {
            dateStyle: "medium"
          })
        }
      </time>
    );
  }
);

export default Time;