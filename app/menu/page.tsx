import React from "react";
import Link from "next/link";
import {
  FaUser,
  FaUsers,
  FaDumbbell,
  FaChartBar,
  FaQuestionCircle,
} from "react-icons/fa";

const menuLinks = [
  {
    name: "Single Player",
    link: "/single_player",
    icon: FaUser,
  },
  {
    name: "Multi-Player",
    link: "/multi_player",
    icon: FaUsers,
  },
  {
    name: "Train",
    link: "/train",
    icon: FaDumbbell,
  },
  {
    name: "My Stats",
    link: "/stats",
    icon: FaChartBar,
  },
  {
    name: "Help",
    link: "/help",
    icon: FaQuestionCircle,
  },
];

const MenuPage = () => {
  return (
    <section className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {menuLinks.map((item, index) => (
        <Link
          key={index}
          href={`/menu${item.link}`}
          className="w-full relative group"
        >
          <div
            className="
            flex items-center bg-white hover:bg-gray-50 
            border-2 border-gray-200 rounded-xl py-2 px-4
            transition-all duration-300 hover:shadow-md
            relative"
          >
            <div
              className="absolute -left-3 p-2 bg-black rounded-full
                          text-white transform group-hover:-translate-x-1
                          transition-transform duration-300"
            >
              <item.icon size={40} />
            </div>
            <span className="ml-8 text-lg font-medium text-gray-700">
              {item.name}
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default MenuPage;
