import React from "react";

interface IPath {
  isVisited: boolean;
  children?: React.ReactNode;
}

const Path = ({ isVisited, children }: IPath) => {
  return (
    <div
      className={`size-12 inline-flex items-center ${isVisited ? "bg-amber-200" : "bg-lime-50"}`}
    >
      {children}
    </div>
  );
};

export default Path;
