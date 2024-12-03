"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GiRat as FaRat } from "react-icons/gi";

const bgColor = "bg-purple-500";

const WhackAMole = () => {
  const [moles, setMoles] = useState(
    Array(9).fill({ isVisible: false, id: null })
  );
  const [score, setScore] = useState(0);

  useEffect(() => {
    const moleInterval = setInterval(() => {
      const newMoles = Array(9).fill({ isVisible: false, id: null });
      const randomIndex = Math.floor(Math.random() * 9);
      newMoles[randomIndex] = { isVisible: true, id: Date.now() };
      setMoles(newMoles);
    }, 1000);

    return () => clearInterval(moleInterval);
  }, []);

  const handleWhack = (index:number) => {
    if (moles[index].isVisible) {
      setScore((prev) => prev + 1);
      const newMoles = [...moles];
      newMoles[index].isVisible = false;
      setMoles(newMoles);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${bgColor}`}
    >
      <h1 className="text-white text-4xl font-bold mb-4">Whack-a-Rat!</h1>
      <p className="text-white text-2xl mb-8">Score: {score}</p>
      <div className="grid grid-cols-3 gap-4">
        {moles.map((mole, index) => (
          <div
            key={index}
            className="relative w-24 h-24 bg-purple-700 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => handleWhack(index)}
          >
            {mole.isVisible && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute"
              >
                <FaRat size={40} color="white" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhackAMole;
