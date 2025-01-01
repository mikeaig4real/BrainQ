"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  Chip,
  generateBoards,
  getGameSettings,
} from "./testTypeData";

// Modified Game component (only the game logic parts)
const ChipsGame: React.FC = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [ canClick, setCanClick ] = useState( true );
  const settings = getGameSettings(); // Get settings once at component level

  const [gameState, setGameState] = useState({
    level: gameSession?.[categoryIndex]?.test?.level || 1,
    leftBoard: { id: "left", chips: [] as Chip[] },
    rightBoard: { id: "right", chips: [] as Chip[] },
    feedback: "",
    correctStreak: 0,
    wrongStreak: 0,
  });

  // Add the startNewRound function
  const startNewRound = ( level: number ) =>
  {
    setCanClick( true );
    const { left, right } = generateBoards(level);
    setGameState((prev) => ({
      ...prev,
      leftBoard: { id: "left", chips: left },
      rightBoard: { id: "right", chips: right },
      feedback: "",
    }));
    updateGameStats({ totalQuestions: 1 });
  };

  // Initialize the game when component mounts
  useEffect(() => {
    startNewRound(gameState.level);
  }, []);

  const evaluateAnswer = (selectedBoardId: string): boolean => {
    const leftSum = gameState.leftBoard.chips.reduce(
      (sum, chip) => sum + chip.value,
      0
    );
    const rightSum = gameState.rightBoard.chips.reduce(
      (sum, chip) => sum + chip.value,
      0
    );

    const correctBoard = rightSum > leftSum ? "right" : "left";
    return selectedBoardId === correctBoard;
  };

  const handleBoardClick = ( boardId: string ) =>
  {
    if ( !canClick ) return;
    setCanClick( false );
    const isCorrect = evaluateAnswer(boardId);

    // Calculate new state values outside setState
    const prevState = gameState;
    let newLevel = prevState.level;
    let newCorrectStreak = isCorrect ? prevState.correctStreak + 1 : 0;
    let newWrongStreak = isCorrect ? 0 : prevState.wrongStreak + 1;

    if (isCorrect) {
      const pointsToAdd = settings.pointsPerCorrect * prevState.level;
      updateGameStats({
        totalCorrect: 1,
      });

      if (newCorrectStreak >= settings.correctStreakLimit) {
        const updatedLevel = Math.min(prevState.level + 1, 6);
        updateGameStats({ level: updatedLevel }, "set");
        newLevel = updatedLevel;
        newCorrectStreak = 0;
      }
    } else {
      if (newWrongStreak >= settings.wrongStreakLimit) {
        const updatedLevel = Math.max(prevState.level - 1, 1);
        updateGameStats({ level: updatedLevel }, "set");
        newLevel = updatedLevel;
        newWrongStreak = 0;
      }
    }

    // Update state with calculated values
    setGameState({
      ...prevState,
      level: newLevel,
      feedback: isCorrect ? "Good!" : "Wrong!",
      correctStreak: newCorrectStreak,
      wrongStreak: newWrongStreak,
    });

    setTimeout(() => {
      startNewRound(gameState.level);
    }, settings.feedbackDuration);
  };

  return (
    <div
      role="main"
      aria-label="Number Chips Comparison Game"
      className="min-h-screen flex flex-col items-center justify-center w-full mt-16"
    >
      {/* Boards Container */}
      <div
        role="group"
        aria-label="Game boards"
        className="flex flex-col md:flex-row justify-between w-full max-w-4xl gap-8"
      >
        {/* Left Board */}
        <motion.div
          role="button"
          aria-label={`Left board with sum ${gameState.leftBoard.chips.reduce(
            (sum, chip) => sum + chip.value,
            0
          )}. Click to select.`}
          className="border-2 border-red-500 rounded-lg w-full h-[200px] sm:w-full sm:h-[250px] md:w-[400px] md:h-[300px] flex flex-wrap content-start gap-1 p-2 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={ () =>
          {
            if ( !canClick ) return;
            handleBoardClick( "left" );
          }}
          tabIndex={0}
          onKeyDown={ ( e ) =>
          {
            if (!canClick) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleBoardClick("left");
            }
          }}
        >
          {gameState.leftBoard.chips.map((chip) => (
            <motion.div
              aria-label={`Chip value ${chip.value}`}
              key={chip.id}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-neutral-800 dark:text-neutral-200 text-lg font-bold pointer-events-none"
              style={{ backgroundColor: chip.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {chip.value}
            </motion.div>
          ))}
        </motion.div>

        {/* Right Board */}
        <motion.div
          role="button"
          aria-label={`Right board with sum ${gameState.rightBoard.chips.reduce(
            (sum, chip) => sum + chip.value,
            0
          )}. Click to select.`}
          className="border-2 border-red-500 rounded-lg w-full h-[200px] sm:w-full sm:h-[250px] md:w-[400px] md:h-[300px] flex flex-wrap content-start gap-1 p-2 cursor-pointer items-start justify-end"
          whileHover={{ scale: 1.02 }}
          onClick={ () =>
          {
            if ( !canClick ) return;
            handleBoardClick( "right" );
          }}
          tabIndex={0}
          onKeyDown={ ( e ) =>
          {
            if (!canClick) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleBoardClick("right");
            }
          }}
        >
          {gameState.rightBoard.chips.map((chip) => (
            <motion.div
              aria-label={`Chip value ${chip.value}`}
              key={chip.id}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-neutral-800 dark:text-neutral-200 text-lg font-bold pointer-events-none"
              style={{ backgroundColor: chip.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {chip.value}
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* Feedback */}
      {gameState.feedback && (
        <motion.div
          role="alert"
          aria-live="assertive"
          className="fixed top-8 left-0 right-0 text-neutral-800 dark:text-neutral-200 text-2xl md:text-6xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 40 }}
        >
          {gameState.feedback}
        </motion.div>
      )}
    </div>
  );
};

export default ChipsGame;
