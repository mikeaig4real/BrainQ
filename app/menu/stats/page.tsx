"use client";

import React, { useEffect } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { IconType } from "react-icons";
import { PiMathOperationsFill as MathIcon } from "react-icons/pi";
import { FaBrain as MemoryIcon } from "react-icons/fa6";
import { BsFillStopwatchFill as ReactionIcon } from "react-icons/bs";
import { FaEye as FocusIcon } from "react-icons/fa6";
import { ImSpellCheck as WordsIcon } from "react-icons/im";
import { TbManualGearboxFilled as LogicIcon } from "react-icons/tb";

const categoryIcons: { [key: string]: IconType } = {
  math: MathIcon,
  memory: MemoryIcon,
  reaction: ReactionIcon,
  focus: FocusIcon,
  word: WordsIcon,
  logic: LogicIcon,
};

const getProgressColor = (progress: number) => {
  if (progress <= 40) return "#EF4444"; // Red
  if (progress <= 70) return "#FBBF24"; // Yellow
  return "#22C55E"; // Green
};

const Counter = ({
  from,
  to,
  duration = 10,
  className = "",
}: {
  from: number;
  to: number;
  duration?: number;
  className: string;
}) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
    });

    return controls.stop;
  }, [from, to, duration]);
  return <motion.span className={className}>{rounded}</motion.span>;
};

const getConclusion = (categories: { label: string; progress: number[] }[]) => {
  const highPerforming = categories
    .filter((cat) => (cat?.progress?.[1] || 0) > 70)
    .map((cat) => cat.label);
  const averagePerforming = categories
    .filter(
      (cat) => (cat?.progress?.[1] || 0) > 40 && (cat?.progress[1] || 0) <= 70
    )
    .map((cat) => cat.label);
  const lowPerforming = categories
    .filter((cat) => (cat?.progress?.[1] || 0) <= 40)
    .map((cat) => cat.label);

  if (lowPerforming.length === 0 && averagePerforming.length === 0) {
    return "Very good overall performance! Keep it up!";
  } else if (lowPerforming.length === 0) {
    return `You did very great in ${highPerforming.join(
      ", "
    )}, good job! Keep practicing with ${averagePerforming.join(", ")}.`;
  } else {
    return `Hmmm..., you seem to be struggling with ${lowPerforming.join(
      ", "
    )}, but cheer up! You just need more practice.`;
  }
};

const StatsPage = () => {
  const { gameSession, setGameIndex, getCategoryIndexFromSession } = useGame();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  useEffect( () =>
  {
    const index = getCategoryIndexFromSession( gameSession );
    setGameIndex(index);
  }, [] );

  const progressBars = gameSession.map((category: any) => ({
    label: category.label,
    progress: category?.categoryProgression,
    totalCorrect: category.test.totalCorrect,
    totalQuestions: category.test.totalQuestions,
  }));

  return (
    <main className="flex flex-col items-center select-none">
      <div className="w-[90vw] max-w-5xl px-4 py-1 md:px-6 lg:px-8 mt-1">
        <p className="text-[0.7rem]">
          Note: This is a cumulative of your performance
        </p>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {progressBars.map((category) => {
            const Icon = categoryIcons[category.label];
            return (
              <div
                key={category.label}
                className="bg-transparent p-1 rounded-lg flex items-center gap-1"
              >
                <Icon size={24} />
                <div className="flex-grow">
                  <h2 className="text-sm font-semibold capitalize">
                    {category.label}
                  </h2>
                  <div className="h-5 bg-transparent rounded-full overflow-hidden">
                    <motion.div
                      initial={ {
                        width: `${ category?.progress?.[ 0 ] ?? 0 }%`,
                        backgroundColor: getProgressColor(
                          category?.progress?.[0] ?? 0
                        ),
                      }}
                      animate={{
                        width: `${category?.progress?.[1] ?? 0}%`,
                        backgroundColor: getProgressColor(
                          category?.progress?.[1] ?? 0
                        ),
                      } }
                      transition={{ duration: 5, ease: "easeOut", delay: 2 }}
                      className="h-full rounded-full flex items-center justify-end pr-2"
                    >
                      <Counter
                        from={category?.progress?.[0] ?? 0}
                        to={category?.progress?.[1] ?? 0}
                        className="text-black text-sm font-bold"
                      /><span className="text-black font-extrabold">%</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="mt-3 bg-gray-900 p-2 rounded-lg text-center">
          <h2 className="text-sm font-bold text-green-400">Conclusion</h2>
          <p className="text-gray-300 text-sm mt-2">
            {getConclusion(progressBars)}
          </p>
        </div>
      </div>
    </main>
  );
};

export default StatsPage;
