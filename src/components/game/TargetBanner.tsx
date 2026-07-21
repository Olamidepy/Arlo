"use client";

import React, { useEffect, useState } from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { Pause, Target, Clock, AlertTriangle, Heart, Zap } from "lucide-react";

export const TargetBanner: React.FC = () => {
  const {
    currentTargetNumber,
    playerScore,
    opponentScore,
    maxNumber,
    wrongTaps,
    playerHp,
    gameMode,
    aiDifficulty,
    status,
    startTime,
    pauseGame,
  } = useGameStore();

  const [liveElapsed, setLiveElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "PLAYING" && startTime > 0) {
      interval = setInterval(() => {
        setLiveElapsed(Math.max(0, Date.now() - startTime));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [status, startTime]);

  const formatSeconds = (ms: number) => {
    return (ms / 1000).toFixed(1) + "s";
  };

  const playerPercent = Math.min(100, Math.round((playerScore / maxNumber) * 100));
  const opponentPercent = Math.min(100, Math.round((opponentScore / maxNumber) * 100));
  const totalTaps = playerScore + wrongTaps;
  const accuracy = totalTaps > 0 ? Math.round((playerScore / totalTaps) * 100) : 100;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 p-4 bg-[#111111] border border-white/10 rounded-2xl shadow-2xl">
      {/* Top Bar: Target Banner, Timer & Pause */}
      <div className="flex items-center justify-between gap-4">
        {/* Current Target Number Box */}
        <div className="flex items-center gap-3 bg-[#181818] border border-[#FF6B00]/40 px-5 py-2.5 rounded-xl shadow-inner">
          <Target className="w-5 h-5 text-[#FF6B00] animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-[#9E9E9E] font-medium">Find:</span>
          <span className="text-3xl font-bold font-mono text-[#FF6B00] min-w-[50px]">
            {currentTargetNumber}
          </span>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-2 bg-[#181818] border border-white/5 px-4 py-2.5 rounded-xl">
          <Clock className="w-4 h-4 text-[#9E9E9E]" />
          <span className="text-xl font-semibold font-mono text-white">
            {formatSeconds(liveElapsed)}
          </span>
        </div>

        {/* Mode Specific Extra Badges */}
        {gameMode === "survival" && (
          <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-800/40 px-3 py-2 rounded-xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < playerHp ? "text-red-500 fill-red-500" : "text-neutral-700"}`}
              />
            ))}
          </div>
        )}

        {/* Accuracy & Miss Stats */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-[#9E9E9E]">
          <div>
            Acc: <span className="text-white font-bold">{accuracy}%</span>
          </div>
          {wrongTaps > 0 && (
            <div className="flex items-center gap-1 text-red-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{wrongTaps} wrong</span>
            </div>
          )}
        </div>

        {/* Pause Button */}
        <button
          onClick={pauseGame}
          className="p-2.5 rounded-xl bg-[#181818] border border-white/10 hover:bg-[#222222] text-[#9E9E9E] hover:text-white transition-colors"
          title="Pause Match"
        >
          <Pause className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bars (Player vs Opponent in 1v1 / AI) */}
      <div className="flex flex-col gap-1.5">
        {/* You */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            YOU
          </span>
          <span className="text-[#9E9E9E]">
            {playerScore} / {maxNumber} ({playerPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#181818] rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-[#FF6B00] transition-all duration-200 ease-out"
            style={{ width: `${playerPercent}%` }}
          />
        </div>

        {/* Opponent Progress (AI / Online) */}
        {(gameMode === "ai" || gameMode === "online" || gameMode === "tournament") && (
          <>
            <div className="flex items-center justify-between text-xs font-mono mt-1">
              <span className="text-[#9E9E9E] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                {gameMode === "ai" ? `OPPONENT (${aiDifficulty.toUpperCase()})` : "OPPONENT"}
              </span>
              <span className="text-[#9E9E9E]">
                {opponentScore} / {maxNumber} ({opponentPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#181818] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-blue-500 transition-all duration-200 ease-out"
                style={{ width: `${opponentPercent}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
