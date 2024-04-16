"use client";
import React, { useState, useEffect, useCallback } from "react";

import ToggleMenu from "./ToggleMenu";

interface HeaderProps {
  title?: string;
}

const Header = (props: HeaderProps) => {
  const { title } = props;

  const [isHidden, setIsHidden] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    const isScrollingUp = prevScrollPos > currentScrollPos;

    setIsHidden(isScrollingUp && currentScrollPos > 0);
    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, handleScroll]);

  return (
    <header
      className={`flex items-center h-[50px] justify-center fixed top-0 w-full bg-white shadow-md transition-transform duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <ToggleMenu />
      <h1 className="text-lg font-bold flex items-center">
        {title ?? "Jedi Software"}
      </h1>
    </header>
  );
};

export default Header;
