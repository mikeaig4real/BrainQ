"use client";
import React, { useState, useEffect } from "react";
import { PiHeadCircuitDuotone } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { tipsData } from "@/utils/tipsData";

const FloatingTip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const pathName = usePathname();
  const tips = tipsData?.[pathName] || [];

  const incrementTipIndex = () =>
  {
    const newTipIndex = (tipIndex + 1) % tips.length;
    setTipIndex(newTipIndex);
  };

  const toggleTip = () => {
    isVisible && incrementTipIndex();
    setIsVisible(!isVisible);
  };

  useEffect( () =>
  {
    const randomIndex = Math.floor( Math.random() * tips.length );
    setTipIndex( randomIndex );
    setIsVisible( true );
  }, [pathName]);

  return (
    <div className="fixed bottom-5 right-5 flex items-center z-50">
      <div className="relative">
        <AnimatePresence>
          {isVisible && !!tips?.length && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 p-3 bg-white rounded-lg shadow-lg"
              style={{ width: "200px", height: "auto" }}
            >
              <button
                onClick={toggleTip}
                className="absolute right-1 top-1 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-[-8px] right-0 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white border-r-[8px] border-r-transparent" />
              </div>
              <p className="text-sm text-gray-700 whitespace-normal pr-4">
                {tips[tipIndex]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleTip}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        >
          <PiHeadCircuitDuotone className="text-3xl text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default FloatingTip;
