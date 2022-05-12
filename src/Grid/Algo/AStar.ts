import Node from "./Node";
export interface Results {
  path: Node[];
  result: Node[]
}
let start:Node = new Node()

//Start of the Algorithm
export const aStar = (startNode: Node, finishNode: Node) => {

  start = startNode

  let openSet = new Array<Node>();
  let closedSet = new Array<Node>();
  let path = new Array<Node>();
  let result = new Array<Node>();
  //Start algo with the start Node
  openSet.push(startNode);

  //While there are elements in the open Set
  while (openSet.length > 0) {
    let current = openSet[findNodeWithLowestF(openSet)]
    //End Condition | We are at the finish Node
    if (current.x === finishNode.x && current.y === finishNode.y) {
      path.push(current);
      result = getFinalPath(current)
      const results: Results = {
        path,
        result
      }
      console.log("Success!!")
      return results
    }

    //Update Sets
    openSet = removeFromArray(openSet, current)
    closedSet.push(current)


    //Testing Area
    let current_G = current.g
    let start = true
    //=============

    let neighbors = current.neighbors
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i]
      let tentativeGScore = current.g + heuristic(current, neighbor)

      //Assign the Current Path to the first Neighbor
      if (start) {
        current_G = current_G + heuristic(current, neighbor)
        start = false
      }

      //Check if current Path neighbor has the best Path
      if (!closedSet.includes(neighbor)) {
        if (tentativeGScore <= current_G && !neighbor.isWall) {
          if (!openSet.includes(neighbor)) openSet.push(neighbor)
          neighbor.previous = current
          neighbor.g = tentativeGScore
          neighbor.h = heuristic(neighbor, finishNode)
          neighbor.f = neighbor.g + neighbor.h
        }
      }

    }
    path.push(current)

    //Update Path Once we are done with current
  }
  let temp: Results = {
    path,
    result
  }
  console.log("Failure")
  return temp
}

//Remove Element from Array
const removeFromArray = (array: Array<any>, object: any) => {
  let temp = array
  for (let i = temp.length - 1; i >= 0; i--) {
    if (temp[i] === object) {
      temp.splice(i, 1);
    }
  }
  return temp;
};

//Find Node with Lowest Index
const findNodeWithLowestF = (arr: Node[]) => {
  let fIndex = 0
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].f < arr[fIndex].f) {
      fIndex = i
    }
    if (arr[i].f === arr[fIndex].f) {
      if (arr[i].g > arr[fIndex].g) {
        fIndex = i;
      }
    }
  }


  return fIndex
}

//Heuristic
const heuristic = (a: Node, b: Node) => {
  var dist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
  return dist
}

//Get the Optimal Path
const getFinalPath = (end: Node): Array<Node> => {
  let path = new Array<Node>()
  let temp = end
  while (temp.x !== start.x || temp.y !== start.y) {
    if (temp.previous) {
      path.push(temp.previous)
      temp = temp.previous
    }
  }
  return path
}