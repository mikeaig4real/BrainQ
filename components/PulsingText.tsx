"use client";
import React from "react";
import { motion } from "framer-motion";


// create a reuseable component that can have a pulsing effect using framer
const PulsingText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <motion.div
      className={`text-2xl font-bold text-slate-100 text-center tracking-widest select-none`}
      animate={{
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {text}
    </motion.div>
  );
};

// export the component
export default PulsingText;
