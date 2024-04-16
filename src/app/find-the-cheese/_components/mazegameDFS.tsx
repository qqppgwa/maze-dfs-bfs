import React, { useState, useEffect, useRef, useCallback } from "react";
import Maze from "@/model/api/maze/maze";
import Wall from "./wall";
import Path from "./path";
import Mouse from "./mouse";
import Cheese from "./cheese";

type MousePosition = { x: number; y: number };

interface MouseMazeGameProps {
  maze: Maze;
}

const TICK_TIME = 100;

class MazeGameUtility {
  static findStart(maze: string[][]): MousePosition {
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        if (maze[y][x] === "start") {
          return { x, y };
        }
      }
    }
    throw new Error("Cannot find start position");
  }

  static findNextMove(
    maze: string[][],
    x: number,
    y: number,
    visitedCells: { [key: string]: boolean }
  ): [number, number] | null {
    const directions = [
      [-1, 0], // 左
      [0, 1], // 下
      [1, 0], // 右
      [0, -1], // 上
    ];

    // 遍歷四個方向，檢查下一步是否有效
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      const newCellKey = MazeGameUtility.getCellKey(newX, newY);

      // 確認新位置是否有效
      if (
        newX >= 0 &&
        newX < maze[0].length &&
        newY >= 0 &&
        newY < maze.length
      ) {
        // 如果找到終點
        if (maze[newY][newX] === "end") {
          return [newX, newY];
        }
        // 如果是可以走的路徑且未訪問過
        if (maze[newY][newX] === "path" && !visitedCells[newCellKey]) {
          return [newX, newY];
        }
      }
    }

    // 如果四個方向都走過 or 無法前進，則返回 null
    return null;
  }

  static getCellKey(x: number, y: number) {
    return `${x},${y}`;
  }
}

const renderCell = (
  cell: string,
  {
    isVisited = false,
    isMouseAtCell = false,
  }: { isVisited: boolean; isMouseAtCell: boolean }
) => {
  if (isMouseAtCell) {
    return (
      <Path isVisited>
        <Mouse />
      </Path>
    );
  }
  if (cell === "wall") {
    return <Wall />;
  }
  if (cell === "end") {
    return <Cheese />;
  }
  return <Path isVisited={isVisited} />;
};

/**
 * MouseMazeGame
 */
const MouseMazeGame = (props: MouseMazeGameProps) => {
  const { maze } = props;
  const [forceRender, setForceRender] = useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [isSolving, setIsSolving] = useState<boolean>(false);

  const mousePosRef = useRef(mousePosition);
  const movesRecordRef = useRef<MousePosition[]>([]);
  const highlightCellsRef = useRef<{ [key: string]: boolean }>({});
  const visitedCellsRef = useRef<{ [key: string]: boolean }>({});

  const initialGame = useCallback(() => {
    const startPos =
      movesRecordRef.current?.[0] ?? MazeGameUtility.findStart(maze);
    const startCellKey = MazeGameUtility.getCellKey(startPos.x, startPos.y);

    movesRecordRef.current = [startPos];
    highlightCellsRef.current = { [startCellKey]: true };
    visitedCellsRef.current = { [startCellKey]: true };
    setMousePosition(startPos);
  }, [maze]);

  const handleButtonClick = useCallback(() => {
    initialGame();

    if (!isSolving) {
      setIsSolving(true);
    }
  }, [initialGame, isSolving]);

  /**
   * 初始化老鼠位置 on mount
   */
  useEffect(() => {
    initialGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mousePosRef.current = mousePosition;
  }, [mousePosition]);

  useEffect(() => {
    if (isSolving) {
      const timer = setInterval(() => {
        setForceRender((prev) => !prev);
      }, TICK_TIME);
      return () => clearInterval(timer);
    }
  }, [isSolving]);

  useEffect(() => {
    if (isSolving) {
      const { x, y } = mousePosRef.current;

      if (maze[y][x] === "end") {
        setIsSolving(false);
        return;
      }

      const nextMove = MazeGameUtility.findNextMove(
        maze,
        x,
        y,
        visitedCellsRef.current
      );
      // 如果四個方向都走過 or 無法前進，
      // 往回走
      if (!nextMove) {
        const lastMove = movesRecordRef.current.at(-2)!;
        movesRecordRef.current.pop();
        const currMousePosKey = MazeGameUtility.getCellKey(x, y);
        highlightCellsRef.current[currMousePosKey] = false;
        setMousePosition(lastMove);

        return;
      }
      // Otherwise, move to next cell
      const [newX, newY] = nextMove;
      const nextMousePos = { x: newX, y: newY };
      const nextMousePosCellKey = MazeGameUtility.getCellKey(newX, newY);
      movesRecordRef.current.push(nextMousePos);
      highlightCellsRef.current[nextMousePosCellKey] = true;
      visitedCellsRef.current[nextMousePosCellKey] = true;
      setMousePosition(nextMousePos);
    }
  }, [isSolving, maze, forceRender]);

  return (
    <div className="mb-[50px] flex flex-col items-center">
      <div className="w-[fit-content] ">
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => {
              const isMouseAtCell =
                mousePosition.x === cellIndex && mousePosition.y === rowIndex;
              return (
                <div key={cellIndex} className="flex size-12">
                  {renderCell(cell, {
                    isVisited:
                      highlightCellsRef.current[`${cellIndex},${rowIndex}`],
                    isMouseAtCell,
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <button
        className=" block bg-amber-500 hover:amber-400 full w-[90%] mt-[10px]"
        onClick={handleButtonClick}
      >
        {isSolving ? "Reset" : "Start"}
      </button>
    </div>
  );
};

export default MouseMazeGame;
