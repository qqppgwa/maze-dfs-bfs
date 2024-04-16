import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Wall from "./wall";
import Path from "./path";
import Mouse from "./mouse";
import Cheese from "./cheese";
import type Maze from "@/model/api/maze/maze";

interface IMaze {
  maze: Maze;
}

interface IMousePos {
  x: number;
  y: number;
}

interface ITileRenderer extends IMousePos {
  tile: string;
}

const getCellKey = ({ x, y }: IMousePos) => `${x},${y}`;

const Maze = ({ maze }: IMaze) => {
  const mousePosRef = useRef<IMousePos | null>();
  const visitedNodesRef = useRef<{ [key: string]: boolean }>({});
  const highlightedNodes = useRef<{ [key: string]: boolean }>({});
  const mousePathRecordRef = useRef<IMousePos[]>([]);
  const [mousePos, setMousePos] = useState<IMousePos>();

  const [isStart, setIsStart] = useState(false);

  const TileRender = ({ tile, x, y }: ITileRenderer) => {
    const isMouse = mousePos?.x === x && mousePos?.y === y;
    const cellKey = getCellKey({ x, y });
    const highlighted = !!highlightedNodes.current?.[cellKey];
    switch (tile) {
      case "wall": {
        return <Wall />;
      }
      case "path": {
        return isMouse ? (
          <Path isVisited={highlighted}>
            <Mouse />
          </Path>
        ) : (
          <Path isVisited={highlighted} />
        );
      }
      case "start": {
        return isMouse ? (
          <Path isVisited={highlighted}>
            <Mouse />
          </Path>
        ) : (
          <Path isVisited />
        );
      }
      case "end": {
        return isMouse ? (
          <Path isVisited={highlighted}>
            <Mouse />
          </Path>
        ) : (
          <Cheese />
        );
      }
    }
  };

  const initMousePos = useCallback(() => {
    maze.forEach((mRow, rowIndx) => {
      const colIndx = mRow.indexOf("start");
      if (colIndx > -1) {
        // console.log(rowIndx, colIndx);
        setMousePos({ y: rowIndx, x: colIndx });
        visitedNodesRef.current = { [`${colIndx},${rowIndx}`]: true };
        highlightedNodes.current = {};
        mousePathRecordRef.current = [];
      }
    });
  }, [maze]);

  const findNextNode = useCallback((): IMousePos | null => {
    const directions = [
      [-1, 0], // 左
      [0, 1], // 下
      [1, 0], // 右
      [0, -1], // 上
    ];
    const currentMX = mousePos!.x;
    const currentMY = mousePos!.y;

    for (let [x, y] of directions) {
      const newX = currentMX + x;
      const newY = currentMY + y;
      const cell = maze[newY]?.[newX];
      const cellKey = getCellKey({ x: newX, y: newY });
      // 撞牆或超出迷宮，換方向
      if (!cell || cell === "wall") continue;
      // 路走過了
      if (visitedNodesRef.current[cellKey]) continue;
      // 找到新路
      visitedNodesRef.current[cellKey] = true;
      highlightedNodes.current[cellKey] = true;
      mousePathRecordRef.current.push({ x: newX, y: newY });
      return { x: newX, y: newY };
    }

    return null;
  }, [mousePos, maze]);

  useEffect(() => {
    initMousePos();
  }, [initMousePos]);

  // 開始走路
  useEffect(() => {
    if (!isStart) return;
    const timer = setInterval(() => {
      const { x, y } = mousePos!;
      // end
      if (maze[y][x] === "end") {
        setIsStart(false);
        return;
      }

      // not end
      const nextNode = findNextNode();

      // 有沒走過ㄉ點
      if (nextNode) {
        setMousePos(nextNode);
        return;
      }
      // 沒沒走過的點或沒路ㄌ, 倒退嚕
      const lastNode = mousePathRecordRef.current.at(-2)!;
      const cellKey = getCellKey({ x: mousePos!.x, y: mousePos!.y });
      mousePathRecordRef.current.pop();
      highlightedNodes.current[cellKey] = false;
      setMousePos(lastNode);
    }, 100);
    return () => clearInterval(timer);
  }, [mousePos, isStart, maze, findNextNode]);

  return (
    <div className="mb-[80px] w-[fit-content]">
      {maze.map((mazeRow, rowIdx) => {
        return (
          <div key={rowIdx}>
            {mazeRow.map((tile, colIdx) => {
              return (
                <Fragment key={colIdx}>
                  {TileRender({ tile: tile as string, x: colIdx, y: rowIdx })}
                </Fragment>
              );
            })}
          </div>
        );
      })}
      <button
        onClick={() => {
          setIsStart(true);
          initMousePos();
        }}
      >
        start
      </button>
    </div>
  );
};

export default Maze;
