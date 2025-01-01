"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { getGameSettings, bgColor } from "./testTypeData";

const StopwatchGame = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [ targetTime, setTargetTime ] = useState( 0 );
  const [canClick, setCanClick] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [level, setLevel] = useState(
    gameSession?.[categoryIndex]?.test?.level || 1
  );
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);

  // Start the timer with new target
  useEffect(() => {
    if (!isRunning) return;
    const settings = getGameSettings(level);

    // Generate random target between 2.0 and 12.0
    const target = parseFloat((Math.random() * 10 + 2).toFixed(1));
    setTargetTime(target);
    // Start from a random time 1-3 seconds before target
    const startTime = target - (Math.random() * 2 + 1);
    setTime(startTime);
    setTargetTime( target );
    setCanClick( true );

    const interval = setInterval(() => {
      setTime((prev) => {
        const newTime = prev + 0.1;
        // Auto-stop if we're MAX_OVERSHOOT seconds past the target
        if (newTime > target + settings.maxOvershoot) {
          clearInterval(interval);
          setIsRunning(false);
          handleResult(false);
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, level]);

  const handleResult = ( wasManualStop: boolean ) =>
  {
    setCanClick(false);
    updateGameStats({ totalQuestions: 1 });
    const settings = getGameSettings(level);
    const difference = +Math.abs(time - targetTime).toFixed(1);
    const isWithinPrecision = difference <= settings.precisionRequired;
    console.log( {
      difference,
      isWithinPrecision,
      time,
      targetTime,
      precisionRequired: settings.precisionRequired,
    })
    if (isWithinPrecision) {
      updateGameStats({
        totalCorrect: 1,
      });
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);
      setFeedback("Good!");

      if (correctStreak + 1 >= settings.correctStreakLimit) {
        updateGameStats(
          { level: Math.min(level + 1, settings.maxLevel) },
          "set"
        );
        setTimeout(() => {
          setFeedback("");
          setLevel((prev) => Math.min(prev + 1, settings.maxLevel));
          setCorrectStreak(0);
          setTime(0);
          setIsRunning(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setFeedback("");
          setTime(0);
          setIsRunning(true);
        }, 1500);
      }
    } else {
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);
      setFeedback("Wrong!");

      if (
        wrongStreak + 1 >= settings.wrongStreakLimit &&
        level > settings.minLevel
      ) {
        updateGameStats(
          { level: Math.max(level - 1, settings.minLevel) },
          "set"
        );
        setTimeout(() => {
          setFeedback("");
          setLevel((prev) => Math.max(prev - 1, settings.minLevel));
          setWrongStreak(0);
          setTime(0);
          setIsRunning(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setFeedback("");
          setTime(0);
          setIsRunning(true);
        }, 1500);
      }
    }
  };

  const stopTimer = () =>
  {
    if (!canClick) return;
    setIsRunning(false);
    handleResult(true);
  };

  return (
    <div
      role="main"
      aria-label="Time Estimation Game"
      className="flex flex-col items-center gap-4"
    >
      {/* Timer Display */}
      <div
        role="timer"
        aria-live="polite"
        aria-label={`Current time: ${time.toFixed(1)} seconds`}
        className={`text-7xl text-violet-500 font-mono py-8 mb-8`}
      >
        {time.toFixed(1)}s
      </div>

      {/* Target Time and Precision Info */}
      <div
        role="region"
        aria-label="Game objectives"
        className="text-3xl text-center mb-4 text-neutral-800 dark:text-neutral-200"
      >
        <div>
          Target Time:{" "}
          <span
            aria-label={`Target time is ${targetTime} seconds`}
            className="font-bold"
          >
            {targetTime}s{" "}
          </span>
        </div>
        <div
          aria-label={`Required precision: plus or minus ${
            getGameSettings(level).precisionRequired
          } seconds`}
          className="text-2xl text-gray-600 mt-2"
        >
          Required Precision: ±{getGameSettings(level).precisionRequired}s
        </div>
      </div>

      {/* Stop Button */}
      <button
        aria-label="Stop timer"
        aria-pressed="false"
        onClick={ () =>
        {
          if (!canClick) return;
          stopTimer();
        }}
        className={`${bgColor} text-neutral-800 dark:text-neutral-200 px-12 py-4 rounded mt-4 text-2xl`}
      >
        Stop
      </button>

      {/* Feedback */}
      {feedback && (
        <motion.div
          className="fixed top-8 left-0 right-0 text-neutral-800 dark:text-neutral-200 text-2xl md:text-6xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }} // Changed from y: 20 to y: -20
          animate={{ opacity: 1, y: 40 }}
          role="alert"
          aria-live="assertive"
        >
          {feedback}
        </motion.div>
      )}
    </div>
  );
};

export default StopwatchGame;
