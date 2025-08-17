"use client";

import { motion } from "motion/react";

import { FeaturesCard } from "./features-card";
import { MacrosCard } from "./macros-card";
import { MealPrepCard } from "./meal-prep-card";
import { Navbar } from "./navbar";
import { TitleSection } from "./title-section";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <motion.header animate="show" className="container mx-auto p-4" initial="hidden" variants={container}>
      <Navbar />
      <div className="flex flex-col gap-4 pt-28 lg:flex-row">
        <motion.div className="flex-1" variants={item}>
          <TitleSection />
          <div className="grid gap-4 lg:grid-cols-3">
            <motion.div className="flex-1" variants={item}>
              <FeaturesCard />
            </motion.div>
            <motion.div className="flex-1" variants={item}>
              <MealPrepCard />
            </motion.div>
            <motion.div className="flex-1" variants={item}>
              <MacrosCard />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
