import React from "react";
import "./snowfall.css";

const Snowfall = () => {
  return (
    <div className="snowfall-container">
      {Array.from({ length: 100 }).map((_, i) => (
        <span key={i} className="snowflake" />
      ))}
    </div>
  );
};

export default Snowfall;
