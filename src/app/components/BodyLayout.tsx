import React, { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  title?: string;
  children: JSX.Element | ReactNode;
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <div className="w-full">
      <Header title={title} />
      <main className="mt-[50px] bg-amber-50 p-4 min-h-screen min-w-[fit-content]">
        <div className="p-4 max-w-[720px] mx-auto bg-white rounded shadow md:w-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
