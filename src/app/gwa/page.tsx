"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../_components/Layout";
import Maze from "./_components/maze";
import Wall from "./_components/wall";

export default function Gwa() {
  const [mazeData, setMazeData] = useState([]);

  const callApi = () => {
    console.log("4");
    axios
      .get("../api/maze")
      .then((res) => {
        setMazeData(res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    callApi();
  }, []);

  return (
    <div>
      {mazeData.map((m, i) => {
        return <Maze key={i} maze={m} />;
      })}
    </div>
  );
}

Gwa.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
