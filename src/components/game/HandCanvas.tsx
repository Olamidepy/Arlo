"use client";

import React, { useMemo, useState } from "react";
import { generateHandLayout, PlacedNumber } from "../../lib/game-engine/placement";

interface HandCanvasProps {
  seed: string;
  maxNumber: number;
  currentTargetNumber: number;
  onTapNumber: (num: number) => void;
  completedNumbers?: Set<number>;
  isMemoryHidden?: boolean;
  isKidsMode?: boolean;
}

export const HandCanvas: React.FC<HandCanvasProps> = ({
  seed,
  maxNumber,
  currentTargetNumber,
  onTapNumber,
  completedNumbers = new Set(),
  isMemoryHidden = false,
  isKidsMode = false,
}) => {
  const [shakingId, setShakingId] = useState<number | null>(null);
  const [justTappedId, setJustTappedId] = useState<number | null>(null);

  // Generate procedural layout deterministically from seed
  const layout = useMemo(() => {
    return generateHandLayout(seed, maxNumber);
  }, [seed, maxNumber]);

  const handleTap = (num: PlacedNumber) => {
    if (completedNumbers.has(num.value)) return;

    if (num.value === currentTargetNumber) {
      setJustTappedId(num.value);
      setTimeout(() => setJustTappedId(null), 250);
      onTapNumber(num.value);
    } else {
      setShakingId(num.value);
      setTimeout(() => setShakingId(null), 350);
      onTapNumber(num.value);
    }
  };

  const getNumberColor = (num: PlacedNumber) => {
    if (completedNumbers.has(num.value) || num.value < currentTargetNumber) {
      // Completed / Found numbers are dimmed out
      return "#262626";
    }
    if (isKidsMode) {
      const colors = ["#FF5722", "#4CAF50", "#2196F3", "#9C27B0", "#FFEB3B", "#FF9800"];
      return colors[num.value % colors.length];
    }
    // IMPORTANT: ALL un-tapped numbers look identical (#E5E5E5) so the target is NOT revealed!
    return "#E5E5E5";
  };

  return (
    <div className="relative w-full max-w-[620px] aspect-square mx-auto flex items-center justify-center p-2 select-none touch-manipulation">
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full drop-shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-visible"
      >
        <defs>
          <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#141414" />
            <stop offset="100%" stopColor="#0B0B0B" />
          </linearGradient>
          <filter id="handGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#FF6B00" floodOpacity="0.05" />
          </filter>
        </defs>

        {/* Outer Hand Contour Vector Silhouette */}
        <path
          d="
            M 380 870
            C 340 850 310 800 300 740
            C 290 690 260 670 210 650
            C 160 630 140 570 160 520
            C 180 470 230 460 280 500
            C 310 525 330 500 320 440
            C 305 350 290 220 310 130
            C 325 60 380 60 395 130
            L 405 400
            C 415 370 425 210 440 90
            C 455 20 520 20 535 90
            L 545 390
            C 555 360 575 230 595 130
            C 610 60 675 70 685 140
            L 695 420
            C 705 400 725 310 745 230
            C 760 170 815 180 820 240
            C 830 330 810 480 800 560
            C 790 640 780 730 730 800
            C 680 870 610 890 500 890
            C 440 890 400 885 380 870
            Z
          "
          fill="url(#handGradient)"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="6"
          strokeLinejoin="round"
          filter="url(#handGlow)"
        />

        {/* Detail Lines */}
        <path
          d="M 330 530 C 420 580 540 560 660 500"
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth="3"
          strokeDasharray="6 6"
        />
        <path
          d="M 360 680 C 460 700 580 670 710 600"
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth="3"
          strokeDasharray="6 6"
        />

        {/* Render Numbers Without Target Hint Rings */}
        {layout.map((item) => {
          const isDone = completedNumbers.has(item.value);
          const isShaking = shakingId === item.value;
          const isJustTapped = justTappedId === item.value;

          if (isMemoryHidden && !isDone) {
            return null; // Hide in Memory Mode after 5s
          }

          return (
            <g
              key={item.id}
              transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation})`}
              onClick={() => handleTap(item)}
              className="cursor-pointer transition-transform duration-100 ease-out active:scale-95 group"
            >
              {/* Hit Area */}
              <circle
                r={item.fontSize * 1.3}
                fill="transparent"
                className="group-hover:fill-white/5 transition-colors"
              />

              {/* Number Text - NO HINT RINGS / NO SPECIAL HIGHLIGHT COLOR */}
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="central"
                fill={isDone ? "#262626" : isJustTapped ? "#FF6B00" : getNumberColor(item)}
                fontSize={item.fontSize}
                fontWeight={isDone ? "400" : "600"}
                fontFamily="var(--font-jetbrains-mono), monospace"
                className={`
                  pointer-events-none select-none transition-all duration-150
                  ${isShaking ? "fill-red-500 animate-shake" : ""}
                  ${isJustTapped ? "scale-125 font-bold" : ""}
                  ${isDone ? "opacity-30" : "opacity-95"}
                `}
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
