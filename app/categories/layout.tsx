import React from "react";
import GameWrapper from "@/components/GameWrapper";

const layout = ( { children }: {
  children: React.ReactNode
}) => {
  return <GameWrapper>
    {children}
  </GameWrapper>
};

export default layout;
