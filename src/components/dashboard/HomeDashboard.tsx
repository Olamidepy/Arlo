"use client";

import React, { useState } from "react";
import { useGameStore, GameMode } from "../../lib/store/gameStore";
import { AIDifficulty, AI_DIFFICULTIES } from "../../lib/game-engine/ai-bot";
import {
  Play,
  Bot,
  Users,
  PlusCircle,
  Trophy,
  Calendar,
  Wallet,
  User,
  Shield,
  Clock,
  RotateCcw,
  EyeOff,
  Zap,
  Smile,
  Globe,
} from "lucide-react";

export const HomeDashboard: React.FC = () => {
  const {
    username,
    wallet,
    aiDifficulty,
    setAIDifficulty,
    initGame,
    createRoom,
    joinRoom,
    setActiveScreen,
  } = useGameStore();

  const [showAiModal, setShowAiModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleStartSolo = () => {
    initGame("solo");
    setActiveScreen("GAME");
  };

  const handleStartAI = (diff: AIDifficulty) => {
    setAIDifficulty(diff);
    initGame("ai");
    setShowAiModal(false);
    setActiveScreen("GAME");
  };

  const handleStartDaily = () => {
    const todaySeed = `DAILY-${new Date().toISOString().split("T")[0]}`;
    initGame("daily", todaySeed);
    setActiveScreen("GAME");
  };

  const handleJoinRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCodeInput.trim().length > 0) {
      joinRoom(joinCodeInput.trim());
      setShowJoinModal(false);
    }
  };

  const specialModes: { mode: GameMode; title: string; desc: string; icon: React.ReactNode }[] = [
    { mode: "survival", title: "Survival", desc: "3 Mistakes = Game Over", icon: <Shield className="w-5 h-5 text-red-500" /> },
    { mode: "reverse", title: "Reverse Mode", desc: "Find 100 ➔ 1", icon: <RotateCcw className="w-5 h-5 text-purple-400" /> },
    { mode: "memory", title: "Memory Mode", desc: "Disappears after 5s", icon: <EyeOff className="w-5 h-5 text-amber-400" /> },
    { mode: "lightning", title: "Lightning 1–30", desc: "Ultra fast speedrun", icon: <Zap className="w-5 h-5 text-[#FF6B00]" /> },
    { mode: "kids", title: "Kids Mode", desc: "1–20 Large numbers", icon: <Smile className="w-5 h-5 text-emerald-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Top Navbar */}
      <div className="flex items-center justify-between py-4 border-b border-white/5 mb-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center font-bold text-xl text-white font-mono shadow-[0_0_20px_rgba(255,107,0,0.4)]">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading tracking-tight">ARLO</h1>
            <p className="text-xs text-[#9E9E9E]">The fastest eyes win</p>
          </div>
        </div>

        {/* User Stats & Wallet Drawer Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen("LEADERBOARD")}
            className="hidden sm:flex items-center gap-2 btn-secondary text-xs"
          >
            <Globe className="w-4 h-4 text-[#9E9E9E]" /> Leaderboard
          </button>

          <button
            onClick={() => setActiveScreen("WALLET")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 hover:border-[#FF6B00]/40 transition-colors"
          >
            <Wallet className="w-4 h-4 text-[#FF6B00]" />
            <span className="text-xs font-mono font-bold text-white">
              {wallet.stxBalance.toFixed(2)} STX
            </span>
          </button>

          <button
            onClick={() => setActiveScreen("PROFILE")}
            className="w-10 h-10 rounded-xl bg-[#181818] border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors"
          >
            <User className="w-5 h-5 text-[#9E9E9E]" />
          </button>
        </div>
      </div>

      {/* Main Home Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Hero Quick Play Card */}
        <div
          onClick={handleStartSolo}
          className="md:col-span-2 arlo-card p-6 sm:p-8 cursor-pointer group bg-gradient-to-br from-[#181818] to-[#121212] border-[#FF6B00]/20 flex flex-col justify-between min-h-[220px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono text-[#FF6B00] uppercase tracking-wider font-semibold">
                Solo Practice
              </span>
              <h2 className="text-3xl font-extrabold font-heading text-white mt-1 group-hover:text-[#FF6B00] transition-colors">
                Quick Play 1–100
              </h2>
              <p className="text-sm text-[#9E9E9E] mt-2 max-w-md">
                Race against your own best time on a fresh generated hand layout. Perfect your eye scanning speed.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-[#FF6B00]" />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#9E9E9E] mt-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#FF6B00]" /> Solo Speedrun
            </span>
            <span>•</span>
            <span>100 Target Numbers</span>
          </div>
        </div>

        {/* Daily Challenge Card */}
        <div
          onClick={handleStartDaily}
          className="arlo-card p-6 cursor-pointer group flex flex-col justify-between border-amber-500/20"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                Daily Layout
              </span>
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold font-heading group-hover:text-amber-400 transition-colors">
              Daily Challenge
            </h3>
            <p className="text-xs text-[#9E9E9E] mt-1.5">
              Everyone gets the exact same hand layout today. Fastest time climbs the daily global leaderboard.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-amber-400">
            <span>Entry Free</span>
            <span className="font-bold">Play Today →</span>
          </div>
        </div>
      </div>

      {/* Game Mode Cards Row: Versus AI, Create Room, Join Room */}
      <h3 className="text-sm uppercase tracking-widest text-[#9E9E9E] font-mono font-semibold mb-4">
        Multiplayer & AI Modes
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {/* Play vs AI */}
        <div
          onClick={() => setShowAiModal(true)}
          className="arlo-card p-6 cursor-pointer group flex flex-col gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-heading group-hover:text-blue-400 transition-colors">
              Play vs AI 1v1
            </h4>
            <p className="text-xs text-[#9E9E9E] mt-1">
              Test your reaction against Easy, Medium, Hard, or Impossible Cyborg AI bots.
            </p>
          </div>
        </div>

        {/* Create Room */}
        <div
          onClick={createRoom}
          className="arlo-card p-6 cursor-pointer group flex flex-col gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] group-hover:scale-105 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-heading group-hover:text-[#FF6B00] transition-colors">
              Create Room
            </h4>
            <p className="text-xs text-[#9E9E9E] mt-1">
              Host a 1v1 match with a custom STX entry wager or casual friendly code.
            </p>
          </div>
        </div>

        {/* Join Room */}
        <div
          onClick={() => setShowJoinModal(true)}
          className="arlo-card p-6 cursor-pointer group flex flex-col gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-heading group-hover:text-emerald-400 transition-colors">
              Join Room
            </h4>
            <p className="text-xs text-[#9E9E9E] mt-1">
              Enter a 4-digit room code from a friend to start a real-time visual race.
            </p>
          </div>
        </div>
      </div>

      {/* Special Variant Modes */}
      <h3 className="text-sm uppercase tracking-widest text-[#9E9E9E] font-mono font-semibold mb-4">
        Special Game Modes
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {specialModes.map((item) => (
          <div
            key={item.mode}
            onClick={() => {
              initGame(item.mode);
              setActiveScreen("GAME");
            }}
            className="arlo-card p-4 cursor-pointer group flex flex-col gap-2 hover:border-white/20"
          >
            <div className="mb-1">{item.icon}</div>
            <h5 className="text-sm font-bold font-heading text-white group-hover:text-[#FF6B00] transition-colors">
              {item.title}
            </h5>
            <p className="text-[11px] text-[#9E9E9E]">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* AI Difficulty Select Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#111111] border border-white/10 p-6 rounded-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-heading">SELECT AI DIFFICULTY</h3>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-[#9E9E9E] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {(Object.keys(AI_DIFFICULTIES) as AIDifficulty[]).map((key) => {
                const conf = AI_DIFFICULTIES[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleStartAI(key)}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#181818] border border-white/5 hover:border-[#FF6B00]/40 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{conf.avatarUrl}</span>
                      <div>
                        <span className="font-bold text-white capitalize group-hover:text-[#FF6B00]">
                          {key} ({conf.name})
                        </span>
                        <p className="text-xs text-[#9E9E9E]">
                          Reaction: {conf.minReactionMs}–{conf.maxReactionMs}ms
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#FF6B00]">Play →</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#111111] border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-xl font-bold font-heading">ENTER ROOM CODE</h3>
            <form onSubmit={handleJoinRoomSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="e.g. ARLO-8492"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white uppercase focus:outline-none focus:border-[#FF6B00]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Join Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
