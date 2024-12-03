import React from "react";
import NavBarComponent from "@/components/Navbar";

const MenuLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="min-h-screen w-full flex flex-col py-14 px-6">
      <NavBarComponent />
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </section>
  );
};

export default MenuLayout;
