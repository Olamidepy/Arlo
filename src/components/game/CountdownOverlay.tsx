"use client";

import React, { useEffect, useState } from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { sound } from "../../lib/audio/sound";

export const CountdownOverlay: React.FC = () => {
  const { status, currentRound, startGameplay } = useGameStore();
  const [count, setCount] = useState<number | string>(3);

  useEffect(() => {
    if (status !== "COUNTDOWN") return;

    setCount(3);
    sound.playCountdownTick(false);

    const t1 = setTimeout(() => {
      setCount(2);
      sound.playCountdownTick(false);
    }, 700);

    const t2 = setTimeout(() => {
      setCount(1);
      sound.playCountdownTick(false);
    }, 1400);

    const t3 = setTimeout(() => {
      setCount("GO!");
      sound.playCountdownTick(true);
    }, 2100);

    const t4 = setTimeout(() => {
      startGameplay();
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [status, startGameplay]);

  if (status !== "COUNTDOWN") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md select-none">
      <div className="flex flex-col items-center gap-4 animate-bounce text-center">
        <span className="text-sm uppercase tracking-widest text-[#FF6B00] font-bold font-mono">
          ROUND {currentRound} OF 3
        </span>
        <span className="text-8xl sm:text-9xl font-extrabold font-mono text-white tracking-tighter drop-shadow-[0_0_50px_rgba(255,107,0,0.6)]">
          {count}
        </span>
      </div>
    </div>
  );
};
