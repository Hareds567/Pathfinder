import React, { FC } from "react";
//Classes
import Node from "../Algo/Node";
//CSS
import "./SpotsMenu.css";

interface props {
  grid: Node[][];
  set_grid: React.Dispatch<React.SetStateAction<Node[][]>>;
  spots: Node[];
  set_spots: React.Dispatch<React.SetStateAction<Node[]>>;
}

const SpotsMenu: FC<props> = ({ spots, set_spots, grid, set_grid }) => {
  const createSpot = (spot: Node, index: number) => {
    return (
      <div key={index} className="spot">
        {`Stop ${index + 1}`}
        <button
          onClick={() => {
            deleteSpot(spot);
          }}
        >
          X
        </button>
      </div>
    );
  };

  const deleteSpot = (spot: Node) => {
    //Update GUI
    let temp = document.getElementById(`node-${spot.x}-${spot.y}`);
    if (temp) temp.className = "node";
    let tempGrid = grid;
    //Update Grid
    tempGrid[spot.x][spot.y].isSpot = false;
    set_grid([...tempGrid]);
    //Update Spot
    let tempSpots = removeFromArray(spots, spot);
    set_spots([...tempSpots]);
  };

  const removeFromArray = <T extends unknown>(
    array: Array<T>,
    object: T
  ): T[] => {
    let temp = array;
    for (let i = temp.length - 1; i >= 0; i--) {
      if (temp[i] === object) {
        temp.splice(i, 1);
      }
    }
    return temp;
  };

  return (
    <>
      {spots.length > 0 ? (
        <div className="spot-container">
          <span className="spot-container-start">Start</span>
          <div className="spots">
            {spots.map((spot, idx) => {
              return createSpot(spot, idx);
            })}
          </div>
          <span className="spot-container-end">End</span>
        </div>
      ) : (
        <div className="spot-container"></div>
      )}
    </>
  );
};

export default SpotsMenu;
