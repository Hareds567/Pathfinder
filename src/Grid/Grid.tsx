import React from "react";
import Node from "./Algo/Node";
//CSS
import "./Grid.css";

const cols = 25;
const rows = 25;

const Grid = () => {
  //Start Node and End Node
  const [start, set_start] = React.useState([0, 0]);
  const [end, set_end] = React.useState([rows - 1, cols - 1]);
  const [path, set_path] = React.useState<Node[]>([]);

  //Generates Grid
  const create_empty_grid = () => {
    let temp = new Array<Node[]>();
    for (let i = 0; i < rows; i++) {
      temp[i] = new Array<Node>();
      for (let j = 0; j < cols; j++) {
        let tempNode = new Node(i, j);
        // if (Math.random() < 0.2) {
        //   tempNode.isWall = true;
        // }
        temp[i][j] = tempNode;
      }
    }
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++) {
        temp[i][j].add_neighbor(temp);
      }
    return temp;
  };
  const [grid, set_grid] = React.useState<Node[][]>(create_empty_grid());

  //Generates Grid's HTML
  const build_grid = () => {
    return grid.map((row) => {
      return row.map((node) => {
        return (
          <div
            key={Math.random() * 1000}
            className={`node ${
              node.x === start[0] && node.y === start[1]
                ? "start"
                : node.x === end[0] && node.y === end[1]
                ? "end"
                : node.previous
                ? "path"
                : path.includes(node)
                ? "path"
                : ""
            }`}
          >
            {/* {`x: ${node.x}, y: ${node.y}`} */}
          </div>
        );
      });
    });
  };

  //Remove element from Array
  const removeFromArray = (arr: Array<any>, node: Node) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === node) {
        arr.splice(i, 1);
      }
    }
  };

  //Heuristic
  const heuristic = (a: Node, b: Node) => {
    var dist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    return dist;
  };

  //Update Path
  const update_path = (node: Node) => {
    set_path((path) => {
      return [...path, node];
    });
    console.log("Updating Path");
  };

  //Update Grid at Node X
  const update_grid = (node: Node) => {
    let temp = grid;
    temp[node.x][node.y] = node;
    set_grid([...temp]);
    console.log("Updating Grid");
  };

  //Start A* algorithm
  const a_start = () => {
    //Add Start Node to the Open Set
    let openSet = new Array<Node>();
    let closedSet = new Array<Node>();
    openSet.push(grid[start[0]][start[1]]);

    //Find the Node with the lowest F value in the Open Set
    let lowerFIndex = 0;
    while (openSet.length > 0) {
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowerFIndex].f) {
          lowerFIndex = i;
        }
        if (openSet[i].f === openSet[lowerFIndex].f) {
          if (openSet[i].g > openSet[lowerFIndex].g) {
            lowerFIndex = i;
          }
        }
      }

      //Set the current Node to the one with the lowest F
      let current = openSet[lowerFIndex];

      //End when current is the last node
      if (current === grid[end[0]][end[1]]) {
        console.log("Success");
        return;
      }

      //Update content of the Open Set and the Closed Set
      removeFromArray(openSet, current);
      closedSet.push(current);

      //For each neighbor of current compare GScore
      current.neighbors.forEach((neighbor) => {
        let tentative_gScore = current.g + heuristic(current, current);
        // console.log("=== \nTentative Score: " + tentative_gScore);
        // console.log("Neighbor G Score: " + neighbor.g);
        if (tentative_gScore <= neighbor.g) {
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
          neighbor.g = tentative_gScore;
          neighbor.h = heuristic(neighbor, grid[end[0]][end[1]]);
          neighbor.f = neighbor.g + neighbor.h;
        }
      });
      update_path(current);
    }
  };

  const reset = () => {
    let temp = create_empty_grid();
    set_grid([...temp]);
  };

  // React.useEffect(() => {
  //   console.log("Grid Updated");
  // }, [grid]);
  // React.useEffect(() => {
  //   console.log("Path Updated");
  // }, [path]);

  return (
    <>
      <div className="menu-container">
        <button
          className="button begin"
          onClick={() => {
            a_start();
          }}
        >
          Start
        </button>
        <button
          className="button reset"
          onClick={() => {
            reset();
          }}
        >
          Reset
        </button>
      </div>
      <div className="grid-container">{build_grid()}</div>
    </>
  );
};

export default Grid;
