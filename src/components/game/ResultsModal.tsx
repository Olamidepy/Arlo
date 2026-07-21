"use client";

import React from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { Trophy, RefreshCw, Home, Share2, Zap, Target, Clock, Coins } from "lucide-react";

export const ResultsModal: React.FC = () => {
  const {
    winner,
    elapsedMs,
    playerScore,
    wrongTaps,
    tapHistory,
    stxEarned,
    gameMode,
    initGame,
    setActiveScreen,
  } = useGameStore();

  const isWin = winner === "player";
  const totalTaps = playerScore + wrongTaps;
  const accuracy = totalTaps > 0 ? Math.round((playerScore / totalTaps) * 100) : 100;

  const avgReaction =
    tapHistory.length > 0
      ? Math.round(tapHistory.reduce((acc, t) => acc + t.ms, 0) / tapHistory.length)
      : 0;

  const formatSeconds = (ms: number) => (ms / 1000).toFixed(2) + "s";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Arlo — The fastest eyes win",
        text: `I completed ${playerScore} numbers in ${formatSeconds(elapsedMs)} with ${accuracy}% accuracy on Arlo! Can you beat me?`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `Arlo Game Score: ${formatSeconds(elapsedMs)} (${accuracy}% Acc, ${avgReaction}ms reaction). Play now!`
      );
      alert("Results copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center gap-3">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center border ${
              isWin
                ? "bg-[#FF6B00]/10 border-[#FF6B00] text-[#FF6B00]"
                : "bg-red-950/40 border-red-800/40 text-red-500"
            }`}
          >
            {isWin ? <Trophy className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-white">
              {isWin ? "VICTORY!" : "GAME OVER"}
            </h2>
            <p className="text-sm text-[#9E9E9E] mt-1">
              {isWin
                ? "Blazing fast reaction speed!"
                : "Good attempt! Keep practicing your eyes."}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Time */}
          <div className="bg-[#181818] border border-white/5 p-3.5 rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-[#9E9E9E]">
              <Clock className="w-3.5 h-3.5 text-[#FF6B00]" /> Total Time
            </div>
            <span className="text-xl font-bold font-mono text-white">
              {formatSeconds(elapsedMs)}
            </span>
          </div>

          {/* Accuracy */}
          <div className="bg-[#181818] border border-white/5 p-3.5 rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-[#9E9E9E]">
              <Target className="w-3.5 h-3.5 text-emerald-400" /> Accuracy
            </div>
            <span className="text-xl font-bold font-mono text-white">{accuracy}%</span>
          </div>

          {/* Average Reaction */}
          <div className="bg-[#181818] border border-white/5 p-3.5 rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-[#9E9E9E]">
              <Zap className="w-3.5 h-3.5 text-blue-400" /> Avg Reaction
            </div>
            <span className="text-xl font-bold font-mono text-white">{avgReaction}ms</span>
          </div>

          {/* STX Earned */}
          <div className="bg-[#181818] border border-white/5 p-3.5 rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-[#9E9E9E]">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> STX Earned
            </div>
            <span className="text-xl font-bold font-mono text-[#FF6B00]">
              +{stxEarned > 0 ? stxEarned : "0.00"} STX
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              initGame(gameMode);
              setActiveScreen("GAME");
            }}
            className="btn-primary w-full text-base font-semibold"
          >
            <RefreshCw className="w-4 h-4" /> Play Again
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleShare} className="btn-secondary text-sm">
              <Share2 className="w-4 h-4 text-[#9E9E9E]" /> Share
            </button>
            <button
              onClick={() => setActiveScreen("HOME")}
              className="btn-secondary text-sm"
            >
              <Home className="w-4 h-4 text-[#9E9E9E]" /> Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
