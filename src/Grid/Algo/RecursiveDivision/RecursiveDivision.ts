import { Console } from "console";
import { createNoSubstitutionTemplateLiteral } from "typescript";
import Node from "../Node";

const HORIZONTAL = 0;
const VERTICAL = 1;

//==========================================

const wallDirection = (start: number[], end: number[]) => {
  if (start[0] !== end[0]) return HORIZONTAL;
  return VERTICAL;
};
const drawBorders = (grid: Node[][]) => {
  let temp = grid;
  let width = grid.length;
  let height = grid[0].length;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let current = document.getElementById(
        `node-${grid[i][j].x}-${grid[i][j].y}`
      );
      if (i === 0) {
        temp[i][j].isWall = true;
        current && current.classList.add("node-wall");
      }
      if (i === width - 1) {
        temp[i][j].isWall = true;
        current && current.classList.add("node-wall");
      }
      if (j === 0) {
        temp[i][j].isWall = true;
        current && current.classList.add("node-wall");
      }
      if (j === height - 1) {
        temp[i][j].isWall = true;
        current && current.classList.add("node-wall");
      }
    }
  }
  return temp;
};

const findPassage = (
  start: number[],
  end: number[],
  grid: Node[][]
): number[] => {
  let max: number;
  let min: number;
  let x: number = 0;
  let y: number = 0;

  const currentDirection = wallDirection(start, end);
  if (currentDirection === 0) {
    if (start[0] > end[0]) {
      max = start[0];
      min = end[0];
    } else {
      max = end[0];
      min = start[0];
    }
    x = Math.floor(Math.random() * (max - min + 1) + min);
    y = start[1];
  }
  if (currentDirection === 1) {
    if (start[1] > end[1]) {
      max = start[1];
      min = end[1];
    } else {
      max = end[1];
      min = start[1];
    }
    x = start[0];
    y = Math.floor(Math.random() * (max - min + 1) + min);
  }
  if (!grid[x][y].isWall) findPassage(start, end, grid);
  return [x, y];
};

export const recursiveDivision = (
  startCor: number[],
  endCor: number[],
  rect_width: number,
  rect_height: number,
  grid: Node[][],
  isFirst: boolean
) => {
  if (Math.abs(rect_width) < 2 || Math.abs(rect_height) < 2) {
    return;
  }
  //Direction of current Wall
  const DIRECTION = wallDirection(startCor, endCor);

  //Grid with borders
  let temp = drawBorders(grid);

  //Wall Start and End Coordinates
  let wall_StartX =
    DIRECTION === 0 ? Math.floor(Math.random() * rect_width) : startCor[0];
  let wall_StartY =
    DIRECTION === 0 ? startCor[1] : Math.floor(Math.random() * rect_height);
  let wall_endX = wall_StartX;
  let wall_endY = wall_StartY;

  //Length of the Wall
  const length = DIRECTION === 0 ? rect_height : rect_width;
  const relativeDirection = length >= 0 && !isFirst ? -1 : 1;

  //Draw Wall
  for (let i = 0; i <= length; i++) {
    try {
      temp[wall_endX][wall_endY].isWall = true;
      document
        .getElementById(`node-${wall_endX}-${wall_endY}`)
        ?.classList.add("node-wall");
      wall_endX += DIRECTION === 1 ? 1 * relativeDirection : 0;
      wall_endY += DIRECTION === 0 ? 1 * relativeDirection : 0;
    } catch (e) {
      console.log(e);
    }
  }

  //Empty Spot on the wall
  const passageCor = findPassage(
    [wall_StartX, wall_StartY],
    [wall_endX, wall_endY],
    grid
  );
  document
    .getElementById(`node-${passageCor[0]}-${passageCor[1]}`)
    ?.classList.remove("node-wall");

  //Next Values
  let next_startCor;
  let next_endCor;
  let next_width;
  let next_height;
  if (DIRECTION === 0) {
    next_startCor = [wall_StartX, wall_StartY];
    next_endCor = [wall_endX, wall_endY];
    next_width = wall_StartX - startCor[0];
    next_height = wall_endY - wall_StartY;

    console.log("Horizontal");
    console.log(`Coordinates: ${startCor} | ${endCor}`);
    console.log(`Direction: ${DIRECTION}`);
    console.log(`Length: ${length}`);
    console.log(`Wall Start: ${wall_StartX}, ${wall_StartY}`);
    console.log(`Wall End: ${wall_endX}, ${wall_endY}`);
    console.log(`Next Width: ${next_width} | Next height: ${next_height}`);
    console.log(`Next Coordinates Start: ${next_startCor}`);
    console.log(`Next Coordinates End: ${next_endCor}`);
    console.log("=======");
    recursiveDivision(
      next_startCor,
      next_endCor,
      next_width,
      next_height,
      temp,
      false
    );
  }
  if (DIRECTION === 1) {
    next_startCor = [wall_StartX, wall_StartY];
    next_endCor = [wall_endX, wall_endY];
    next_width = wall_StartX - wall_endX;
    next_height = wall_StartY - startCor[1];
    // recursiveDivision(
    //   next_startCor,
    //   next_endCor,
    //   next_width,
    //   next_height,
    //   temp,
    //   false
    // );
    console.log("Vertical");
    console.log(`Start: ${startCor}`);
    console.log(`End: ${endCor}`);
    console.log(`Length: ${length}`);
    console.log(`Wall Start: ${wall_StartX}, ${wall_StartY}`);
    console.log(`Wall End: ${wall_endX}, ${wall_endY}`);
    console.log("=======");
  }
};
