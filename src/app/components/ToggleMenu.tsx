"use client";
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";

const ToggleMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <button className="absolute left-[10px]" onClick={handleToggle}>
        <GiHamburgerMenu />
      </button>

      <ul
        className={`absolute top-[50px] duration-300 bg-white shadow-md ${
          menuOpen ? "left-0 " : "-left-[100%]"
        }`}
      >
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/find-the-cheese">find the cheese</Link>
        </li>
      </ul>
    </>
  );
};

export default ToggleMenu;
