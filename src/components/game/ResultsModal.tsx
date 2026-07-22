"use client";

import React from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { Trophy, RefreshCw, Home, Share2, Zap, Target, Clock, Coins, CheckCircle2 } from "lucide-react";

export const ResultsModal: React.FC = () => {
  const {
    winner,
    elapsedMs,
    playerScore,
    wrongTaps,
    tapHistory,
    stxEarned,
    gameMode,
    playerRoundWins,
    opponentRoundWins,
    roundScores,
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

  const handleShare = () => {
    const text = `I won a 3-Round Arlo Match (${playerRoundWins}-${opponentRoundWins}) and earned +${stxEarned} STX! Can your eyes beat mine?`;
    if (navigator.share) {
      navigator.share({
        title: "Arlo — The fastest eyes win",
        text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center gap-3">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center border ${
              isWin
                ? "bg-[#FF6B00]/15 border-[#FF6B00] text-[#FF6B00] shadow-[0_0_30px_rgba(255,107,0,0.5)]"
                : "bg-red-950/40 border-red-800/40 text-red-500"
            }`}
          >
            {isWin ? <Trophy className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
          </div>

          <div>
            <h2 className="text-3xl font-extrabold font-heading tracking-tight text-white">
              {isWin ? "VICTORY!" : "DEFEAT"}
            </h2>
            <p className="text-xs text-[#9E9E9E] mt-1 font-mono">
              Final Match Score: <span className="text-[#FF6B00] font-bold">{playerRoundWins}</span> - <span className="text-blue-400 font-bold">{opponentRoundWins}</span>
            </p>
          </div>
        </div>

        {/* STX Reward Highlight Box on Victory */}
        {isWin && (
          <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/40 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#FF6B00]" />
              <div>
                <span className="text-xs text-[#9E9E9E] font-mono">REWARD CREDITED</span>
                <p className="text-sm font-bold text-white">+0.001 STX Added to Wallet</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        )}

        {/* 3-Round Summary List */}
        <div className="flex flex-col gap-2 bg-[#181818] p-3 rounded-xl border border-white/5">
          <span className="text-[11px] font-mono text-[#9E9E9E] uppercase tracking-wider">
            3-Round Match Breakdown
          </span>
          {roundScores.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs font-mono py-1 border-b border-white/5 last:border-0"
            >
              <span className="text-[#9E9E9E]">Round {r.round}:</span>
              <span className="font-semibold text-white">
                YOU ({r.playerScore}) vs OPPONENT ({r.opponentScore})
              </span>
              <span
                className={`font-bold ${
                  r.winner === "player" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {r.winner === "player" ? "WON 🥇" : "LOST"}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => {
              initGame(gameMode);
              setActiveScreen("GAME");
            }}
            className="btn-primary w-full text-base font-semibold"
          >
            <RefreshCw className="w-4 h-4" /> Rematch (Best of 3)
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
