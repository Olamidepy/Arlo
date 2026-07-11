'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useArloStore, AgentId } from '@/lib/store';
import DashboardSidebar, { SidebarContent } from '@/components/dashboard/DashboardSidebar';
import OrchestratorConsole from '@/components/dashboard/OrchestratorConsole';
import DeliverableTabs from '@/components/dashboard/DeliverableTabs';
import WalletLedger from '@/components/dashboard/WalletLedger';
import { Sheet, SheetTrigger, SheetPortal, SheetOverlay, SheetContent } from '@/components/ui/sheet';
import { 
  Play, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  Terminal, 
  Coins, 
  Search, 
  TrendingUp, 
  Type, 
  Palette, 
  MessageSquare, 
  Award, 
  Zap,
  Menu
} from 'lucide-react';

const AgentCanvas = dynamic(() => import('@/components/landing/AgentCanvas'), { ssr: false });

export default function DashboardPage() {
  const { 
    startupIdea, 
    isOrchestrating, 
    activeAgentId, 
    progress, 
    agents, 
    startOrchestration,
    xlmWalletBalance 
  } = useArloStore();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [newIdea, setNewIdea] = useState('');

  const handleStartSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;
    startOrchestration(newIdea);
    setNewIdea('');
  };

  const agentIcons: Record<AgentId, React.ReactNode> = {
    scout: <Search className="w-4 h-4" />,
    atlas: <TrendingUp className="w-4 h-4" />,
    muse: <Type className="w-4 h-4" />,
    canvas: <Palette className="w-4 h-4" />,
    echo: <MessageSquare className="w-4 h-4" />,
    spark: <Award className="w-4 h-4" />,
    launch: <Zap className="w-4 h-4" />
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#FCFCFC] text-[#09090B] flex flex-col md:flex-row font-sans selection:bg-[#8B5CF6]/10 selection:text-[#8B5CF6]">
      {/* Background Soft Gaussian Blurs */}
      <div className="gaussian-gradient-wrapper">
        <div className="blur-blob blob-purple top-[5%] left-[200px]" />
        <div className="blur-blob blob-cyan bottom-[15%] right-[200px]" />
      </div>

      {/* Mobile Header Top Bar */}
      <header className="md:hidden sticky top-0 z-40 w-full flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-[#ECECEC]">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-[#09090B]">Arlo</span>
          <span className="text-[9px] font-semibold text-[#8B5CF6] uppercase tracking-wider bg-[#8B5CF6]/8 px-2 py-0.5 rounded-full font-display">
            Soroban OS
          </span>
        </div>
        
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="p-2.5 rounded-xl border border-[#ECECEC] text-[#09090B] hover:bg-[#FAFAFA] transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetPortal>
            <SheetOverlay />
            <SheetContent side="left" className="w-64 p-0 bg-white h-full border-r border-[#ECECEC]">
              <div className="p-6 h-full flex flex-col justify-between">
                <SidebarContent 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  onItemClick={() => setMobileMenuOpen(false)}
                />
              </div>
            </SheetContent>
          </SheetPortal>
        </Sheet>
      </header>

      {/* Navigation Sidebar */}
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Pane */}
      <main className="flex-1 p-4 md:p-10 z-10 relative overflow-y-auto h-screen scrollbar-thin">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header info */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#09090B] font-display">Venture Overview</h2>
              <p className="text-xs text-[#6B7280] font-sans">
                Monitor and orchestrate specialized AI agents in real-time.
              </p>
            </div>

            {/* Empty state: No startup launched */}
            {!startupIdea && !isOrchestrating && (
              <div className="arlo-panel p-12 text-center bg-white flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mb-6">
                  <Cpu className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-display text-[#09090B]">No Active Venture</h3>
                <p className="text-xs text-[#6B7280] max-w-sm mt-2 font-sans mb-8">
                  Input a startup idea or business description below to assemble and spin up your autonomous AI agent team.
                </p>

                <form onSubmit={handleStartSim} className="w-full max-w-lg p-2 rounded-full border border-[#ECECEC] bg-[#FCFCFC] shadow-sm flex items-stretch gap-2 hover:border-neutral-300 transition-all duration-300">
                  <input
                    type="text"
                    required
                    value={newIdea}
                    onChange={(e) => setNewIdea(e.target.value)}
                    placeholder="Describe your startup concept (e.g. AI-powered smart irrigation)..."
                    className="flex-1 bg-transparent px-5 py-3 text-xs text-[#09090B] focus:outline-none placeholder:text-[#6B7280] font-sans"
                  />
                  <button
                    type="submit"
                    className="btn-arlo btn-arlo-primary !h-10 !px-5 text-xs flex items-center gap-1.5"
                  >
                    Start Setup <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* Active Orchestration Dashboard */}
            {startupIdea && (
              <div className="space-y-8">
                {/* Active Idea Header Banner */}
                <div className="arlo-panel p-4 md:p-8 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6] font-display bg-[#8B5CF6]/5 px-3 py-1 rounded-full border border-[#8B5CF6]/10">
                      Active Concept
                    </span>
                    <h3 className="text-2xl font-bold text-[#09090B] font-display">{startupIdea}</h3>
                  </div>

                  {/* Progress Ring / Status */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#6B7280] block font-display">Orchestration Progress</span>
                      <span className="text-xl font-bold text-[#09090B] font-display">{progress}%</span>
                    </div>
                    <div className="w-16 h-2 bg-neutral-100 border border-[#ECECEC] rounded-full overflow-hidden">
                      <div 
                        className="bg-[#8B5CF6] h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Execution visual: Flow canvas & Terminal console */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Small Canvas panel */}
                    <div className="arlo-panel p-6 bg-white flex-1 flex flex-col justify-between">
                      <h4 className="font-display font-bold text-sm text-[#09090B] mb-4">Orchestration Chain Map</h4>
                      <div className="h-[300px] rounded-2xl overflow-hidden border border-[#ECECEC]">
                        <AgentCanvas />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    {/* Shell console log */}
                    <OrchestratorConsole />
                  </div>
                </div>

                {/* Agents Status Pipeline Cards */}
                <div>
                  <h4 className="font-display font-bold text-sm text-[#09090B] mb-4">AI Agent Status Pipeline</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                    {Object.values(agents).map((agent) => {
                      const isWorking = agent.status === 'working';
                      const isCompleted = agent.status === 'completed';
                      
                      return (
                        <div 
                          key={agent.id}
                          className={`arlo-panel p-4 text-center bg-white flex flex-col items-center justify-between h-36 relative transition-all duration-300 ${
                            isWorking 
                              ? 'border-neutral-800 scale-105 shadow-sm' 
                              : isCompleted 
                                ? 'border-[#ECECEC] opacity-90' 
                                : 'border-[#ECECEC] opacity-50'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2"
                            style={{ backgroundColor: agent.color }}
                          >
                            {agentIcons[agent.id]}
                          </div>
                          
                          <div>
                            <div className="font-display font-bold text-xs text-[#09090B] truncate max-w-full">
                              {agent.name}
                            </div>
                            <div className="text-[9px] font-semibold text-[#6B7280] tracking-wider uppercase mt-1">
                              {agent.status}
                            </div>
                          </div>

                          <div className="border-t border-[#ECECEC] w-full pt-2 mt-2 flex justify-center items-center gap-1 text-[9px] font-mono text-[#6B7280]">
                            <Coins className="w-2.5 h-2.5" />
                            {agent.cost} XLM
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DELIVERABLES TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#09090B] font-display">Generated Artifacts</h2>
              <p className="text-xs text-[#6B7280] font-sans">
                Review and export the strategic venture outputs delivered by your AI teams.
              </p>
            </div>
            <DeliverableTabs />
          </div>
        )}

        {/* AGENTS TAB (HUB) */}
        {activeTab === 'agents' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#09090B] font-display">Specialist Agent Registry</h2>
              <p className="text-xs text-[#6B7280] font-sans">
                Review verified autonomous AI specialists hired over Soroban Agent Protocol.
              </p>
            </div>

            <div className="arlo-panel p-4 md:p-8 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#ECECEC] text-[10px] uppercase font-bold text-[#6B7280]">
                      <th className="py-3 px-4">Agent Name</th>
                      <th className="py-3 px-4">Focus Field</th>
                      <th className="py-3 px-4">Orchestration Description</th>
                      <th className="py-3 px-4">Base Rate</th>
                      <th className="py-3 px-4 text-right">Integrity Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECECEC] text-xs text-[#09090B]">
                    {Object.values(agents).map((a) => (
                      <tr key={a.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-4 px-4 font-display font-bold text-sm flex items-center gap-3">
                          <div 
                            className="w-7 h-7 rounded-md flex items-center justify-center text-white shrink-0"
                            style={{ backgroundColor: a.color }}
                          >
                            {agentIcons[a.id]}
                          </div>
                          {a.name}
                        </td>
                        <td className="py-4 px-4 text-[#6B7280] font-sans">
                          {a.role}
                        </td>
                        <td className="py-4 px-4 text-[#6B7280] font-sans leading-relaxed max-w-sm">
                          {a.description}
                        </td>
                        <td className="py-4 px-4 font-display font-semibold text-[#8B5CF6]">
                          {a.cost} XLM / task
                        </td>
                        <td className="py-4 px-4 text-right font-mono text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                          Soroban-Escrow Secure
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#09090B] font-display">Wallet Ledger</h2>
              <p className="text-xs text-[#6B7280] font-sans">
                Review your agent transaction history, payments, and smart contract deposits.
              </p>
            </div>
            <WalletLedger />
          </div>
        )}

      </main>
    </div>
  );
}
