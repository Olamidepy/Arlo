"use client";

import React, { useEffect } from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { sound } from "../../lib/audio/sound";
import { Pause, Target, Clock, AlertTriangle, Heart, Zap, Volume2, VolumeX, Flame } from "lucide-react";

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
    currentRound,
    maxRounds,
    playerRoundWins,
    opponentRoundWins,
    roundTimeLeft,
    tickRoundTimer,
    pauseGame,
    soundEnabled,
    toggleSound,
  } = useGameStore();

  // 60-Second Countdown Tick Interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "PLAYING") {
      interval = setInterval(() => {
        tickRoundTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, tickRoundTimer]);

  const playerPercent = Math.min(100, Math.round((playerScore / maxNumber) * 100));
  const opponentPercent = Math.min(100, Math.round((opponentScore / maxNumber) * 100));
  const totalTaps = playerScore + wrongTaps;
  const accuracy = totalTaps > 0 ? Math.round((playerScore / totalTaps) * 100) : 100;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 p-4 bg-[#111111] border border-white/10 rounded-2xl shadow-2xl">
      {/* Round & Game Mode Subheader Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="bg-[#FF6B00]/15 border border-[#FF6B00]/40 text-[#FF6B00] px-2.5 py-0.5 rounded-md font-bold uppercase">
            ROUND {currentRound} / {maxRounds}
          </span>
          <span className="text-white font-semibold flex items-center gap-1">
            Score: <span className="text-[#FF6B00]">{playerRoundWins}</span> - <span className="text-blue-400">{opponentRoundWins}</span>
          </span>
        </div>

        {/* Audio Toggle & Pause */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-[#181818] border border-white/10 hover:bg-[#222222] text-[#9E9E9E] hover:text-white transition-colors"
            title={soundEnabled ? "Mute Sound" : "Enable Sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FF6B00]" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>
          <button
            onClick={pauseGame}
            className="p-1.5 rounded-lg bg-[#181818] border border-white/10 hover:bg-[#222222] text-[#9E9E9E] hover:text-white transition-colors"
            title="Pause Match"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main HUD Row: Target Box, 60s Countdown Timer & Stats */}
      <div className="flex items-center justify-between gap-4">
        {/* Current Target Number Box */}
        <div className="flex items-center gap-3 bg-[#181818] border border-[#FF6B00]/40 px-4 py-2 rounded-xl shadow-inner">
          <Target className="w-5 h-5 text-[#FF6B00] animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-[#9E9E9E] font-medium">Find:</span>
          <span className="text-3xl font-bold font-mono text-[#FF6B00] min-w-[45px]">
            {currentTargetNumber}
          </span>
        </div>

        {/* 60s Round Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
            roundTimeLeft <= 10
              ? "bg-red-950/40 border-red-500 text-red-400 animate-pulse"
              : "bg-[#181818] border-white/10 text-white"
          }`}
        >
          <Clock className={`w-4 h-4 ${roundTimeLeft <= 10 ? "text-red-400" : "text-[#9E9E9E]"}`} />
          <span className="text-2xl font-bold font-mono">
            {roundTimeLeft}s
          </span>
        </div>

        {/* Mode Specific HP indicator */}
        {gameMode === "survival" && (
          <div className="flex items-center gap-1 bg-red-950/40 border border-red-800/40 px-2.5 py-1.5 rounded-xl">
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
      </div>

      {/* Progress Bars (Player vs Opponent) */}
      <div className="flex flex-col gap-1">
        {/* Player Progress */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            YOU ({playerScore}/{maxNumber})
          </span>
          <span className="text-[#9E9E9E]">{playerPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[#181818] rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-[#FF6B00] transition-all duration-200 ease-out"
            style={{ width: `${playerPercent}%` }}
          />
        </div>

        {/* Opponent Progress (AI / Online) */}
        {(gameMode === "ai" || gameMode === "online" || gameMode === "tournament") && (
          <>
            <div className="flex items-center justify-between text-xs font-mono mt-0.5">
              <span className="text-[#9E9E9E] flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-blue-400" />
                {gameMode === "ai" ? `OPPONENT (${aiDifficulty.toUpperCase()})` : "OPPONENT"}
              </span>
              <span className="text-[#9E9E9E]">{opponentPercent}%</span>
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
