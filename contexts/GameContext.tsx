// contexts/GameContext.tsx
import {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from "react";
import { categories } from "@/utils/constants";

type GameContextType = {
  setNextCategory: () => void;
  resetProgress: () => void;
  categoryIndex: number;
  setGameIndex: (index: number) => {};
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [categoryIndex, setCategoryIndex] = useState(0);

  const resetProgress = () => {
    setCategoryIndex(0);
  };

  const setGameIndex = (index: number) => {
    setCategoryIndex(index);
  };

  const setNextCategory = () => {
    setCategoryIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % categories.length;
      console.log("Updating category index:", { prevIndex, nextIndex });
      return nextIndex;
    });
  };

  return (
    <GameContext.Provider
      value={{
        setNextCategory,
        resetProgress,
        categoryIndex,
        setGameIndex,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
