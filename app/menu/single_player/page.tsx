"use client";

import React, { useState, useEffect } from "react";
import { categories } from "@/utils/constants";
import { useGame } from "@/contexts/GameContext";
import { useRouter } from "next/navigation";
import { IconType } from "react-icons";
import IconWrapper from "@/components/IconWrapper";

const SinglePlayerPage = (): JSX.Element => {
  const { categoryIndex } = useGame();
  console.log({
    caategoryIndex: categoryIndex,
  });
  const [randomTest, setRandomTest] = useState(
    categories[categoryIndex].tests[0]
  );
  const router = useRouter();

  useEffect(() => {
    const testIndex = 1; // Math.floor(Math.random() * categories[categoryIndex].tests.length)
    const test = categories[categoryIndex].tests[testIndex];
    setRandomTest(test);
  }, [categories[categoryIndex]]);

  return (
    <section className="flex flex-col items-center justify-around min-h-full gap-16 w-full max-w-md mx-auto">
      <div className="flex items-center justify-center sm:gap-8 gap-2 mb-20 w-full">
        {categories.map((category) => (
          <div
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
        className={`relative ${categories[categoryIndex].bgColor} w-full p-6 rounded-lg cursor-pointer`}
        onClick={() =>
          router.push(
            `/categories/${categories[categoryIndex].label}/${randomTest.label}`
          )
        }
      >
        <p className="text-white text-lg pr-8">{randomTest.description}</p>
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white"
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