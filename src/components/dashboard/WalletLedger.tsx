'use client';

import { useArloStore } from '@/lib/store';
import { Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, Coins } from 'lucide-react';

export default function WalletLedger() {
  const { transactions, xlmWalletBalance, walletAddress } = useArloStore();

  return (
    <div className="space-y-8">
      {/* Wallet overview banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="arlo-panel p-6 bg-white flex items-center justify-between col-span-1 md:col-span-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6B7280] block font-display">Wallet Address</span>
              <span className="text-xs font-mono text-[#09090B] select-all">{walletAddress}</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full font-display flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Soroban Escrow Secured
          </span>
        </div>

        <div className="arlo-panel p-6 bg-white flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-[#6B7280] block font-display">Total Balance</span>
          <div className="text-3xl font-bold text-[#09090B] font-display mt-2 flex items-baseline gap-1.5">
            {xlmWalletBalance}
            <span className="text-sm font-normal text-[#6B7280]">XLM</span>
          </div>
        </div>
      </div>

      {/* Transactions Ledger */}
      <div className="arlo-panel p-4 md:p-8 bg-white">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#09090B] font-display">Stellar Transactions Ledger</h3>
            <p className="text-xs text-[#6B7280] font-sans">
              Cryptographic log of autonomous agent-to-agent escrow contract deposits and releases on the Stellar network.
            </p>
          </div>
          <Coins className="w-5 h-5 text-[#8B5CF6]" />
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 bg-[#FCFCFC] border border-dashed border-[#ECECEC] rounded-2xl">
            <span className="text-xs text-[#6B7280] font-sans">No transactions recorded yet. Launch a startup to trigger transactions.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ECECEC] text-[10px] uppercase font-bold text-[#6B7280] whitespace-nowrap">
                  <th className="py-3 px-4">Tx ID / Ledger</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Participants</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC]">
                {transactions.map((tx) => {
                  const isDeposit = tx.type === 'deposit';
                  const isRelease = tx.type === 'release';
                  const isRefund = tx.type === 'refund';
                  
                  return (
                    <tr key={tx.id} className="text-xs text-[#09090B] hover:bg-[#FAFAFA] transition-colors whitespace-nowrap">
                      <td className="py-4 px-4 font-mono font-semibold text-[#8B5CF6]">
                        <span className="block">{tx.id.substring(0, 12)}...</span>
                        <span className="text-[9px] text-[#6B7280] font-normal">Ledger: {tx.ledgerSeq}</span>
                      </td>
                      <td className="py-4 px-4 font-sans">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isDeposit 
                              ? 'bg-red-50 text-red-500' 
                              : isRelease 
                                ? 'bg-emerald-50 text-emerald-500' 
                                : 'bg-amber-50 text-amber-500'
                          }`}>
                            {isDeposit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          </div>
                          <span>
                            {isDeposit 
                              ? `Escrow Deposit: ${tx.agentId ? tx.agentId.toUpperCase() : 'UNKNOWN'}` 
                              : isRelease 
                                ? `Escrow Release: ${tx.agentId ? tx.agentId.toUpperCase() : 'UNKNOWN'}` 
                                : `Escrow Refund: ${tx.agentId ? tx.agentId.toUpperCase() : 'UNKNOWN'}`}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[#6B7280]">
                        <span className="text-[#09090B]">From:</span> {tx.from.substring(0, 10)}... 
                        <br />
                        <span className="text-[#09090B]">To:</span> {tx.to.substring(0, 10)}...
                      </td>
                      <td className={`py-4 px-4 font-display font-semibold ${
                        isDeposit ? 'text-red-600' : isRelease ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {isDeposit ? '-' : '+'}{tx.amount.toFixed(1)} XLM
                      </td>
                      <td className="py-4 px-4 text-right text-[#6B7280] font-sans">
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
// chore: annotate wallet ledger component exports
// perf: note: ledger re-renders only on store state change

