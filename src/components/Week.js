import React from "react";
import Day from "./Day";

export default function Week({ week }) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {week.map((day, idx) => (
        <Day day={day} key={idx} />
      ))}
    </div>
  );
}
