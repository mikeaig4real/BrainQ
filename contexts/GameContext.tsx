"use client";
// contexts/GameContext.tsx
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/utils/constants";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";
import { StorageService } from "@/services";

const client = generateClient<Schema>();

type Test = {
  level: number;
  qps: number;
};

type CategoryTest = {
  id: number;
  level: number;
  label: string;
  totalQuestions: number;
  totalCorrect: number;
  qps: number;
};

type Category = {
  id: string | number;
  label: string;
  started: boolean;
  startedAt: Date | null;
  endedAt: Date | null;
  ended: boolean;
  test: CategoryTest;
  tests: {
    [key: string]: Test;
  };
  categoryProgression: number[]; // You might want to be more specific about what goes in this array
};

// The final SESSION_STATE type would be an array of Category
type SessionState = Category[];

const SESSION_STATE: SessionState = categories.map((category) => {
  const tests = category?.tests?.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.label]: {
        level: 1,
        qps: curr.qps,
      },
    };
  }, {});
  return {
    id: category.id,
    label: category.label,
    started: false,
    startedAt: null,
    endedAt: null,
    ended: false,
    test: {
      id: 0,
      level: 1,
      label: "",
      totalQuestions: 0,
      totalCorrect: 0,
      qps: 0,
    },
    tests,
    categoryProgression: [0],
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
  duration: number;
  setDuration: (duration: number) => void;
  user: any;
  signOut: () => void;
  allowClicks: boolean;
  haveFinishedAllGames: () => boolean;
  getCategoryIndexFromSession: (session: SessionState) => number;
};

interface UserInfo {
  loginId: string;
  userId: string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [gameSession, setGameSession] = useState(SESSION_STATE);
  const [storageService, setStorageService] = useState<StorageService | null>(
    null
  );
  const [allowClicks, setAllowClicks] = useState(false);
  const [duration, setDuration] = useState(60);

  const { signOut, user } = useAuthenticator();

  const updateGameSession = (session: typeof SESSION_STATE) => {
    setGameSession(session);
  };

  const saveGameSessionLocal = async (session: any) => {
    if (!storageService || !session) return;
    await storageService.saveGameSession(session);
  };

  const getGameSessionAmp = async () => {
    if (!user) return;
    const {
      data: [userSession],
      errors,
    } = await client.models.UserSession.list();
    return userSession || null;
  };

  const saveGameSessionAmp = async (session: any) => {
    if (!user || !session) return;
    const { loginId: email } = user.signInDetails as UserInfo;
    let savedSession;
    const gameSessionExists = await getGameSessionAmp();
    if (!gameSessionExists) {
      const { data, errors } = await client.models.UserSession.create({
        email,
        gameSession: JSON.stringify(session),
      });
      savedSession = data;
    } else {
      const { data, errors } = await client.models.UserSession.update({
        id: gameSessionExists.id,
        gameSession: JSON.stringify(session),
      });
      savedSession = data;
    }
    return savedSession;
  };
  const deleteGameSessionAmp = async ({ id }: { id: string }) => {
    if (!user) return;
    const { data, errors } = await client.models.UserSession.delete({
      id,
    });
    return data;
  };

  const getGameSessionLocal = async () => {
    if (!storageService) return;
    const session = await storageService.getGameSession();
    return session;
  };

  const clearGameSessionLocal = async () => {
    if (!storageService) return;
    await storageService.clearGameSession();
  };

  const haveFinishedAllGames = () =>
  {
    return gameSession.every((category) => category.started && category.ended);
  }

  const getCategoryIndexFromSession = (session: typeof SESSION_STATE) => {
    const categoryIndex = session?.findIndex((category) => !category?.ended);
    return categoryIndex;
  };

  const loadGameSession = async (service: StorageService) => {
    // check to see if a session exits on the local
    setAllowClicks( false );
    if (!service) return;
    let prevGameSession = await service.getGameSession();
    if (!prevGameSession) {
      // no game session found locally try amplify client
      const {
        data: [prevGameSessionAmp],
        errors,
      } = await client.models.UserSession.list();
      if (
        prevGameSessionAmp &&
        typeof prevGameSessionAmp?.gameSession === "string"
      ) {
        prevGameSession = JSON.parse(prevGameSessionAmp.gameSession);
        await service.saveGameSession( prevGameSession );
      } else
      {
        setAllowClicks(true);
        return;
      }
    }
    updateGameSession(prevGameSession);
    const prevCategoryIndex = getCategoryIndexFromSession(prevGameSession);
    setCategoryIndex(prevCategoryIndex === -1 ? 0 : prevCategoryIndex);
    setAllowClicks(true);
  };

