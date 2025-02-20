"use client";

import { useEffect, useState, useCallback } from "react";
import { categories } from "@/utils/constants";
import { useGame } from "@/contexts/GameContext";
import NavBarComponent from "@/components/Navbar";
import { motion } from "framer-motion";

interface GameWrapperProps {
  children: React.ReactNode;
}

const GameWrapper = ({ children }: GameWrapperProps): JSX.Element => {
  const { categoryIndex, endCategory, startCategory, duration, user, signOut } =
    useGame();
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isTimeout, setIsTimeout] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const getPropsForNav = () => {
    const avatar = {
      text: user?.signInDetails?.loginId,
    };
    const logOutBtn = {
      type: "button",
      onClick: () => {
        signOut();
      },
      label: "LogOut",
    };
    const backToMenu = {
      type: "link",
      href: "/menu",
      label: "Menu",
    };
    const gameCategories = {
      type: "link",
      href: "/menu/single_player",
      label: "Games",
    };
    return {
      avatar,
      showBrand: false,
      className: "w-auto absolute top-[-8vh] right-[-0.5vw]",
      navItems: [backToMenu, logOutBtn, gameCategories],
    };
  };

  const { bgColor } = categories[categoryIndex];

  // Handle timeout
  const handleTimeout = useCallback(() => {
    if (!isTimeout) {
      setIsTimeout(true);
    }
  }, [isTimeout, categoryIndex]);

  useEffect(() => {
    // Countdown logic before the game starts
    if (countdown > -1) {
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [countdown]);

  useEffect(() => {
    startCategory();
    // Timer logic for the game
    if (countdown <= -1) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [countdown]);

  useEffect(() => {
    if (timeLeft === 0 && !isTimeout) {
      handleTimeout();
      endCategory();
    }
  }, [timeLeft, handleTimeout, isTimeout]);

  return (
    <div className="relative flex items-center justify-center aspect-square w-[60vw] h-[70vh] min-w-72 rounded-[2rem] select-none">
      <NavBarComponent {...getPropsForNav()} showAvatar={true} />
      {/* Timer Display */}
      <div
        className={`absolute ${bgColor} top-0 left-0 w-10 h-10 lg:w-16 lg:h-16 text-base lg:text-2xl rounded-full flex items-center justify-center font-bold text-neutral-800 dark:text-neutral-200`}
      >
        {`${timeLeft}`}
      </div>

      {/* 3, 2, 1, Go! Animation */}
      {countdown > -1 && (
        <motion.div
          className="absolute flex items-center justify-center text-6xl font-bold text-neutral-800 dark:text-neutral-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {countdown === 0 ? "GO!" : countdown}
        </motion.div>
      )}

      {/* Game Content */}
      {countdown <= -1 && timeLeft > 0 && (
        <motion.div
          className="w-full max-w-4xl mx-auto rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}

      {/* End of Game Message */}
      {timeLeft === 0 && (
        <motion.div
          className="absolute flex flex-col items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-neutral-800 dark:text-neutral-200 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center">Test Completed!</p>
          <p className="text-center">Well Done!</p>
        </motion.div>
      )}
    </div>
  );
};

export default GameWrapper;
