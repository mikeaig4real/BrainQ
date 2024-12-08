"use client";
import React, { useEffect, useState } from "react";
import GameWrapper from "@/components/GameWrapper";
import { useGame } from "@/contexts/GameContext";
import { usePathname, useRouter } from "next/navigation";
import { categories } from "@/utils/constants";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { categoryIndex, gameSession } = useGame();
  const router = useRouter();
  const pathname = usePathname();
  const [isValidPath, setIsValidPath] = useState(false);

  const [_, __, categoryByPath] = pathname.split("/"); // Get the current path segment
  const categoryByIndex = categories[categoryIndex]?.label;

  // console.log({
  //   categoryByPath,
  //   categoryByIndex,
  //   gameSession,
  // });

  useEffect(() => {
    if (categoryByPath !== categoryByIndex) {
      router.replace("/menu/single_player");
      setIsValidPath(false);
    } else {
      setIsValidPath(true);
    }
  }, [categoryByPath, router, categoryByIndex]);

  // Only render GameWrapper if the path is valid
  if (!isValidPath) {
    return null; // Render nothing until the path is validated
  }

  return <GameWrapper>{children}</GameWrapper>;
};

export default Layout;
