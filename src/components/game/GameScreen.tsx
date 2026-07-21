"use client";

import React, { useEffect, useState } from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { HandCanvas } from "./HandCanvas";
import { TargetBanner } from "./TargetBanner";
import { CountdownOverlay } from "./CountdownOverlay";
import { getAIReactionDelay, checkAIMistake } from "../../lib/game-engine/ai-bot";
import { Play, RefreshCw, Home, EyeOff } from "lucide-react";

export const GameScreen: React.FC = () => {
  const {
    status,
    seed,
    maxNumber,
    currentTargetNumber,
    gameMode,
    aiDifficulty,
    opponentScore,
    handleTapNumber,
    handleOpponentProgress,
    resumeGame,
    initGame,
    setActiveScreen,
  } = useGameStore();

  // Memory Mode countdown
  const [memoryHidden, setMemoryHidden] = useState(false);
  const [memoryTimer, setMemoryTimer] = useState(5);

  useEffect(() => {
    if (gameMode === "memory" && status === "PLAYING") {
      setMemoryHidden(false);
      setMemoryTimer(5);
      const timer = setInterval(() => {
        setMemoryTimer((prev) => {
          if (prev <= 1) {
            setMemoryHidden(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameMode, status]);

  // AI Opponent Loop Simulation
  useEffect(() => {
    let aiTimeout: NodeJS.Timeout;

    if (status === "PLAYING" && gameMode === "ai") {
      const scheduleNextAITap = () => {
        const delay = getAIReactionDelay(aiDifficulty);

        aiTimeout = setTimeout(() => {
          if (status !== "PLAYING") return;

          const isMistake = checkAIMistake(aiDifficulty);
          if (!isMistake) {
            handleOpponentProgress(opponentScore + 1);
          }
          scheduleNextAITap();
        }, delay);
      };

      scheduleNextAITap();
    }

    return () => clearTimeout(aiTimeout);
  }, [status, gameMode, aiDifficulty, opponentScore, handleOpponentProgress]);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-between p-3 sm:p-6 overflow-hidden">
      {/* 3-2-1 Countdown Overlay */}
      <CountdownOverlay />

      {/* Top HUD Target Banner */}
      <TargetBanner />

      {/* Memory Mode Alert Banner */}
      {gameMode === "memory" && !memoryHidden && (
        <div className="flex items-center gap-2 bg-[#FF6B00]/10 border border-[#FF6B00]/30 px-4 py-2 rounded-xl text-xs text-[#FF6B00] animate-pulse my-2">
          <EyeOff className="w-4 h-4" />
          <span>Memorize layout! Numbers disappear in {memoryTimer}s...</span>
        </div>
      )}

      {/* Main Hand Canvas */}
      <div className="flex-1 w-full flex items-center justify-center my-2">
        <HandCanvas
          seed={seed}
          maxNumber={maxNumber}
          currentTargetNumber={currentTargetNumber}
          onTapNumber={handleTapNumber}
          isMemoryHidden={memoryHidden && gameMode === "memory"}
          isKidsMode={gameMode === "kids"}
        />
      </div>

      {/* Pause Menu Modal Overlay */}
      {status === "PAUSED" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#111111] border border-white/10 p-6 rounded-2xl flex flex-col gap-4 text-center">
            <h3 className="text-2xl font-bold font-heading text-white">MATCH PAUSED</h3>
            <p className="text-xs text-[#9E9E9E]">Take a breath. The clock is paused.</p>

            <button onClick={resumeGame} className="btn-primary w-full mt-2">
              <Play className="w-4 h-4" /> Resume Match
            </button>
            <button
              onClick={() => {
                initGame(gameMode);
              }}
              className="btn-secondary w-full"
            >
              <RefreshCw className="w-4 h-4 text-[#9E9E9E]" /> Restart Match
            </button>
            <button
              onClick={() => setActiveScreen("HOME")}
              className="btn-ghost w-full"
            >
              <Home className="w-4 h-4" /> Quit to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
