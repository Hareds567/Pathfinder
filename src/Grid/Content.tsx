import React from "react";
//Components
import Node from "./Algo/Node";
import NodeComponent from "./Node/Node";
import Menu from "./Menu/Menu";
//classes
import { aStar } from "./Algo/AStar";
//CSS
import "./Content.css";

export const COLS = 25;
export const ROWS = 25;

const Content = () => {
  const [start, set_start] = React.useState([0, 0]);
  const [end, set_end] = React.useState([ROWS - 1, COLS - 1]);
  const [grid, set_grid] = React.useState<Node[][]>([]);

  //test
  const [timeoutsIDs, set_timeoutsIDs] = React.useState<NodeJS.Timeout[]>([]);
  const stopTimeouts = (ids: NodeJS.Timeout[]) => {
    ids.forEach((id) => {
      clearTimeout(id);
    });
  };

  const reset = () => {
    stopTimeouts(timeoutsIDs);
    cleanGrid(grid);
    let reset = getInitialGrid(start);
    set_grid([...reset]);
  };

  //Animate Calculations once the algo is finished
  const animate = () => {
    //Clear any processes currently occurring
    cleanGrid(grid);

    const results = aStar(grid[start[0]][start[1]], grid[end[0]][end[1]]);
    if (results) {
      for (let i = 0; i < results.path.length; i++) {
        //Animate suitable path
        if (i === results.path.length - 1) {
          //================================
          const timeout = setTimeout(() => {
            animatePath(results.result);
          }, 10 * i);
          set_timeoutsIDs([...timeoutsIDs, timeout]);
        }
        //Animate each element that was Reviewed in FIFO order

        const timeout = setTimeout(() => {
          const node = results.path[i];
          if (!node.isStart && !node.isEnd) {
            let temp = document.getElementById(`node-${node.x}-${node.y}`);
            if (temp) {
              temp.className = "node node-visited";
            }
          }
        }, 10 * i);
        set_timeoutsIDs([...timeoutsIDs, timeout]);
      }
    }
  };

  //Animate Shortest Path
  const animatePath = (path: Node[]) => {
    for (let i = 0; i < path.length - 1; i++) {
      const timeout = setTimeout(() => {
        const node = path[i];
        const temp = document.getElementById(`node-${node.x}-${node.y}`);
        if (temp) {
          console.log(node.isWall);
          if (!node.isStart || !node.isEnd) {
            temp.className = "node node-path";
          }
        }
      }, 10 * i);
      set_timeoutsIDs([...timeoutsIDs, timeout]);
    }
  };
  //Clean Grid
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

  //Initialize Grid
  const getInitialGrid = (start: Array<number>) => {
    let temp = new Array<Node[]>();
    //Create Grid without Neighbors
    for (let row = 0; row < ROWS; row++) {
      let currentRow = new Array<Node>();
      for (let column = 0; column < COLS; column++) {
        let tempNode = new Node(row, column, start, end, false);
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
    }
    //Add Neighbors
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        temp[i][j].add_neighbor(temp);
      }
    }
    return temp;
  };

  //UseEffects
  React.useEffect(() => {
    set_grid(getInitialGrid(start));
  }, []);

  React.useEffect(() => {
    console.log(grid);
  }, [grid]);
  return (
    <>
      <Menu grid={grid} set_grid={set_grid} start={start} end={end} />
      <div className="menu-container">
        <button className="button" onClick={() => animate()}>
          Start
        </button>
        {/* <button className="button" onClick={() => reset()}>
          Reset
        </button> */}
      </div>

      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                return (
                  <NodeComponent
                    key={nodeIdx}
                    col={node.y}
                    row={node.x}
                    isWall={node.isWall}
                    isStart={node.isStart}
                    isEnd={node.isEnd}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Content;
