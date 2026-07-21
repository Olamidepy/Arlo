"use client";

import React from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { connectLeatherWallet } from "../../lib/wallet/stacks";
import { Play, Wallet, Zap, Trophy, Shield, ArrowRight } from "lucide-react";

export const LandingHero: React.FC = () => {
  const { setActiveScreen, setWallet, initGame } = useGameStore();

  const handlePlayNow = () => {
    setActiveScreen("HOME");
  };

  const handleConnectWallet = async () => {
    const res = await connectLeatherWallet();
    setWallet(res);
    setActiveScreen("HOME");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between p-4 sm:p-8 max-w-6xl mx-auto overflow-hidden">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center font-bold text-xl text-white font-mono shadow-[0_0_25px_rgba(255,107,0,0.5)]">
            A
          </div>
          <span className="text-xl font-bold font-heading tracking-tight">ARLO</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleConnectWallet} className="btn-secondary text-xs">
            <Wallet className="w-4 h-4 text-[#FF6B00]" /> Connect Wallet
          </button>
          <button onClick={handlePlayNow} className="btn-primary text-xs">
            Play Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center my-12">
        {/* Left Column Text */}
        <div className="flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#FF6B00]/30 text-xs font-mono text-[#FF6B00] w-fit">
            <Zap className="w-3.5 h-3.5" /> MULTIPLAYER VISUAL REACTION GAME
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold font-heading tracking-tight text-white leading-none">
            The fastest eyes <span className="text-[#FF6B00]">win.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#9E9E9E] max-w-lg leading-relaxed">
            Find. Tap. Repeat. Race against friends or AI to locate scattered numbers 1–100 hidden inside a hand illustration. Earn STX rewards for speed and accuracy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => {
                initGame("solo");
                setActiveScreen("GAME");
              }}
              className="btn-primary text-base font-semibold px-8 shadow-[0_0_30px_rgba(255,107,0,0.3)]"
            >
              <Play className="w-5 h-5 fill-white" /> Quick Play 1–100
            </button>

            <button onClick={handlePlayNow} className="btn-secondary text-base font-semibold px-8">
              Explore Dashboard
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 text-xs font-mono text-[#9E9E9E]">
            <div>
              <span className="text-lg font-bold text-white block">100%</span> Seed Fair Matches
            </div>
            <div>
              <span className="text-lg font-bold text-[#FF6B00] block">0.1 STX</span> Wager Rewards
            </div>
            <div>
              <span className="text-lg font-bold text-white block">&lt;200ms</span> AI Response
            </div>
          </div>
        </div>

        {/* Right Column Interactive Vector Preview */}
        <div className="relative w-full aspect-square max-w-md mx-auto flex items-center justify-center p-6 bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl">
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full drop-shadow-[0_0_40px_rgba(255,107,0,0.2)] animate-pulse"
          >
            <path
              d="
                M 380 870 C 340 850 310 800 300 740 C 290 690 260 670 210 650
                C 160 630 140 570 160 520 C 180 470 230 460 280 500 C 310 525 330 500 320 440
                C 305 350 290 220 310 130 C 325 60 380 60 395 130 L 405 400
                C 415 370 425 210 440 90 C 455 20 520 20 535 90 L 545 390
                C 555 360 575 230 595 130 C 610 60 675 70 685 140 L 695 420
                C 705 400 725 310 745 230 C 760 170 815 180 820 240 C 830 330 810 480 800 560
                C 790 640 780 730 730 800 C 680 870 610 890 500 890 C 440 890 400 885 380 870 Z
              "
              fill="#141414"
              stroke="#FF6B00"
              strokeWidth="4"
            />
            {/* Animated Demo Target Numbers */}
            <circle cx="500" cy="580" r="30" fill="rgba(255,107,0,0.2)" />
            <text x="500" y="580" textAnchor="middle" dominantBaseline="central" fill="#FF6B00" fontSize="32" fontWeight="bold" fontFamily="monospace">
              1
            </text>
            <text x="350" y="300" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="24" fontFamily="monospace">
              37
            </text>
            <text x="500" y="240" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="24" fontFamily="monospace">
              88
            </text>
            <text x="640" y="320" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="24" fontFamily="monospace">
              14
            </text>
            <text x="760" y="380" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="24" fontFamily="monospace">
              99
            </text>
          </svg>
          <div className="absolute bottom-6 bg-[#181818]/90 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-mono text-[#FF6B00] font-semibold">
            Find: 1 ➔ 2 ➔ ... ➔ 100
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-[#9E9E9E] font-mono">
        Arlo © 2026 — Built on Stacks Blockchain with Next.js 15 & Tailwind CSS
      </footer>
    </div>
  );
};
