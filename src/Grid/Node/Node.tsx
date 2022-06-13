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
  end: number[];
  set_end: React.Dispatch<React.SetStateAction<number[]>>;
  grid: Node[][];
  set_grid: React.Dispatch<React.SetStateAction<Node[][]>>;
  spots: Node[];
  set_spots: React.Dispatch<React.SetStateAction<Node[]>>;
  isDraggable: number;
  set_isDraggable: React.Dispatch<React.SetStateAction<number>>;
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
  end,
  set_end,
  spots,
  set_spots,
  isDraggable,
  set_isDraggable,
}) => {
  const className = isEnd
    ? "node-end"
    : isStart
    ? "node-start"
    : isWall
    ? "node-wall"
    : "";

  const updateNode = (id: number) => {
    const current = id === 2 ? start : end;
    //Update GUI of previous start
    let temp = document.getElementById(`node-${current[0]}-${current[1]}`);
    if (temp) temp.className = "node";
    //Update GUI of current start
    const currentNode = [node.x, node.y];
    let temp2 = document.getElementById(`node-${node.x}-${node.y}`);
    if (temp2)
      id === 2
        ? (temp2.className = "node node-start")
        : id === 3
        ? (temp2.className = "node node-end")
        : console.log();
    //Update Grid
    let prevNode = grid[current[0]][current[1]];
    id === 2 ? (prevNode.isStart = false) : (prevNode.isEnd = false);
    let currentGridNode = grid[node.x][node.y];
    id === 2
      ? (currentGridNode.isStart = true)
      : (currentGridNode.isEnd = true);
    let tempGrid = grid;
    tempGrid[current[0]][current[1]] = prevNode;
    tempGrid[node.x][node.y] = currentGridNode;
    set_grid([...tempGrid]);
    id === 2 ? set_start(currentNode) : set_end(currentNode);
  };

  const onClick = () => {
    if (activeBtn === 1) {
    }
    //Select new Start
    if (activeBtn === 2) {
      cleanGrid(grid);
      updateNode(activeBtn);
    }
    //Select new End
    if (activeBtn === 3) {
      cleanGrid(grid);
      updateNode(activeBtn);
    }
    if (activeBtn === 4) {
    }
    //Draw Spot
    if (activeBtn === 5) {
      if (spots.length > 2) {
        console.log("You have reached the maximum number of stops");
        return;
      }
      cleanGrid(grid);
      let tempGuiNode = document.getElementById(`node-${node.x}-${node.y}`);
      if (tempGuiNode) tempGuiNode.className = "node node-spot";
      let tempNode = node;
      tempNode.isSpot = true;
      let tempGrid = grid;
      let tempSpots = [...spots, tempNode];
      tempGrid[node.x][node.y] = tempNode;
      set_grid([...tempGrid]);
      set_spots(tempSpots);
    }
  };
  //==========================================================
  //Drag and hold events
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    // console.log(node.isStart);
    console.log(node.x, node.y);
    if (node.isStart || node.isEnd) {
      let currentNode = document.getElementById(`node-${node.x}-${node.y}`);
      let currentNodeObj = node;
      let tempGrid = grid;
      currentNodeObj.isStart ? set_isDraggable(1) : set_isDraggable(2);
      currentNodeObj.isStart
        ? (currentNodeObj.isStart = false)
        : (currentNodeObj.isEnd = false);
      tempGrid[currentNodeObj.x][currentNodeObj.y] = currentNodeObj;
      currentNode?.classList.add("node-drag");
      set_grid([...tempGrid]);
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (isDraggable != 0) {
      let currentNode = document.getElementById(`node-${node.x}-${node.y}`);
      let currentNodeObj = node;
      let tempGrid = grid;
      isDraggable === 1
        ? (currentNodeObj.isStart = true)
        : (currentNodeObj.isEnd = true);
      tempGrid[currentNodeObj.x][currentNodeObj.y] = currentNodeObj;
      currentNode?.classList.remove("node-drag");
      set_grid([...tempGrid]);
      isDraggable === 1
        ? set_start([node.x, node.y])
        : set_end([node.x, node.y]);
      set_isDraggable(0);
    }
  };
  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (isDraggable != 0 && !node.isWall) {
      let currentNode = document.getElementById(`node-${node.x}-${node.y}`);
      currentNode?.classList.add("node-drag");
      isDraggable === 1
        ? currentNode?.classList.add("node-start")
        : currentNode?.classList.add("node-end");
    }
  };
  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (isDraggable != 0 && !node.isWall) {
      let currentNode = document.getElementById(`node-${node.x}-${node.y}`);
      currentNode?.classList.remove("node-drag");
      isDraggable === 1
        ? currentNode?.classList.remove("node-start")
        : currentNode?.classList.remove("node-end");
    }
  };

  //===================================================
  const cleanGrid = (grid: Node[][]) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (!grid[row][col].isWall) {
          let temp = document.getElementById(`node-${row}-${col}`);
          if (
            grid[row][col].isStart ||
            grid[row][col].isEnd ||
            grid[row][col].isSpot
          )
            continue;
          if (temp) temp.className = "node";
        }
      }
    }
  };
  return (
    <div
      className={`node ${className}`}
      id={`node-${row}-${col}`}
      onClick={() => onClick()}
      onMouseDown={(e) => onMouseDown(e)}
      onMouseUp={(e) => onMouseUp(e)}
      onMouseEnter={(e) => onMouseEnter(e)}
      onMouseLeave={(e) => onMouseLeave(e)}
    ></div>
  );
};

export default NodeComponent;
