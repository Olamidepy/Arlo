'use client';

import { useEffect, useRef } from 'react';
import { useArloStore, LiveLog } from '@/lib/store';
import { Terminal, Shield, CheckCircle2, AlertTriangle, XCircle, Play } from 'lucide-react';

export default function OrchestratorConsole() {
  const { logs } = useArloStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogIcon = (type: LiveLog['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />;
      case 'error':
        return <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />;
      case 'code':
        return <Terminal className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0 mt-0.5" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-[#6B7280] shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="arlo-panel p-6 flex flex-col h-[400px] bg-neutral-950 text-neutral-200 border-neutral-900 shadow-lg">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-display font-bold text-xs text-neutral-400 ml-2 tracking-tight">
            agent-orchestration-console.sh
          </span>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 font-display">
          Soroban Agent Protocol (SAP) v2.0.0
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-2 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {logs.length === 0 ? (
          <div className="text-neutral-500 flex items-center gap-2">
            <Play className="w-3 h-3 text-neutral-600 animate-pulse" />
            Standing by for orchestration idea...
          </div>
        ) : (
          [...logs].reverse().map((log) => {
            const isCode = log.type === 'code';
            return (
              <div 
                key={log.id} 
                className={`flex gap-3 leading-relaxed transition-all duration-300 ${
                  isCode ? 'bg-neutral-900/40 p-2.5 border border-neutral-900 rounded-lg' : ''
                }`}
              >
                {getLogIcon(log.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-neutral-600">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    {log.agentId && (
                      <span className="text-[9px] uppercase font-bold tracking-wider text-[#8B5CF6]/80 px-2 py-0.5 rounded bg-[#8B5CF6]/5 border border-[#8B5CF6]/10">
                        {log.agentId}
                      </span>
                    )}
                  </div>
                  <span className={isCode ? 'text-indigo-300 font-mono' : 'text-neutral-300'}>
                    {log.message}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
// chore: add section marker for console header region
// a11y: verify screen-reader accessible heading levels

