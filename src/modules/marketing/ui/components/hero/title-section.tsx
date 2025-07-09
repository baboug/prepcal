"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const text = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export function TitleSection() {
  return (
    <div className="mb-8 flex flex-col items-center space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <div className="max-w-2xl">
          <motion.h1
            animate="show"
            className="text-center text-4xl leading-tighter tracking-tighter sm:text-5xl lg:text-6xl"
            initial="hidden"
            variants={container}
          >
            {["Automated", "meal", "planning", "for", "lifters"].map((word) => (
              <motion.span className="mr-[0.2em] inline-block" key={word} variants={text}>
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p className="mt-4 text-center text-muted-foreground" variants={text}>
            The smartest way to plan your meals, optimize your training, and achieve lasting results. Experience the
            power of AI designed to personalize every aspect of your journey.
          </motion.p>
        </div>
      </div>
      <Link href="/auth/sign-up">
        <Button size="lg">Start meal planning</Button>
      </Link>
    </div>
  );
}
