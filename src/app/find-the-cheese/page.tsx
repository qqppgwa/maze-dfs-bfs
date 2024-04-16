"use client";
import React, { useState, useEffect } from "react";
import Maze from "../model/api/maze/maze";
import MazeGame from "./_components/mazegameDFS";

const FindTheCheese = () => {
  const [mazes, setMazes] = useState<Maze[]>([]);

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

  return mazes.map((maze, index) => {
    return <MazeGame key={`maze-${index}`} maze={maze} />;
  });
};

export default FindTheCheese;
