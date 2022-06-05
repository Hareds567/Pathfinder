import React, { FC } from "react";

import Node from "../../Algo/Node";
import {
  division,
  chooseOrientation,
  division2,
} from "../../Algo/RecursiveDivision/RecursiveDivision";

import { ChevronDown } from "react-feather";
import { ROWS, COLS } from "../..//Content";

import "./MazeMenu.css";

interface props {
  grid: Node[][];
  set_grid: React.Dispatch<React.SetStateAction<Node[][]>>;
  start: number[];
  end: number[];
  set_spots: React.Dispatch<React.SetStateAction<Node[]>>;
}

const MazeMenu: FC<props> = ({ set_spots, grid, start, end, set_grid }) => {
  const [isActive, set_isActive] = React.useState(false);

  const dropDown = () => {
    set_isActive(true);
  };

  const generateMap = (wall: boolean = true) => {
    if (!wall) {
      let a = new Array<Node>();
      set_spots([...a]);
    }
    cleanGrid(grid);
    let temp = new Array<Node[]>();
    //Create Grid without Neighbors
    for (let row = 0; row < ROWS; row++) {
      let currentRow = new Array<Node>();
      for (let column = 0; column < COLS; column++) {
        let tempNode = new Node(row, column, start, end, wall);
        if (tempNode.x === start[0] && tempNode.y === start[1]) {
          tempNode.isStart = true;
        }
        if (tempNode.x === end[0] && tempNode.y === end[1]) {
          tempNode.isEnd = true;
        }
        currentRow.push(tempNode);
      }
      temp.push(currentRow);
      set_grid([...temp]);
    }
    //Add Neighbors
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        temp[i][j].add_neighbor(temp);
      }
    }
  };

  // Remove Any Path Already drawn on the Grid
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

  const recursiveDivision = () => {
    // const width = grid.length - 1;
    // const height = grid[0].length - 1;
    // let path = division2(
    //   grid,
    //   width,
    //   height,
    //   chooseOrientation(width, height),
    //   0,
    //   0
    // );
    // // console.log("From Menu");
    // // console.log(path);
    // path?.forEach((node) => {
    //   let temp = document.getElementById(`node-${node.x}-${node.y}`);
    //   if (temp) temp.className = "node node-wall";
    // });
  };

  return (
    <div className="grid-actions">
      <div className="dropdown">
        <button
          data-dropdown
          className={`menuBtn dropdown-header`}
          onClick={() => {
            dropDown();
          }}
        >
          Maze Generation <ChevronDown size={"15px"} />
        </button>
        <div className="dropdown-menu">
          <div
            className={"dropdown-menu-link"}
            onClick={() => {
              generateMap();
            }}
          >
            <span>Random</span>
          </div>
          <div
            className={"dropdown-menu-link"}
            onClick={() => {
              recursiveDivision();
            }}
          >
            <span>Recursive Division</span>
          </div>
        </div>
      </div>
      <button className="menuBtn" onClick={() => cleanGrid(grid)}>
        Clean Path
      </button>
      <button
        className="menuBtn"
        onClick={() => {
          generateMap(false);
        }}
      >
        Reset
      </button>
    </div>
  );
};

export default MazeMenu;
