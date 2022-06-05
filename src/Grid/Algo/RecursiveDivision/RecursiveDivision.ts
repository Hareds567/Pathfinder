import Node from "../Node";

const HORIZONTAL = 0;
const VERTICAL = 1;

const maze = new Array<Node>();
export const chooseOrientation = (width: number, height: number) => {
  if (width < height) return HORIZONTAL;
  if (height < width) return VERTICAL;
  return Math.random() < 0.5 ? HORIZONTAL : VERTICAL;
};

export const division = (
  grid: Node[][],
  width: number,
  height: number,
  orientation: number,
  x: number,
  y: number
): Node[] => {
  if (width < 2 || height < 2) {
    return maze;
  }

  let horizontal = orientation === HORIZONTAL; //Orientation of current line
  //Start of Wall
  let wall_x = x + (horizontal ? 0 : Math.floor(Math.random() * width + 1));
  let wall_y = y + (horizontal ? Math.floor(Math.random() * height + 1) : 0);
  //Location of Passage
  const passage_x = horizontal ? Math.floor(Math.random() * width) : 0;
  const passage_y = horizontal ? 0 : Math.floor(Math.random() * height);
  //Direction of the Wall
  const direction_x = horizontal ? 1 : 0;
  const direction_y = horizontal ? 0 : 1;
  //Length of the Wall
  const length = horizontal ? width : height;

  //find if horizontal or vertical

  //Draw Wall
  for (let i = 0; i <= length; i++) {
    if (wall_x !== passage_x && wall_y !== passage_y) {
      try {
        console.log(horizontal);
        console.log(x, y);
        console.log(wall_x, wall_y);
        console.log(grid[wall_x][wall_y]);
        grid[wall_x][wall_y].isWall = true;
        maze.push(grid[wall_x][wall_y]);
      } catch (e) {
        console.log(e);
      }
      // console.log(wall_x, wall_y);
      // console.log(grid);
      // console.log(grid[wall_x][wall_y]);
    }
    wall_x += direction_x;
    wall_y += direction_y;
  }

  let next_x = x;
  let next_y = y;
  let w = horizontal ? width : wall_x + x + 1;
  let h = horizontal ? wall_y - y + 1 : height;

  division(grid, w, h, chooseOrientation(w, h), next_x, next_y);
  next_x = horizontal ? x : wall_x + 1;
  next_y = horizontal ? height + y - wall_y + 1 : height;
  w = horizontal ? width : x + width - wall_x - 1;
  y = horizontal ? y + height - wall_y - 1 : height;

  division(grid, w, h, chooseOrientation(w, h), next_x, next_y);

  return maze;
};

//============================================================================

export const division2 = (
  grid: Node[][],
  width: number,
  height: number,
  orientation: number,
  x: number,
  y: number
) => {
  //End Condition || Base case
  if (width < 2 || height < 2) {
    console.log(`Maze: ${maze.length}`);
    return maze;
  }
  //Orientation of Current Wall
  let horizontal = orientation === HORIZONTAL;
  //Start of Wall
  let wall_x =
    x + (horizontal ? 0 : Math.floor(Math.random() * (width - 1) + 1));
  let wall_y =
    y + (horizontal ? Math.floor(Math.random() * (height - 1) + 1) : 0);
  //Location of Passage
  const passage_x = horizontal ? Math.floor(Math.random() * width) : 0;
  const passage_y = horizontal ? 0 : Math.floor(Math.random() * height);
  //Length of the Wall
  const length = horizontal ? width : height;
  //Direction
  const direction_x = horizontal ? 1 : 0;
  const direction_y = horizontal ? 0 : 1;
  //Draw Wall
  for (let i = 0; i <= length; i++) {
    if (wall_x !== passage_x && wall_y !== passage_y) {
      try {
        let temp = grid[wall_x][wall_y];
        temp.isWall = true;
        setTimeout(() => {
          let test = document.getElementById(`node-${temp.x}-${temp.y}`);
          if (test) test.className = "node node-wall";
        }, 10 * i);

        maze.push(temp);
      } catch (e) {
        console.log(e);
      }
    }
    wall_x += direction_x;
    wall_y += direction_y;
  }
  // Variables for next Wall
  let next_width;
  let next_height;
  let next_x;
  let next_y;
  //Top || Left
  next_width = horizontal ? width : wall_x - 1;
  next_height = horizontal ? wall_y - 1 : height;
  next_x = x;
  next_y = y;

  console.log("Up");
  console.log(`Coordinates: ${x}, ${y}`);
  console.log(`Horizontal: ${horizontal}`);
  console.log(`Start of Wall: ${wall_x} , ${wall_y}`);
  console.log(`Curr Width: ${width} | Curr height: ${height}`);
  console.log(`Next Width: ${next_width} | Next Height: ${next_height}`);
  console.log("=====");

  // division2(
  //   grid,
  //   next_width,
  //   next_height,
  //   chooseOrientation(next_width, next_height),
  //   next_x,
  //   next_y
  // );
  // return;
  //Bottom || Right
  next_width = horizontal ? width : width - wall_x - 1;
  next_height = horizontal ? height - wall_y - 1 : height;

  next_x = horizontal ? width : wall_x;
  next_y = horizontal ? wall_y : height;

  console.log("Down");
  console.log(`Coordinates: ${x}, ${y}`);
  console.log(`Horizontal: ${horizontal}`);
  console.log(`Start of Wall: ${wall_x} , ${wall_y}`);
  console.log(`Curr Width: ${width} | Curr height: ${height}`);
  console.log(`Next Width: ${next_width} | Next Height: ${next_height}`);
  console.log("=====");

  division2(
    grid,
    next_width,
    next_height,
    chooseOrientation(next_width, next_height),
    next_x,
    next_y
  );

  // End
};
