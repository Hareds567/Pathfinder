import React from "react";
//Components
import Node from "./Algo/Node";
import NodeComponent from "./Node/Node";
import Menu from "./Menu/Menu";
import SpotMenu from "./SpotsMenu/SpotsMenu";
//classes
import { aStar, Results } from "./Algo/AStar";
//CSS
import "./Content.css";

export const COLS = 30;
export const ROWS = 40;

const Content = () => {
  const [start, set_start] = React.useState([0, 0]);
  const [end, set_end] = React.useState([ROWS - 1, COLS - 1]);
  const [grid, set_grid] = React.useState<Node[][]>([]);

  const [spots, set_spots] = React.useState<Node[]>([]);

  //Animate Calculations once the algo is finished
  const animate = () => {
    //Clear any processes currently occurring
    cleanGrid(grid);
    if (spots.length < 1) {
      const results = aStar(grid[start[0]][start[1]], grid[end[0]][end[1]]);
      if (results) {
        for (let i = 0; i < results.path.length; i++) {
          //Animate suitable path
          if (i === results.path.length - 1) {
            setTimeout(() => {
              animateBestPath(results.result);
            }, 10 * i);
          }
          //Animate each element that was Reviewed in FIFO order
          setTimeout(() => {
            animatePath(results, i);
          }, 10 * i);
        }
      }
    }

    //When Spots
    let results: Results = {
      path: new Array<Node>(),
      result: new Array<Node>(),
    };
    if (spots.length === 1) {
      let tempResults: Results = {
        path: new Array<Node>(),
        result: new Array<Node>(),
      };
      results = aStar(grid[start[0]][start[1]], spots[0]);
      tempResults = aStar(spots[0], grid[end[0]][end[1]]);
      tempResults.path.forEach((node) => {
        if (!results.path.includes(node)) results.path.push(node);
      });
      results.result.forEach((node) => {
        if (!tempResults.result.includes(node)) tempResults.result.push(node);
      });
      results.result = tempResults.result;
    }
    //Animate Rest of Spots
    for (let i = 0; i <= spots.length - 1; i++) {
      if (i === 0) {
        let test1 = aStar(grid[start[0]][start[1]], spots[i]);
        combineResults(results, test1);
      }
      if (i + 1 < spots.length) {
        let test3 = aStar(spots[i], spots[i + 1]);
        combineResults(results, test3);
      }
      if (i === spots.length - 1) {
        let test2 = aStar(spots[i], grid[end[0]][end[1]]);
        combineResults(results, test2);
      }
      //Combine Path
    }

    //Animate
    if (results) {
      for (let i = 0; i < results.path.length; i++) {
        //Animate suitable path
        if (i === results.path.length - 1) {
          setTimeout(() => {
            animateBestPath(results.result);
          }, 10 * i);
        }
        //Animate each element that was Reviewed in FIFO order
        setTimeout(() => {
          animatePath(results, i);
        }, 10 * i);
      }
    }
  };

  const combineResults = (results: Results, newResults: Results) => {
    newResults.path.forEach((node) => {
      /*if (!results.path.includes(node))*/ results.path.push(node);
    });
    results.result.forEach((node) => {
      /*if (!newResults.path.includes(node))*/ newResults.result.push(node);
    });
    results.result = newResults.result;
  };

  //Animate Path
  const animatePath = (results: Results, i: number) => {
    const node = results.path[i];
    if (!node.isStart && !node.isEnd && !node.isSpot) {
      let temp = document.getElementById(`node-${node.x}-${node.y}`);
      if (temp) {
        temp.className = "node node-visited";
      }
    }
  };

  //Animate Suitable Path
  const animateBestPath = (path: Node[]) => {
    for (let i = 0; i < path.length - 1; i++) {
      setTimeout(() => {
        const node = path[i];
        const temp = document.getElementById(`node-${node.x}-${node.y}`);
        if (temp) {
          if (!node.isStart && !node.isEnd && !node.isSpot) {
            temp.className = "node node-path";
          }
        }
      }, 10 * i);
    }
  };

  //Clean Grid
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

  //Initialize Grid
  const getInitialGrid = (start: Array<number>) => {
    let temp = new Array<Node[]>();
    //Create Grid without Neighbors
    for (let row = 0; row < ROWS; row++) {
      let currentRow = new Array<Node>();
      for (let column = 0; column < COLS; column++) {
        let tempNode = new Node(row, column, start, end, false);
        if (tempNode.x === start[0] && tempNode.y === start[1]) {
          tempNode.isStart = true;
        }
        if (tempNode.x === end[0] && tempNode.y === end[1]) {
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

  //Use State
  const [activeBtn, set_activeBtn] = React.useState(1);
  const checkActiveBtn = (id: number) => {
    if (id === activeBtn) {
      return true;
    }
    return false;
  };

  return (
    <div className="content-main-container">
      <Menu
        animate={animate}
        grid={grid}
        set_grid={set_grid}
        start={start}
        end={end}
        activeBtn={activeBtn}
        set_activeBtn={set_activeBtn}
        checkActiveBtn={checkActiveBtn}
      />

      <SpotMenu
        spots={spots}
        set_spots={set_spots}
        grid={grid}
        set_grid={set_grid}
      />
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                return (
                  <NodeComponent
                    spots={spots}
                    set_spots={set_spots}
                    grid={grid}
                    set_grid={set_grid}
                    start={start}
                    set_start={set_start}
                    end={end}
                    set_end={set_end}
                    node={node}
                    key={nodeIdx}
                    col={node.y}
                    row={node.x}
                    isWall={node.isWall}
                    isStart={node.isStart}
                    isEnd={node.isEnd}
                    activeBtn={activeBtn}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Content;