  useEffect( () =>
  {
    console.log( {
      categoryIndex,
    gameSession,
    storageService,
    user,
    duration,
    router,
    allowClicks,
    })
  }, [
    categoryIndex,
    gameSession,
    storageService,
    user,
    duration,
    router,
    allowClicks,
  ])

  useEffect(() => {
    if (user) {
      const { loginId: email } = user.signInDetails as UserInfo;
      const service = new StorageService({ email });
      setStorageService(service);
      loadGameSession(service);
    }
  }, [user]);

  const resetProgress = () => {
    const resetProgressData = gameSession.map((category) => {
      category.ended = false;
      category.started = false;
      return category;
    });
    updateGameSession(resetProgressData);
    saveGameSessionLocal( resetProgressData );
    saveGameSessionAmp(resetProgressData);
  };

  const setGameIndex = (index: number) => {
    setCategoryIndex(index);
  };

  const setNextCategory = () =>
  {
    const index = getCategoryIndexFromSession( gameSession );
    setCategoryIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % categories.length;
      return nextIndex === index || index === -1 ? nextIndex : index;
    });
  };

  const endCategory = () => {
    const calculateMean = (values: number[]) => {
      return Math.floor(
        values.reduce((prev, curr) => prev + curr) / values.length
      );
    };
    const calculateProgression = (values: number[], value: number) => {
      if (values.length <= 1) return [...values, value];
      const mean = calculateMean(values);
      return [mean, value];
    };
    const endCategoryData = gameSession.map((category) => {
      if (category.id === categoryIndex + 1) {
        category.ended = true;
        category.endedAt = new Date();
        category.tests[category?.test?.label].level = category.test.level;
        const progression = category.categoryProgression;
        const totalCorrect = category.test.totalCorrect;
        const totalQuestions = category.test.totalQuestions;
        category.categoryProgression = calculateProgression(
          progression,
          Math.min(
            Math.floor(
              +(
                totalCorrect /
                calculateMean([
                  totalQuestions,
                  Math.floor(category.test.qps * duration),
                ])
              ).toFixed(2) * 100
            ),
            100
          )
        );
      }
      return category;
    });
    updateGameSession(endCategoryData);
    saveGameSessionLocal(endCategoryData);
    saveGameSessionAmp(endCategoryData);
    setTimeout(() => {
      if (categoryIndex + 1 < categories.length) {
        router.replace("/menu/single_player");
        return;
      }
      router.replace("/menu/stats");
    }, 3000);
    setTimeout(() => {
      if (categoryIndex + 1 < categories.length) {
        setNextCategory();
        return;
      }
      haveFinishedAllGames() && resetProgress();
    }, 4000);
  };

  const startCategory = () => {
    const startCategoryData = gameSession.map((category) => {
      if (category.id === categoryIndex + 1) {
        category.started = true;
        category.startedAt = new Date();
      }
      return category;
    });
    updateGameSession(startCategoryData);
    saveGameSessionLocal(startCategoryData);
  };

  const setTest = (randomTest: any) => {
    const setTestData = gameSession.map((category) => {
      if (category.id === categoryIndex + 1) {
        const level =
          gameSession?.[categoryIndex]?.tests?.[randomTest?.label]?.level || 1;
        return {
          ...category,
          test: {
            id: randomTest.id,
            label: randomTest.label,
            level,
            qps: randomTest.qps,
            totalQuestions: 0,
            totalCorrect: 0,
          },
        };
      } else {
        return category;
      }
    });
    updateGameSession(setTestData);
    saveGameSessionLocal(setTestData);
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
    saveGameSessionLocal(newSession);
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
        duration,
        setDuration,
        user,
        signOut,
        allowClicks,
        haveFinishedAllGames,
        getCategoryIndexFromSession,
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
