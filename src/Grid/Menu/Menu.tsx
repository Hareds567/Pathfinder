import React, { FC } from "react";
//Components
//Classes
import Node from "../Algo/Node";
import { ROWS, COLS } from "../Content";
//CSS
import "./Menu.css";
interface props {
  grid: Node[][];
  set_grid: React.Dispatch<React.SetStateAction<Node[][]>>;
  start: number[];
  end: number[];
  activeBtn: number;
  set_activeBtn: React.Dispatch<React.SetStateAction<number>>;
  checkActiveBtn: (id: number) => boolean;
}

const Menu: FC<props> = ({
  grid,
  set_grid,
  start,
  end,
  activeBtn,
  checkActiveBtn,
  set_activeBtn,
}) => {
  const activeButton = React.useRef<React.LegacyRef<HTMLButtonElement>>();

  const generateMap = (wall: boolean = true) => {
    cleanGrid(grid);
    let temp = new Array<Node[]>();
    //Create Grid without Neighbors
    for (let row = 0; row < ROWS; row++) {
      let currentRow = new Array<Node>();
      for (let column = 0; column < COLS; column++) {
        let tempNode = new Node(row, column, start, end, wall);
        if (tempNode.x === start[0] && tempNode.y === start[1]) {
          console.log("a");
          tempNode.isStart = true;
        }
        if (tempNode.x === end[0] && tempNode.y === end[1]) {
          console.log("b");
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
          if (grid[row][col].isStart || grid[row][col].isEnd) continue;
          if (temp) temp.className = "node";
        }
      }
    }
  };

  React.useEffect(() => {
    set_activeBtn(1);
  }, []);

  return (
    <div className="main-menu-container">
      <div className="active-buttons">
        <button
          className={`menuBtn ${checkActiveBtn(1) ? "button-active" : ""}`}
          onClick={() => set_activeBtn(1)}
        >
          Pointer
        </button>
        <button
          className={`menuBtn ${checkActiveBtn(2) ? "button-active" : ""}`}
          onClick={() => set_activeBtn(2)}
        >
          Select Start
        </button>
        <button
          className={`menuBtn ${checkActiveBtn(3) ? "button-active" : ""}`}
          onClick={() => set_activeBtn(3)}
        >
          Select End
        </button>
        <button
          className={`menuBtn ${checkActiveBtn(4) ? "button-active" : ""}`}
          onClick={() => set_activeBtn(4)}
        >
          Draw Wall
        </button>
        <button
          className={`menuBtn ${checkActiveBtn(5) ? "button-active" : ""}`}
          onClick={() => set_activeBtn(5)}
        >
          Add Stop
        </button>
      </div>
      <div className="grid-actions">
        <button
          onClick={() => {
            generateMap();
          }}
        >
          Generate Random Map
        </button>
        <button
          onClick={() => {
            generateMap(false);
          }}
        >
          Empty Grid
        </button>
        <button onClick={() => cleanGrid(grid)}>Clean Grid</button>
      </div>
    </div>
  );
};

export default Menu;
