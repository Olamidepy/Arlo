"use client";

import React, { useState } from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { connectLeatherWallet } from "../../lib/wallet/stacks";
import { sound } from "../../lib/audio/sound";
import {
  Wallet,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  CheckCircle2,
  Send,
  AlertCircle,
} from "lucide-react";

export const WalletDrawer: React.FC = () => {
  const { wallet, setWallet, setActiveScreen, handleWithdrawal } = useGameStore();
  const [isConnecting, setIsConnecting] = useState(false);

  // Withdrawal Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("0.05");
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    sound.playButtonClick();
    const res = await connectLeatherWallet();
    setWallet(res);
    setIsConnecting(false);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccess(null);

    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setWithdrawError("Please enter a valid STX amount.");
      return;
    }

    if (!withdrawAddress.trim()) {
      setWithdrawError("Please enter a recipient STX wallet address.");
      return;
    }

    const success = handleWithdrawal(withdrawAddress.trim(), amt);
    if (success) {
      const txHash = `0x${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
      setWithdrawSuccess(`Successfully transferred ${amt} STX! Tx: ${txHash.substring(0, 12)}...`);
      setWithdrawAmount("0.05");
      setWithdrawAddress("");
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawSuccess(null);
      }, 2500);
    } else {
      setWithdrawError("Insufficient STX balance or invalid parameters.");
    }
  };

  const history = [
    { type: "MATCH_VICTORY", amount: "+0.001 STX", date: "Just now", mode: "3-Round AI Victory Reward" },
    { type: "WIN_REWARD", amount: "+0.180 STX", date: "2 mins ago", mode: "1v1 Match vs CyberRacer" },
    { type: "ENTRY_FEE", amount: "-0.100 STX", date: "3 mins ago", mode: "1v1 Room Entry Wager" },
    { type: "DAILY_PRIZE", amount: "+2.500 STX", date: "Yesterday", mode: "Daily Leaderboard #2 Rank" },
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
          <Wallet className="w-5 h-5 text-[#FF6B00]" /> STACKS WALLET & REWARDS
        </h2>
      </div>

      {/* Balance Card */}
      <div className="arlo-card p-6 sm:p-8 flex flex-col gap-6 bg-gradient-to-br from-[#181818] to-[#121212] border-[#FF6B00]/30 mb-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#9E9E9E]">TOTAL STX BALANCE</span>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Stacks Testnet
          </span>
        </div>

        <div>
          <h3 className="text-4xl font-extrabold font-mono text-white">
            {wallet.stxBalance.toFixed(3)} <span className="text-[#FF6B00]">STX</span>
          </h3>
          <p className="text-xs text-[#9E9E9E] mt-1 font-mono">{wallet.address}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Withdraw STX Icon Button */}
          <button
            onClick={() => {
              sound.playButtonClick();
              setShowWithdrawModal(true);
            }}
            className="btn-primary flex-1 text-sm font-semibold shadow-[0_0_20px_rgba(255,107,0,0.3)]"
          >
            <Send className="w-4 h-4" /> Withdraw STX
          </button>

          {wallet.isGuest ? (
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="btn-secondary flex-1 text-sm font-semibold"
            >
              {isConnecting ? "Connecting Leather..." : "Connect Leather Wallet"}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono self-center">
              <Shield className="w-4 h-4" /> Connected ({wallet.walletName})
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

      {/* Interactive Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#111111] border border-white/10 p-6 rounded-2xl flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-heading flex items-center gap-2">
                <Send className="w-5 h-5 text-[#FF6B00]" /> WITHDRAW STX
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-[#9E9E9E] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-mono text-[#9E9E9E] block mb-1">
                  Recipient Stacks Address (STX)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SP2J6ZY48GV1EZ5V2V54...STX"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#9E9E9E] block mb-1">
                  Amount (STX) — Max: {wallet.stxBalance.toFixed(3)}
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  max={wallet.stxBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>

              {withdrawError && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-800/40">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{withdrawError}</span>
                </div>
              )}

              {withdrawSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{withdrawSuccess}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="btn-secondary flex-1 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 text-xs">
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
