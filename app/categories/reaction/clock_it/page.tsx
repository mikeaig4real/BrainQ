"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";

const bgColor = "bg-purple-500";

const getGameSettings = (level: number) => {
  return {
    correctStreakLimit: 2,
    wrongStreakLimit: 2,
    basePoints: 1,
    levelMultiplier: level,
    maxLevel: 6,
    minLevel: 1,
    // Precision gets stricter as level increases (from 1.0s to 0.0s)
    precisionRequired: Number(
      Math.max(1.0 - (level - 1) * 0.2, 0.0).toFixed(1)
    ),
    maxOvershoot: 1.5, // Constant max overshoot
  };
};

const StopwatchGame = () => {
  const { updateGameStats } = useGame();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [targetTime, setTargetTime] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);

  // Start the timer with new target
  useEffect(() => {
    if (!isRunning) return;

    const settings = getGameSettings(level);

    // Generate random target between 2.0 and 12.0
    const target = parseFloat((Math.random() * 10 + 2).toFixed(1));
    setTargetTime(target);
    updateGameStats({ totalQuestions: 1 });
    // Start from a random time 1-3 seconds before target
    const startTime = target - (Math.random() * 2 + 1);
    setTime(startTime);
    setTargetTime(target);

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

  const handleResult = (wasManualStop: boolean) => {
    const settings = getGameSettings(level);
    const difference = Math.abs(time - targetTime);
    const isWithinPrecision = difference <= settings.precisionRequired;

    if (isWithinPrecision) {
      const points = settings.basePoints * settings.levelMultiplier;
      updateGameStats({
        score: points,
        totalCorrect: 1,
      });
      setScore((prev) => prev + points);
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

  const stopTimer = () => {
    setIsRunning(false);
    handleResult(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Timer Display */}
      <div className={`text-7xl text-violet-500 font-mono py-8 mb-8`}>
        {time.toFixed(1)}s
      </div>

      {/* Target Time and Precision Info */}
      <div className="text-3xl text-center mb-4 text-white">
        <div>
          Target Time: <span className="font-bold">{targetTime}s </span>
        </div>
        <div className="text-2xl text-gray-600 mt-2">
          Required Precision: ±{getGameSettings(level).precisionRequired}s
        </div>
      </div>

      {/* Stop Button */}
      <button
        onClick={stopTimer}
        className={`${bgColor} text-white px-12 py-4 rounded mt-4 text-2xl`}
      >
        Stop
      </button>

      {/* Feedback */}
      {feedback && (
        <motion.div
          className="fixed top-8 left-0 right-0 text-white text-2xl md:text-6xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }} // Changed from y: 20 to y: -20
          animate={{ opacity: 1, y: 40 }}
        >
          {feedback}
        </motion.div>
      )}
    </div>
  );
};

export default StopwatchGame;
