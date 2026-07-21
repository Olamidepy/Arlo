"use client";

import React, { useState } from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { connectLeatherWallet } from "../../lib/wallet/stacks";
import { Wallet, ArrowLeft, ArrowUpRight, ArrowDownLeft, Shield, CheckCircle2 } from "lucide-react";

export const WalletDrawer: React.FC = () => {
  const { wallet, setWallet, setActiveScreen } = useGameStore();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    const res = await connectLeatherWallet();
    setWallet(res);
    setIsConnecting(false);
  };

  const history = [
    { type: "WIN_REWARD", amount: "+0.18 STX", date: "2 mins ago", mode: "1v1 Match vs CyberRacer" },
    { type: "ENTRY_FEE", amount: "-0.10 STX", date: "3 mins ago", mode: "1v1 Room Entry Wager" },
    { type: "DAILY_PRIZE", amount: "+2.50 STX", date: "Yesterday", mode: "Daily Leaderboard #2 Rank" },
  ];

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
          <Wallet className="w-5 h-5 text-[#FF6B00]" /> STACK WALLET
        </h2>
      </div>

      {/* Balance Card */}
      <div className="arlo-card p-6 sm:p-8 flex flex-col gap-6 bg-gradient-to-br from-[#181818] to-[#121212] border-[#FF6B00]/30 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#9E9E9E]">TOTAL BALANCE</span>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Stacks Testnet
          </span>
        </div>

        <div>
          <h3 className="text-4xl font-extrabold font-mono text-white">
            {wallet.stxBalance.toFixed(2)} <span className="text-[#FF6B00]">STX</span>
          </h3>
          <p className="text-xs text-[#9E9E9E] mt-1 font-mono">{wallet.address}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {wallet.isGuest ? (
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="btn-primary flex-1 text-sm font-semibold"
            >
              {isConnecting ? "Connecting Leather..." : "Connect Leather Wallet"}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <Shield className="w-4 h-4" /> Connected with {wallet.walletName}
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <h4 className="text-sm font-mono text-[#9E9E9E] uppercase tracking-wider mb-3">
        Reward & Transaction History
      </h4>

      <div className="flex flex-col gap-3">
        {history.map((h, i) => (
          <div
            key={i}
            className="bg-[#111111] border border-white/5 p-4 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  h.amount.startsWith("+")
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {h.amount.startsWith("+") ? (
                  <ArrowDownLeft className="w-5 h-5" />
                ) : (
                  <ArrowUpRight className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="font-bold text-white text-sm">{h.mode}</span>
                <p className="text-xs text-[#9E9E9E]">{h.date}</p>
              </div>
            </div>
            <span
              className={`font-mono font-bold text-sm ${
                h.amount.startsWith("+") ? "text-emerald-400" : "text-neutral-400"
              }`}
            >
              {h.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
