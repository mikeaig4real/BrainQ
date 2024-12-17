"use client";

import React, { useState, useEffect } from "react";
import IconWrapper from "./IconWrapper";
import { motion } from "motion/react";
import { PiHeadCircuitDuotone } from "react-icons/pi";

const IconRotationAnimation: React.FC<{
  icons: Array<{
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    bgColor: string;
  }>;
}> = ({ icons }) => {
  const [radius, setRadius] = useState<number>(100); // Default radius
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const updateRadiusAndPositions = () => {
      const newRadius = Math.min((window.innerWidth || 500) * 0.3, 100);
      setRadius(newRadius);

      // Calculate positions on the client
      const newPositions = icons.map((_, index) => {
        const angle = (360 / icons.length) * index;
        const x =
          Math.round(newRadius * Math.cos((angle * Math.PI) / 180) * 100) / 100;
        const y =
          Math.round(newRadius * Math.sin((angle * Math.PI) / 180) * 100) / 100;
        return { x, y };
      });

      setPositions(newPositions);
    };

    updateRadiusAndPositions(); // Set initial values
    window.addEventListener("resize", updateRadiusAndPositions); // Update values on resize

    return () => {
      window.removeEventListener("resize", updateRadiusAndPositions); // Cleanup
    };
  }, [icons]);

  return (
    <div className="relative w-[90vw] h-[90vw] max-w-[300px] max-h-[300px] flex items-center justify-center">
      {/* Central Point (Sun) */}
      <IconWrapper
        icon={PiHeadCircuitDuotone}
        showLabel={false}
        sizing={"w-14 h-14"}
      />

      {/* Rotating Orbit */}
      <motion.div
        className="absolute w-full h-full flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
      >
        {positions.map((position, index) => (
          <div
            key={index}
            className="absolute scale-[0.7] sm:scale-[0.85] md:scale-100"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
            }}
          >
            <IconWrapper
              icon={icons[index].icon}
              showLabel={false}
              label={icons[index].label}
              bgColor={icons[index].bgColor}
              sizing={"w-14 h-14"}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default IconRotationAnimation;
