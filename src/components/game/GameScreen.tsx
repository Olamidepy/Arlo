"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { HandCanvas } from "./HandCanvas";
import { TargetBanner } from "./TargetBanner";
import { CountdownOverlay } from "./CountdownOverlay";
import { getAIReactionDelay, checkAIMistake } from "../../lib/game-engine/ai-bot";
import { Play, RefreshCw, Home, EyeOff, Trophy, ArrowRight } from "lucide-react";

export const GameScreen: React.FC = () => {
  const {
    status,
    seed,
    maxNumber,
    currentTargetNumber,
    completedNumbers,
    gameMode,
    aiDifficulty,
    opponentScore,
    currentRound,
    lastRoundWinner,
    handleTapNumber,
    handleOpponentProgress,
    proceedToNextRound,
    resumeGame,
    initGame,
    setActiveScreen,
  } = useGameStore();

  const completedSet = useMemo(() => new Set(completedNumbers), [completedNumbers]);

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
          completedNumbers={completedSet}
          isMemoryHidden={memoryHidden && gameMode === "memory"}
          isKidsMode={gameMode === "kids"}
        />
      </div>

      {/* Round End Modal (Round 1 / Round 2 / Round 3 Winner Display) */}
      {status === "ROUND_ENDED" && lastRoundWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-sm bg-[#111111] border border-white/10 p-6 sm:p-8 rounded-2xl flex flex-col gap-5 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00] text-[#FF6B00] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,107,0,0.4)]">
              <Trophy className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#9E9E9E]">
                ROUND {lastRoundWinner.round} COMPLETED
              </span>
              <h3 className="text-3xl font-extrabold font-heading text-white mt-1">
                {lastRoundWinner.winner === "player" ? "ROUND WINNER: YOU!" : "ROUND WINNER: OPPONENT"}
              </h3>
              <p className="text-xs text-[#9E9E9E] mt-1 font-mono">
                Round Score: YOU ({lastRoundWinner.playerScore}) vs OPPONENT ({lastRoundWinner.opponentScore})
              </p>
            </div>

            <button
              onClick={proceedToNextRound}
              className="btn-primary w-full text-sm font-bold shadow-[0_0_20px_rgba(255,107,0,0.3)] mt-2"
            >
              Continue to Round {currentRound < 3 ? currentRound + 1 : "Final Results"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
