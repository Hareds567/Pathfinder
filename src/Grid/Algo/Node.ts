class Node {
  f: number;
  g: number;
  h: number;
  x: number;
  y: number;
  previous: Node | undefined = undefined;
  neighbors: Array<Node> = [];
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isSpot: boolean;
  start: Array<number> = []
  end: Array<number> = []

  constructor(x?: number, y?: number, start?: Array<number>, end?: Array<number> , wall:boolean =true) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.start = start || [];
    this.end = end || [];
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.isWall = wall?this.prob():false;
    this.isStart = false;
    this.isEnd = false;
    this.isSpot = false

  }


  add_neighbor(grid: Array<Node[]>) {
    const rows = grid[0].length - 1; // 24 x
    const cols = grid.length - 1; // 14 y

    //Down
    if (this.x < cols) {
      this.neighbors.push(grid[this.x + 1][this.y]);
    }
    //Up
    if (this.x > 0) {
      this.neighbors.push(grid[this.x - 1][this.y]);
    }
    //Right
    if (this.y < rows) {
      this.neighbors.push(grid[this.x][this.y + 1]);
    }
    //Left
    if (this.y > 0) {
      this.neighbors.push(grid[this.x][this.y - 1]);
    }
  }

  prob = (): boolean => {
    if ((this.start[0] === this.x && this.start[1] === this.y) || (this.end[0] === this.x && this.end[1] === this.y)) {
      return false
    }
    let temp = Math.random()
    if (temp < .3) {
      return true
    }
    return false
  }
}
export default Node;
