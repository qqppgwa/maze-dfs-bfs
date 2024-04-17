"use client";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";

interface LayoutProps {
  children: JSX.Element | ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const headerTitle = pathname === "/" ? "home" : "Find the cheese";

  return (
    <div className="w-full">
      <Header title={headerTitle} />
      <main className="mt-[50px] bg-amber-50 p-4 min-h-screen min-w-[fit-content]">
        <div className="p-4 max-w-[720px] mx-auto bg-white rounded shadow md:w-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
