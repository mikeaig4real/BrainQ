"use client";
import React,{ useState, useEffect, useRef } from "react";
import { PiHeadCircuitDuotone } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { tipsData } from "@/utils/tipsData";

const FloatingTip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentTip, setCurrentTip] = useState("");
  const [isRightCorner, setIsRightCorner] = useState(false);
  const pathName = usePathname();
  const tips = tipsData?.[pathName] || [];
  let tipInterval = useRef<NodeJS.Timeout>();

  console.log({
    pathName,
    tips,
  });

  const getFixedPosition = () => {
    const padding = 50; // Padding from edges
    const newIsRightCorner = Math.random() > 0.5;
    setIsRightCorner(newIsRightCorner);

    if (newIsRightCorner) {
      return {
        x: window.innerWidth - padding * 1.5,
        y: window.innerHeight - 100 - padding,
      };
    }

    return {
      x: padding,
      y: window.innerHeight - 100 - padding,
    };
  };

  const showTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    const randomTip = tips[randomIndex];
    setCurrentTip(randomTip);
    setPosition(getFixedPosition());
    setIsVisible(true);

    // Hide tip after 5 seconds
    setTimeout(() => {
      isVisible && setIsVisible(false);
    }, 5000);
  };

  const handleClose = () => {
    setIsVisible(false);
    clearInterval(tipInterval.current);
    tipInterval.current = setInterval(() => {
      showTip();
    }, 7000);
  };

  useEffect(() => {
    setIsVisible(false);
    clearInterval(tipInterval.current);
    // Show tip every 10 seconds
    tipInterval.current = setInterval(() => {
      showTip();
    }, 10000);

    return () => clearInterval(tipInterval.current);
  }, [pathName]);

  return (
    <AnimatePresence>
      {isVisible && !!tips?.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            zIndex: 1000,
            transform: `translateX(${isRightCorner ? "-100%" : "0"})`,
          }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            {isRightCorner ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute right-full mr-2 p-3 bg-white rounded-lg shadow-lg"
                  style={{ width: "200px", height: "auto" }}
                >
                  <button
                    onClick={handleClose}
                    className="absolute right-1 top-1 w-2 h-2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                  <div className="absolute right-[-8px] top-1/2 transform -translate-y-1/2">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[8px] border-l-white border-b-[8px] border-b-transparent" />
                  </div>
                  <p className="text-sm text-gray-700 whitespace-normal">
                    {currentTip}
                  </p>
                </motion.div>
                <PiHeadCircuitDuotone className="text-3xl text-white-500" />
              </>
            ) : (
              <>
                <PiHeadCircuitDuotone className="text-3xl text-white-500" />
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute left-full ml-2 p-3 bg-white rounded-lg shadow-lg"
                  style={{ width: "200px", height: "auto" }}
                >
                  <button
                    onClick={handleClose}
                    className="absolute right-1 top-1 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                  <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-[8px] border-b-transparent" />
                  </div>
                  <p className="text-sm text-gray-700 whitespace-normal">
                    {currentTip}
                  </p>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingTip;
