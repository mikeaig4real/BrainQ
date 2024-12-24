import React from "react";
import { TbManualGearboxFilled } from "react-icons/tb";

interface IconProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label?: string;
  showLabel?: boolean;
  bgColor?: string;
  sizing?: string;
}

const IconWrapper: React.FC<IconProps> = ({
  icon: IconComponent,
  label = "",
  showLabel = true,
  bgColor = "",
  sizing = "sm:w-14 sm:h-14 w-8 h-8",
}) => {
  return (
    <div
      className={`${sizing} rounded-full ${bgColor} flex items-center justify-center relative cursor-pointer p-2`}
    >
      {showLabel && (
        <span className="text-xl text-neutral-800 dark:text-neutral-200 absolute bottom-[-1.5rem] font-bold">
          {label}
        </span>
      )}
      <IconComponent className="w-full h-full text-neutral-800 dark:text-neutral-200" />
    </div>
  );
};

export default IconWrapper;
