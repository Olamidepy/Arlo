"use client";

import React, { useState } from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { User, ArrowLeft, Award, Flame, Zap, Clock, ShieldCheck, Check } from "lucide-react";

export const ProfileView: React.FC = () => {
  const { username, setUsername, country, rankName, stats, setActiveScreen } = useGameStore();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(username);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUsername(nameInput.trim());
      setIsEditing(false);
    }
  };

  const badges = [
    { title: "Lightning Eyes", desc: "Under 30s match completion", icon: "⚡", unlocked: true },
    { title: "STX High Roller", desc: "Won 10+ STX in 1v1 wagers", icon: "💎", unlocked: true },
    { title: "Cyborg Slayer", desc: "Beat Impossible AI", icon: "🤖", unlocked: true },
    { title: "Perfect Memory", desc: "Won Memory mode without wrong tap", icon: "🧠", unlocked: false },
  ];

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <button
          onClick={() => setActiveScreen("HOME")}
          className="flex items-center gap-2 text-xs text-[#9E9E9E] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h2 className="text-xl font-bold font-heading flex items-center gap-2">
          <User className="w-5 h-5 text-[#FF6B00]" /> PLAYER PROFILE
        </h2>
      </div>

      {/* User Header Card */}
      <div className="arlo-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00] flex items-center justify-center text-3xl font-bold text-[#FF6B00]">
            {username.charAt(0)}
          </div>
          <div>
            {isEditing ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-[#111111] border border-[#FF6B00] rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="p-1 rounded bg-[#FF6B00] text-white">
                  <Check className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-extrabold font-heading text-white">{username}</h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-[#9E9E9E] hover:text-[#FF6B00]"
                >
                  Edit
                </button>
              </div>
            )}
            <p className="text-xs text-[#9E9E9E] mt-0.5 flex items-center gap-2">
              <span>{country}</span> • <span className="text-[#FF6B00] font-semibold">{rankName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#111111] border border-amber-500/30 px-3.5 py-2 rounded-xl text-amber-400 text-xs font-mono font-bold">
          <Flame className="w-4 h-4" /> {stats.streak} Match Win Streak
        </div>
      </div>

      {/* Stats Summary Grid */}
      <h4 className="text-sm font-mono text-[#9E9E9E] uppercase tracking-wider mb-3">
        Lifetime Performance
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111111] border border-white/5 p-4 rounded-xl flex flex-col gap-1">
          <span className="text-xs text-[#9E9E9E] font-mono">GAMES PLAYED</span>
          <span className="text-2xl font-bold font-mono text-white">{stats.gamesPlayed}</span>
        </div>

        <div className="bg-[#111111] border border-white/5 p-4 rounded-xl flex flex-col gap-1">
          <span className="text-xs text-[#9E9E9E] font-mono">WIN RATE</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{winRate}%</span>
        </div>

        <div className="bg-[#111111] border border-white/5 p-4 rounded-xl flex flex-col gap-1">
          <span className="text-xs text-[#9E9E9E] font-mono">BEST TIME</span>
          <span className="text-2xl font-bold font-mono text-[#FF6B00]">
            {(stats.bestTimeMs / 1000).toFixed(1)}s
          </span>
        </div>

        <div className="bg-[#111111] border border-white/5 p-4 rounded-xl flex flex-col gap-1">
          <span className="text-xs text-[#9E9E9E] font-mono">AVG REACTION</span>
          <span className="text-2xl font-bold font-mono text-blue-400">{stats.avgReactionMs}ms</span>
        </div>
      </div>

      {/* NFT Badges */}
      <h4 className="text-sm font-mono text-[#9E9E9E] uppercase tracking-wider mb-3">
        NFT Badges & Achievements
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.map((b, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
              b.unlocked
                ? "bg-[#111111] border-white/10"
                : "bg-[#111111]/40 border-white/5 opacity-50"
            }`}
          >
            <span className="text-2xl p-2 bg-[#181818] rounded-xl">{b.icon}</span>
            <div>
              <span className="font-bold text-white text-sm flex items-center gap-1.5">
                {b.title}
                {b.unlocked && <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B00]" />}
              </span>
              <p className="text-xs text-[#9E9E9E]">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
