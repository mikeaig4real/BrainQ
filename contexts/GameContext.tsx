"use client";
// contexts/GameContext.tsx
import {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/utils/constants";

// Add this interface for test statistics
interface GameStats {
  level: number;
  score: number;
  totalQuestions: number;
  totalCorrect: number;
}

const SESSION_STATE = categories.map((category) => {
  return {
    id: category.id,
    label: category.label,
    started: false,
    ended: false,
    test: {},
  };
});

type GameContextType = {
  setNextCategory: () => void;
  resetProgress: () => void;
  categoryIndex: number;
  setGameIndex: (index: number) => void;
  gameSession: typeof SESSION_STATE;
  updateGameSession: (session: typeof SESSION_STATE) => void;
  updateGameStats: (stats: any, type?: string) => void;
  endCategory: () => void;
  startCategory: () => void;
  setTest: (randomTest: any) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [gameSession, setGameSession] = useState(SESSION_STATE);

  const resetProgress = () => {
    setCategoryIndex(0);
  };

  const setGameIndex = (index: number) => {
    setCategoryIndex(index);
  };

  const setNextCategory = () => {
    setCategoryIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % categories.length;
      return nextIndex;
    });
  };

  const updateGameSession = (session: typeof SESSION_STATE) => {
    setGameSession(session);
  };

  const endCategory = () => {
    const endCategoryData = gameSession.map((category) => {
      if (category.id === categoryIndex + 1) {
        return {
          ...category,
          ended: true,
        };
      } else {
        return category;
      }
    });
    setTimeout(() => {
      updateGameSession(endCategoryData);
      router.replace("/menu/single_player");
      setTimeout(() => {
        setNextCategory();
      }, 1000);
    }, 3000);
  };

  const startCategory = () => {
    const startCategoryData = gameSession.map((category) => {
      if (category.id === categoryIndex + 1) {
        return {
          ...category,
          started: true,
        };
      } else {
        return category;
      }
    });
    updateGameSession(startCategoryData);
  };

  const setTest = (randomTest: any) => {
    const setTestData = gameSession.map((category) => {
      if (category.id === categoryIndex + 1) {
        return {
          ...category,
          test: {
            id: randomTest.id,
            label: randomTest.label,
            level: 1,
            score: 0,
            totalQuestions: 0,
            totalCorrect: 0,
          },
        };
      } else {
        return category;
      }
    });
    updateGameSession(setTestData);
  };

  const updateGameStats = (stats: any, type = "inc") => {
    const newSession = gameSession.map((category: any) => {
      if (category.id === categoryIndex + 1) {
        for (let statKey in stats) {
          type === "inc"
            ? (category.test[statKey] += stats[statKey])
            : (category.test[statKey] = stats[statKey]);
        }
      }
      return category;
    });
    updateGameSession(newSession);
  };

  return (
    <GameContext.Provider
      value={{
        setNextCategory,
        resetProgress,
        categoryIndex,
        setGameIndex,
        gameSession,
        updateGameSession,
        updateGameStats,
        endCategory,
        startCategory,
        setTest,
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
