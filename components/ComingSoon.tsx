"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaSnowflake, FaGift, FaStar } from "react-icons/fa";
import { TbChristmasTree as RiChristmasTreeFill } from "react-icons/tb";

const ComingSoon = () => {
  // Animation variants for the text
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for floating elements
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Snowflake animation variants
  const snowflakeVariants = {
    animate: (custom: number) => ({
      y: [0, 800],
      x: [0, custom],
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear",
        delay: custom * 0.2,
      },
    }),
  };

  return (
    <div className="relative w-[80vw] h-[80vh] flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Snowflakes */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          custom={Math.random() * 200 - 100}
          variants={snowflakeVariants}
          animate="animate"
          className="absolute top-0"
          style={{
            left: `${Math.random() * 100}%`,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <FaSnowflake className="text-neutral-800 dark:text-neutral-200/30 text-sm" />
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        className="text-center z-10"
        initial="hidden"
        animate="visible"
        variants={textVariants}
      >
        {/* Christmas Tree */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="text-green-500 text-6xl mb-6"
        >
          <RiChristmasTreeFill />
        </motion.div>

        {/* Coming Soon Text */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-neutral-800 dark:text-neutral-200 mb-4 tracking-wider"
          style={{ textShadow: "0 0 10px rgba(255,255,255,0.5)" }}
        >
          Coming Soon...
        </motion.h1>

        {/* Decorative Elements */}
        <div className="flex gap-6 mt-8">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="text-red-500 text-2xl"
          >
            <FaGift />
          </motion.div>
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="text-yellow-400 text-2xl"
          >
            <FaStar />
          </motion.div>
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="text-red-500 text-2xl"
          >
            <FaGift />
          </motion.div>
        </div>
      </motion.div>

      {/* Glowing Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default ComingSoon;
