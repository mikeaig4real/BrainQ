"use client";

import React from "react";
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
  // Make radius responsive based on viewport width
  const radius = Math.min((window?.innerWidth || 500) * 0.30, 100); 

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
        {icons.map((IconComponent, index) => {
          // Calculate position for each icon
          const angle = (360 / icons.length) * index;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <div
              key={index}
              className="absolute scale-[0.7] sm:scale-[0.85] md:scale-100"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <IconWrapper
                icon={IconComponent.icon}
                showLabel={false}
                label={IconComponent.label}
                bgColor={IconComponent.bgColor}
                sizing={"w-14 h-14"}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default IconRotationAnimation;
