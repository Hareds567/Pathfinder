import React, { FC } from "react";

import Node from "../../Algo/Node";
import { recursiveDivision as main } from "../../Algo/RecursiveDivision/RecursiveDivision";

import { ChevronDown } from "react-feather";
import { ROWS, COLS } from "../..//Content";

import "./MazeMenu.css";

interface props {
  grid: Node[][];
  set_grid: React.Dispatch<React.SetStateAction<Node[][]>>;
  start: number[];
  end: number[];
  isActiveDropdown: (id: number) => boolean;
  set_activeDropdown: React.Dispatch<React.SetStateAction<number>>;
}

const MazeMenu: FC<props> = ({
  grid,
  start,
  end,
  set_grid,
  isActiveDropdown,
  set_activeDropdown,
}) => {
  //===============================================================
  //Dropdown Methods
  const dropDown_onClick = (id: number) => {
    if (isActiveDropdown(id)) {
      set_activeDropdown(0);
      return;
    }
    set_activeDropdown(id);
  };

  const dropDown_onBlur = () => {
    set_activeDropdown(0);
  };

  //===============================================================
  //Map Generation Methods
  const generateMap = (wall: boolean = true) => {
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
      set_activeDropdown(0);
    }
    //Add Neighbors
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        temp[i][j].add_neighbor(temp);
      }
    }
    if (wall) set_activeDropdown(0);
  };

  const recursiveDivision = () => {
    const start = [grid[1][0].x, grid[1][0].y];
    const end = [grid[grid.length - 2][0].x, grid[grid.length - 2][0].y];
    const width = grid.length;
    const height = grid[0].length;
    main(start, end, width, height, grid, true);
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
    // console.log(path);
    // path?.forEach((node) => {
    //   let temp = document.getElementById(`node-${node.x}-${node.y}`);
    //   if (temp) temp.className = "node node-wall";
    // });
  };

  //===============================================================
  //Reset Grid
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
    set_activeDropdown(0);
  };

  return (
    <div className="grid-actions">
      <div
        className={`dropdown ${isActiveDropdown(1) ? "active-dropdown" : ""}`}
        onBlur={() => {
          dropDown_onBlur();
        }}
        data-dropdown
      >
        <button
          data-dropdown-button
          className={`menuBtn dropdown-header`}
          onClick={() => {
            dropDown_onClick(1);
          }}
        >
          Maze Generation <ChevronDown size={"15px"} />
        </button>

        <div className="dropdown-menu">
          <button
            className={"dropdown-menu-link"}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              generateMap();
            }}
          >
            <span>Random</span>
          </button>
          <button
            className={"dropdown-menu-link"}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              recursiveDivision();
            }}
          >
            <span>Recursive Division</span>
          </button>
        </div>
      </div>
      {/* //===================================== */}
      <div
        className={`dropdown ${isActiveDropdown(2) ? "active-dropdown" : ""}`}
        onBlur={() => {
          dropDown_onBlur();
        }}
        data-dropdown
      >
        <button
          data-dropdown-button
          className={`menuBtn dropdown-header`}
          onClick={() => {
            dropDown_onClick(2);
          }}
        >
          Clear <ChevronDown size={"15px"} />
        </button>
        <div className="dropdown-menu">
          <button
            className="dropdown-menu-link"
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              generateMap(false);
            }}
          >
            Clear Walls
          </button>
          <button
            className="dropdown-menu-link"
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => cleanGrid(grid)}
          >
            Clear Path
          </button>
        </div>
      </div>
    </div>
  );
};

export default MazeMenu;
