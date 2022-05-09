import React from "react";
import Node from "./Algo/Node";
//CSS
import "./Grid.css";

const cols = 25;
const rows = 25;

const Grid = () => {
  //Generates Grid
  const generate_grid = () => {
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
  //Grids
  const [grid, set_grid] = React.useState<Node[][]>(generate_grid());
  //Sets
  const openSet = React.useRef<Node[]>([]);
  const closedSet = React.useRef<Node[]>([]);
  const [isStart, set_isStart] = React.useState(true);

  //Start Node and End Node
  const [start, set_start] = React.useState([0, 0]);
  const [end, set_end] = React.useState([rows - 1, cols - 1]);
  const path = React.useRef<Node[]>([]);

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
                : path.current.includes(node)
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
    let temp = [...arr];
    for (let i = temp.length - 1; i >= 0; i--) {
      if (temp[i] === node) {
        temp.splice(i, 1);
      }
    }
    return temp;
  };

  //Heuristic
  const heuristic = (a: Node, b: Node) => {
    var dist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    return dist;
  };

  //Update Path
  const update_path = (node: Node) => {
    let temp = path.current;
    temp.push(node);
    path.current = [...temp];
    console.log("Updating Path");
  };

  //Update Grid at Node X
  const update_grid = (node: Node) => {
    let temp = grid;
    temp[node.x][node.y] = node;
    set_grid([...temp]);
    console.log("Updating Grid");
  };

  //Check Neighbors
  const checkNeighbors = (current: Node) => {
    current.neighbors.forEach((neighbor) => {
      let tentative_gScore = current.g + heuristic(current, current);
      // console.log("=== \nTentative Score: " + tentative_gScore);
      // console.log("Neighbor G Score: " + neighbor.g);
      if (tentative_gScore <= neighbor.g) {
        if (!openSet.current.includes(neighbor)) {
          openSet.current = [...openSet.current, neighbor];
        }
        neighbor.g = tentative_gScore;
        neighbor.h = heuristic(neighbor, grid[end[0]][end[1]]);
        neighbor.f = neighbor.g + neighbor.h;
      }
    });
  };

  //Start A* algorithm
  const a_start = () => {
    console.log("Start A* algorithm");
    if (isStart) {
      openSet.current = [...openSet.current, grid[start[0]][start[1]]];
      set_isStart(false);
    }
    let lowestFIndex = 0;
    while (openSet.current.length > 0) {
      for (let i = 0; i < openSet.current.length; i++) {
        if (openSet.current[i].f < openSet.current[lowestFIndex].f) {
          lowestFIndex = i;
        }
        if (openSet.current[i].f === openSet.current[lowestFIndex].f) {
          if (openSet.current[i].g > openSet.current[lowestFIndex].g) {
            lowestFIndex = i;
          }
        }
      }
      let current = openSet.current[lowestFIndex];

      if (current === grid[end[0]][end[1]]) {
        console.log(current);
        console.log("Success");
        return;
      }

      closedSet.current = [...closedSet.current, current];
      openSet.current = removeFromArray(openSet.current, current);

      checkNeighbors(current);
      update_path(current);
    }
  };

  //Reset Grid
  const reset = () => {
    let temp = generate_grid();
    set_grid([...temp]);
    path.current = [];
    set_isStart(true);
  };

  //Use Effects

  React.useEffect(() => {
    if (!isStart) {
      a_start();
      console.log("Path Updated");
    }
    console.log(path);
  }, [path.current]);

  // React.useEffect(() => {
  //   openSet.current = [...openSet.current, grid[start[0]][start[1]]];
  // }, []);

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
