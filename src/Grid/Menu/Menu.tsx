import React, { FC } from "react";
//Components
import MazeMenu from "./MazeMenu/MazeMenu";
//Classes
import Node from "../Algo/Node";
//CSS
import "./Menu.css";

interface props {
  animate: () => void;
  grid: Node[][];
  set_grid: React.Dispatch<React.SetStateAction<Node[][]>>;
  start: number[];
  end: number[];
  activeBtn: number;
  set_activeBtn: React.Dispatch<React.SetStateAction<number>>;
  checkActiveBtn: (id: number) => boolean;
  set_spots: React.Dispatch<React.SetStateAction<Node[]>>;
}

const Menu: FC<props> = ({
  animate,
  grid,
  set_grid,
  start,
  end,
  activeBtn,
  checkActiveBtn,
  set_activeBtn,
  set_spots,
}) => {
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
        {/* <button
          className={`menuBtn ${checkActiveBtn(4) ? "button-active" : ""}`}
          onClick={() => set_activeBtn(4)}
        >
          Draw Wall
        </button> */}
        <button
          className={`menuBtn ${checkActiveBtn(5) ? "button-active" : ""}`}
          onClick={() => set_activeBtn(5)}
        >
          Add Stop
        </button>
      </div>
      <MazeMenu
        end={end}
        grid={grid}
        set_grid={set_grid}
        start={start}
        set_spots={set_spots}
      />
      <div>
        <button className="button" onClick={() => animate()}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Menu;
