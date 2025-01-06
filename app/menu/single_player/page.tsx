"use client";

import React, { useState, useEffect } from "react";
import { categories } from "@/utils/constants";
import { useGame } from "@/contexts/GameContext";
import { useRouter } from "next/navigation";
import { IconType } from "react-icons";
import IconWrapper from "@/components/IconWrapper";

const SinglePlayerPage = (): JSX.Element => {
  const { categoryIndex, setGameIndex, gameSession, setTest, allowClicks } =
    useGame();
  const [randomTest, setRandomTest] = useState(
    categories[categoryIndex]?.tests?.[0]
  );
  const router = useRouter();

  const getTestIndex = ({
    session,
    categories,
    categoryIndex,
  }: {
    session: any[];
    categories: any[];
    categoryIndex: number;
    } ) =>
  {
    return 0;
    if (
      session &&
      session?.[categoryIndex].started &&
      !session?.[categoryIndex].ended
    )
      return (session?.[categoryIndex]?.test?.id || 1) - 1;
    return Math.floor(
      Math.random() * categories?.[categoryIndex]?.tests?.length
    );
  };

  useEffect(() => {
    const testIndex = getTestIndex({
      session: gameSession,
      categories,
      categoryIndex,
    });
    const test = categories?.[categoryIndex]?.tests?.[testIndex] || {};
    setRandomTest(test);
  }, [categoryIndex]);

  const handleGameClick = () => {
    const { started, ended } = gameSession[categoryIndex];
    if (ended || !allowClicks) return;
    setTest(randomTest);
    router.replace(
      `/categories/${categories[categoryIndex].label}/${randomTest.label}`
    );
  };

  const getGameDivColor = () => {
    const { started, ended } = gameSession[categoryIndex];
    if (!ended && allowClicks)
      return `${categories[categoryIndex].bgColor} cursor-pointer`;
    return "bg-gray-500 cursor-not-allowed";
  };

  return (
    <section className="flex flex-col items-center justify-around min-h-full sm:gap-16 gap-2 w-full max-w-md mx-auto select-none">
      <div className="flex items-center justify-center sm:gap-8 gap-2 sm:mb-20 mb-10 w-full">
        {categories.map((category, index) => (
          <div
            onClick={() => {
              setGameIndex(index);
            }}
            key={category.label}
            className={`flex flex-col items-center cursor-pointer transition-all duration-300
              ${
                categories[categoryIndex].label === category.label
                  ? "scale-125"
                  : "opacity-50 scale-75"
              }`}
          >
            <IconWrapper
              icon={category.icon}
              showLabel={false}
              label={category.label}
              bgColor={
                categories[categoryIndex].label === category.label
                  ? category.bgColor
                  : "bg-gray-300"
              }
            />
            {categories[categoryIndex].label === category.label && (
              <span className="mt-2 font-medium uppercase text-sm">
                {category.label}
              </span>
            )}
          </div>
        ))}
      </div>

      <div
        className={`relative ${getGameDivColor()} w-full p-6 rounded-lg select-none hover:scale-105`}
        onClick={() => {
          handleGameClick();
        }}
      >
        <p className="text-neutral-800 dark:text-neutral-200 text-lg pr-8">
          {randomTest.description}
        </p>
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-800 dark:text-neutral-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </section>
  );
};

export default SinglePlayerPage;
