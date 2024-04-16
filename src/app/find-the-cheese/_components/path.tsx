import React from "react";

interface PathProps {
  isVisited?: boolean;
  children?: React.ReactNode;
}

const path = ({ isVisited, children }: PathProps) => {
  return (
    <div
      className={`size-12 ${isVisited ? "bg-amber-200" : "bg-lime-50"} inline-flex flex-1 place-content-center items-center`}
    >
      {children}
    </div>
  );
};

export default path;
