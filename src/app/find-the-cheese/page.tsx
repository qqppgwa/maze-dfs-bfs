"use client";
import React, { useState, useEffect } from "react";
import Maze from "../model/api/maze/maze";
import DFS from "./_components/mazegameDFS";
import BFS from "./_components/mazegameBFS";
import TabButton from "@/components/TabButton";

const TYPE_DFS = 1;
const TYPE_BFS = 2;

type TSearchType = typeof TYPE_DFS | typeof TYPE_BFS;

const FindTheCheese = () => {
  const [mazes, setMazes] = useState<Maze[]>([]);
  const [searchType, setSearchType] = useState<TSearchType>(TYPE_DFS);

  const handleTabClick = (type: TSearchType) => {
    setSearchType(type);
  };

  useEffect(() => {
    fetch("/api/maze")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response.json);
        return response.json();
      })
      .then((data: Maze[]) => setMazes(data))
      .catch((error) => {
        // its a demo, so there is no error case will occur
      });
  }, []);

  return (
    <>
      <div className="flex gap-[30px]">
        <TabButton
          isActive={searchType === TYPE_DFS}
          handleClick={() => handleTabClick(TYPE_DFS)}
        >
          123
        </TabButton>
        <TabButton
          isActive={searchType === TYPE_BFS}
          handleClick={() => handleTabClick(TYPE_BFS)}
        >
          1223
        </TabButton>
      </div>
      {searchType === TYPE_DFS
        ? mazes.map((maze, index) => {
            return <DFS key={`maze-${index}`} maze={maze} />;
          })
        : mazes.map((maze, index) => {
            return <BFS key={`maze-${index}`} maze={maze} />;
          })}
    </>
  );
};

export default FindTheCheese;
