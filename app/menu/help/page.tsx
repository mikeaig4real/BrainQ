"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { helpData } from "@/utils/helpData";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState(helpData[0].id);
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeTabData = helpData.find((tab: any) => tab.id === activeTab);

  const nextSlide = () => {
    if (activeTabData) {
      setCurrentSlide((prev) =>
        prev === activeTabData.contents.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevSlide = () => {
    if (activeTabData) {
      setCurrentSlide((prev) =>
        prev === 0 ? activeTabData.contents.length - 1 : prev - 1
      );
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-around w-full mx-auto select-none"
    >
      {/* Tabs */}
      <div className="tabs tabs-boxed justify-center mb-8">
        {helpData.map((tab: any) => (
          <motion.a
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`tab tab-lg ${activeTab === tab.id ? "tab-active" : ""}`}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentSlide(0);
            }}
          >
            {tab.tabTitle}
          </motion.a>
        ))}
      </div>

      {/* Carousel */}
      <div className="relative w-[80vw] mx-auto bg-black rounded-box shadow-lg px-8 py-4">
        <AnimatePresence mode="wait">
          {activeTabData && (
            <motion.div
              key={`${activeTab}-${currentSlide}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-4">
                {activeTabData.contents[currentSlide].title}
              </h2>
              <p className="text-md">
                {activeTabData.contents[currentSlide].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="btn btn-circle btn-ghost absolute left-[-2rem]"
            onClick={prevSlide}
          >
            <FiChevronLeft className="text-2xl" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="btn btn-circle btn-ghost absolute right-[-2rem]"
            onClick={nextSlide}
          >
            <FiChevronRight className="text-2xl" />
          </motion.button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {activeTabData?.contents.map((_: any, index: number) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? "bg-primary" : "bg-base-300"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default HelpPage;
