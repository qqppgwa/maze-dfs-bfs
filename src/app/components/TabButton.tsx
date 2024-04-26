import React from "react";

const TabButton = ({
  children,
  isActive,
  handleClick,
}: Readonly<{
  children: React.ReactNode;
  isActive: boolean;
  handleClick: () => void;
}>) => {
  return (
    <button
      onClick={handleClick}
      className={`${isActive && "font-bold text-blue"} bg-slate-200`}
    >
      {children}
    </button>
  );
};

export default TabButton;
