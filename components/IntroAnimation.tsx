"use client";

import React from "react";
import { useAnimate, usePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import IconRotationAnimation from "@/components/IconRotationAnimation";
import PulsingText from "@/components/PulsingText";
import LogoText from "@/components/LogoText";

import { categories } from "@/utils/constants";



const IntroAnimationComponent = () => {
  const router = useRouter();
  const handleClick = () => {
    console.log("clicked");
    router.push("/menu");
  };

  return (
    <section
      className="min-h-screen w-full flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-8">
        {/* Logo section - larger on bigger screens, centered on mobile */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-start mr-5">
          <LogoText text="Brain-Q" />
        </div>

        {/* Right section with icons and text */}
        <div className="w-full md:w-2/3 flex flex-col items-center gap-6">
          <div className="w-full flex justify-center">
            <IconRotationAnimation icons={categories} />
          </div>
          <div className="w-full flex justify-center">
            <PulsingText text={"Click the screen"} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroAnimationComponent;
