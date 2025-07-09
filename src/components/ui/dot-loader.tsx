"use client";

import { type ComponentProps, useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const frameTypes = {
  importing: [
    [0, 2, 4, 6, 20, 34, 48, 46, 44, 42, 28, 14, 8, 22, 36, 38, 40, 26, 12, 10, 16, 30, 24, 18, 32],
    [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47],
    [8, 22, 36, 38, 40, 26, 12, 10, 16, 30, 24, 18, 32],
    [9, 11, 15, 17, 19, 23, 25, 29, 31, 33, 37, 39],
    [16, 30, 24, 18, 32],
    [17, 23, 31, 25],
    [24],
    [17, 23, 31, 25],
    [16, 30, 24, 18, 32],
    [9, 11, 15, 17, 19, 23, 25, 29, 31, 33, 37, 39],
    [8, 22, 36, 38, 40, 26, 12, 10, 16, 30, 24, 18, 32],
    [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47],
    [0, 2, 4, 6, 20, 34, 48, 46, 44, 42, 28, 14, 8, 22, 36, 38, 40, 26, 12, 10, 16, 30, 24, 18, 32],
  ],
  syncing: [
    [45, 38, 31, 24, 17, 23, 25],
    [38, 31, 24, 17, 10, 16, 18],
    [31, 24, 17, 10, 3, 9, 11],
    [24, 17, 10, 3, 2, 4],
    [17, 10, 3],
    [10, 3],
    [3],
    [],
    [45],
    [45, 38, 44, 46],
    [45, 38, 31, 37, 39],
    [45, 38, 31, 24, 30, 32],
  ],

  searching: [
    [9, 16, 17, 15, 23],
    [10, 17, 18, 16, 24],
    [11, 18, 19, 17, 25],
    [18, 25, 26, 24, 32],
    [25, 32, 33, 31, 39],
    [32, 39, 40, 38, 46],
    [31, 38, 39, 37, 45],
    [30, 37, 38, 36, 44],
    [23, 30, 31, 29, 37],
    [31, 29, 37, 22, 24, 23, 38, 36],
    [16, 23, 24, 22, 30],
  ],

  heartbit: [
    [],
    [3],
    [10, 2, 4, 3],
    [17, 9, 1, 11, 5, 10, 4, 3, 2],
    [24, 16, 8, 1, 3, 5, 18, 12, 17, 11, 4, 10, 9, 2],
    [31, 23, 15, 8, 10, 2, 4, 12, 25, 19, 24, 18, 11, 17, 16, 9],
    [38, 30, 22, 15, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16],
    [38, 30, 22, 15, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16],
    [38, 30, 22, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16, 45, 37, 29, 21, 14, 8, 15, 12, 20, 27, 33, 39],
    [38, 30, 22, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16, 45, 37, 29, 21, 14, 8, 15, 12, 20, 27, 33, 39],
    [38, 30, 22, 15, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16],
    [38, 30, 22, 15, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16],
    [38, 30, 22, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16, 45, 37, 29, 21, 14, 8, 15, 12, 20, 27, 33, 39],
    [38, 30, 22, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16, 45, 37, 29, 21, 14, 8, 15, 12, 20, 27, 33, 39],
    [38, 30, 22, 15, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16],
    [38, 30, 22, 15, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16],
    [38, 30, 22, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16, 45, 37, 29, 21, 14, 8, 15, 12, 20, 27, 33, 39],
    [38, 30, 22, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16, 45, 37, 29, 21, 14, 8, 15, 12, 20, 27, 33, 39],
    [39, 33, 37, 29, 17, 38, 30, 22, 15, 16, 23, 24, 31, 32, 25, 18, 26, 19],
    [17, 30, 16, 23, 24, 31, 32, 25, 18],
    [24],
  ],

  shadcn: [
    [],
    [7, 1],
    [15, 9, 7, 1],
    [23, 17, 21, 15, 9, 3],
    [31, 25, 29, 23, 17, 11],
    [39, 33, 37, 31, 25, 19],
    [47, 41, 45, 39, 33, 27],
    [47, 41, 45, 39, 33, 27],
    [47, 41, 45, 39, 33, 27],
    [47, 41, 45, 39, 33, 27],
  ],
};

export type DotLoaderType = "importing" | "syncing" | "searching" | "heartbit" | "shadcn";

type DotLoaderProps = {
  type: DotLoaderType;
  dotClassName?: string;
  isPlaying?: boolean;
  duration?: number;
  repeatCount?: number;
  onComplete?: () => void;
} & ComponentProps<"div">;

export const DotLoader = ({
  type = "syncing",
  isPlaying = true,
  duration = 100,
  dotClassName,
  className,
  repeatCount = -1,
  onComplete,
  ...props
}: DotLoaderProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const repeats = useRef(0);
  const interval = useRef<NodeJS.Timeout>(null);

  const frames = frameTypes[type];

  const applyFrameToDots = useCallback(
    (dots: HTMLDivElement[], frameIndex: number) => {
      const frame = frames[frameIndex];
      if (!frame) {
        return;
      }

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", frame.includes(index));
      });
    },
    [frames]
  );

  useEffect(() => {
    currentIndex.current = 0;
    repeats.current = 0;
  }, []);

  useEffect(() => {
    if (isPlaying) {
      if (currentIndex.current >= frames.length) {
        currentIndex.current = 0;
      }
      const dotElements = gridRef.current?.children;
      if (!dotElements) {
        return;
      }
      const dots = Array.from(dotElements) as HTMLDivElement[];
      interval.current = setInterval(() => {
        applyFrameToDots(dots, currentIndex.current);
        if (currentIndex.current + 1 >= frames.length) {
          if (repeatCount !== -1 && repeats.current + 1 >= repeatCount) {
            // biome-ignore lint/style/noNonNullAssertion: safe
            clearInterval(interval.current!);
            onComplete?.();
          }
          repeats.current++;
        }
        currentIndex.current = (currentIndex.current + 1) % frames.length;
      }, duration);
    } else if (interval.current) {
      clearInterval(interval.current);
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [frames, isPlaying, applyFrameToDots, duration, repeatCount, onComplete]);

  return (
    <div {...props} className={cn("grid w-fit grid-cols-7 gap-0.5", className)} ref={gridRef}>
      {Array.from({ length: 49 }).map((_, i) => (
        <div className={cn("size-1.25 rounded-sm", dotClassName)} key={i} />
      ))}
    </div>
  );
};
