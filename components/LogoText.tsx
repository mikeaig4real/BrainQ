"use client";
import { motion } from "framer-motion";


const LogoText: React.FC<{ text: string, size?: string }> = ({ text, size = "sm:text-5xl md:text-5xl text-4xl" }) => {
  return (
    <motion.div
      className={`${size} logo-text font-extrabold`}
      initial={{ scale: 1 }}
      animate={{
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      {text}
    </motion.div>
  );
};

export default LogoText;
