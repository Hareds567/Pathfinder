import React, { FC } from "react";
import "./Node.css";

interface props {
  isEnd: boolean;
  isStart: boolean;
  isWall: boolean;
  row: number;
  col: number;
}

const NodeComponent: FC<props> = ({ isEnd, isStart, isWall, row, col }) => {
  const className = isEnd
    ? "node-end"
    : isStart
    ? "node-start"
    : isWall
    ? "node-wall"
    : "";

  return <div className={`node ${className}`} id={`node-${row}-${col}`}></div>;
};

export default NodeComponent;
