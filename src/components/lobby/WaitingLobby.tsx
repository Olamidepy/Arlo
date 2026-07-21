"use client";

import React, { useState } from "react";
import { useGameStore } from "../../lib/store/gameStore";
import { CheckCircle2, Copy, ShieldCheck, ArrowLeft, Send } from "lucide-react";

export const WaitingLobby: React.FC = () => {
  const {
    roomCode,
    isHost,
    isReady,
    opponentName,
    opponentReady,
    stxStake,
    username,
    toggleReady,
    startCountdown,
    setActiveScreen,
  } = useGameStore();

  const [copied, setCopied] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: "System", text: `Room ${roomCode} created. Waiting for opponent...` },
    { sender: opponentName, text: "Ready when you are! Let's see who's faster." },
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim().length > 0) {
      setChatMessages((prev) => [...prev, { sender: username, text: chatInput.trim() }]);
      setChatInput("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <button
            onClick={() => setActiveScreen("HOME")}
            className="flex items-center gap-2 text-xs text-[#9E9E9E] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Leave Lobby
          </button>
          <div className="flex items-center gap-2 bg-[#181818] border border-white/10 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-[#9E9E9E]">ROOM CODE:</span>
            <span className="text-sm font-mono font-bold text-[#FF6B00]">{roomCode}</span>
            <button onClick={handleCopyCode} className="text-[#9E9E9E] hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stake Wager Info Banner */}
        <div className="flex items-center justify-between bg-[#181818] border border-amber-500/20 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-sm font-bold text-white">Entry Fee: {stxStake} STX</span>
              <p className="text-xs text-[#9E9E9E]">Winner receives {(stxStake * 1.8).toFixed(2)} STX</p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg">
            Smart Contract Verified
          </span>
        </div>

        {/* Players Slot Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Player 1 (You) */}
          <div className="bg-[#181818] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#9E9E9E]">PLAYER 1 (YOU)</span>
              {isReady ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> READY
                </span>
              ) : (
                <span className="text-xs text-amber-400 font-semibold">NOT READY</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00] flex items-center justify-center text-[#FF6B00] font-bold">
                {username.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-white">{username}</span>
                <p className="text-xs text-emerald-400">Wallet Connected</p>
              </div>
            </div>
          </div>

          {/* Player 2 (Opponent) */}
          <div className="bg-[#181818] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#9E9E9E]">PLAYER 2</span>
              {opponentReady ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> READY
                </span>
              ) : (
                <span className="text-xs text-amber-400 font-semibold">NOT READY</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400 font-bold">
                {opponentName.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-white">{opponentName}</span>
                <p className="text-xs text-emerald-400">Wallet Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lobby Chat Box */}
        <div className="bg-[#181818] border border-white/5 rounded-xl p-3 flex flex-col gap-2 max-h-40 overflow-y-auto">
          <span className="text-[11px] font-mono text-[#9E9E9E] uppercase">Lobby Chat</span>
          <div className="flex flex-col gap-1 text-xs">
            {chatMessages.map((m, i) => (
              <div key={i}>
                <span className="font-bold text-[#FF6B00]">{m.sender}: </span>
                <span className="text-neutral-300">{m.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChat} className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="Type message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-[#111111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
            />
            <button type="submit" className="p-1.5 rounded-lg bg-[#FF6B00] text-white">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={toggleReady}
            className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${
              isReady
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "btn-primary"
            }`}
          >
            {isReady ? "Ready! (Click to cancel)" : "Toggle Ready"}
          </button>

          {isHost && (
            <button
              onClick={() => {
                startCountdown();
                setActiveScreen("GAME");
              }}
              disabled={!isReady || !opponentReady}
              className="btn-secondary flex-1 disabled:opacity-40"
            >
              Start Match GO →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
