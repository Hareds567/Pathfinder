import React, { FC } from "react";
import "./Node.css";
//Component
import Node from "../Algo/Node";
interface props {
  node: Node;
  isEnd: boolean;
  isStart: boolean;
  isWall: boolean;
  row: number;
  col: number;
  activeBtn: number;
  start: number[];
  set_start: React.Dispatch<React.SetStateAction<number[]>>;
  grid: Node[][];
  set_grid: React.Dispatch<React.SetStateAction<Node[][]>>;
}

const NodeComponent: FC<props> = ({
  isEnd,
  isStart,
  isWall,
  row,
  col,
  node,
  activeBtn,
  start,
  set_start,
  grid,
  set_grid,
}) => {
  const className = isEnd
    ? "node-end"
    : isStart
    ? "node-start"
    : isWall
    ? "node-wall"
    : "";

  const onClick = () => {
    if (activeBtn === 1) {
    }
    if (activeBtn === 2) {
      //Update GUI of previous start
      let temp = document.getElementById(`node-${start[0]}-${start[1]}`);
      if (temp) temp.className = "node";
      //Update GUI of current start
      const newStart = [node.x, node.y];
      let temp2 = document.getElementById(`node-${node.x}-${node.y}`);
      if (temp2) temp2.className = "node node-start";
      //Update Grid
      let prevStart = grid[start[0]][start[1]];
      prevStart.isStart = false;
      let currentStart = grid[node.x][node.y];
      currentStart.isStart = true;
      let tempGrid = grid;
      tempGrid[start[0]][start[1]] = prevStart;
      tempGrid[node.x][node.y] = currentStart;
      set_grid([...tempGrid]);
      set_start(newStart);
    }
    if (activeBtn === 3) {
    }
    if (activeBtn === 4) {
    }
    if (activeBtn === 5) {
    }
  };
  return (
    <div
      className={`node ${className}`}
      id={`node-${row}-${col}`}
      onClick={() => onClick()}
    ></div>
  );
};

export default NodeComponent;
