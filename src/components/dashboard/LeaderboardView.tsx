"use client";

import React, { useState } from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { Trophy, ArrowLeft, Medal, Zap, Clock } from "lucide-react";

export const LeaderboardView: React.FC = () => {
  const { setActiveScreen } = useGameStore();
  const [tab, setTab] = useState<"daily" | "weekly" | "global">("daily");

  const leaderboardEntries = [
    { rank: 1, name: "CyberEye_X", time: "24.82s", accuracy: "99%", stx: "42.5 STX", country: "🇯🇵" },
    { rank: 2, name: "FastEyes_99", time: "26.10s", accuracy: "98%", stx: "28.0 STX", country: "🇺🇸" },
    { rank: 3, name: "NitroTap", time: "27.45s", accuracy: "97%", stx: "19.2 STX", country: "🇬🇧" },
    { rank: 4, name: "ZeroDelay", time: "29.02s", accuracy: "95%", stx: "12.0 STX", country: "🇩🇪" },
    { rank: 5, name: "ReflexGod", time: "30.15s", accuracy: "96%", stx: "8.5 STX", country: "🇰🇷" },
    { rank: 6, name: "Olamide_Dev", time: "31.40s", accuracy: "94%", stx: "5.0 STX", country: "🇳🇬" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <button
          onClick={() => setActiveScreen("HOME")}
          className="flex items-center gap-2 text-xs text-[#9E9E9E] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h2 className="text-xl font-bold font-heading flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#FF6B00]" /> GLOBAL LEADERBOARD
        </h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#181818] p-1 rounded-xl border border-white/5 mb-6 max-w-sm">
        {(["daily", "weekly", "global"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-semibold capitalize rounded-lg transition-colors ${
              tab === t ? "bg-[#FF6B00] text-white" : "text-[#9E9E9E] hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 bg-[#181818] p-3 text-xs font-mono text-[#9E9E9E] border-b border-white/5">
          <span className="col-span-2">RANK</span>
          <span className="col-span-4">PLAYER</span>
          <span className="col-span-3">BEST TIME</span>
          <span className="col-span-3 text-right">STX REWARDS</span>
        </div>

        <div className="divide-y divide-white/5">
          {leaderboardEntries.map((row) => (
            <div
              key={row.rank}
              className={`grid grid-cols-12 p-4 items-center text-sm font-mono hover:bg-white/5 transition-colors ${
                row.rank === 2 ? "bg-[#FF6B00]/5 border-l-2 border-[#FF6B00]" : ""
              }`}
            >
              <div className="col-span-2 flex items-center gap-2 font-bold">
                {row.rank === 1 && <span className="text-amber-400">🥇 #1</span>}
                {row.rank === 2 && <span className="text-neutral-300">🥈 #2</span>}
                {row.rank === 3 && <span className="text-amber-700">🥉 #3</span>}
                {row.rank > 3 && <span className="text-[#9E9E9E]">#{row.rank}</span>}
              </div>

              <div className="col-span-4 flex items-center gap-2 font-bold text-white">
                <span>{row.country}</span>
                <span>{row.name}</span>
              </div>

              <div className="col-span-3 text-emerald-400 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {row.time}
              </div>

              <div className="col-span-3 text-right text-[#FF6B00] font-bold">
                {row.stx}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
