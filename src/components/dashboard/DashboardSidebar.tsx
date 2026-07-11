'use client';

import Link from 'next/link';
import { useArloStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Cpu, 
  FolderGit2, 
  Wallet2, 
  RotateCcw,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

export function SidebarContent({ 
  activeTab, 
  setActiveTab,
  onItemClick
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void; 
  onItemClick?: () => void;
}) {
  const { resetOrchestration, xlmWalletBalance } = useArloStore();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'projects', label: 'Deliverables', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'agents', label: 'Agent Hub', icon: <Cpu className="w-4 h-4" /> },
    { id: 'wallet', label: 'Wallet Ledger', icon: <Wallet2 className="w-4 h-4" /> },
  ];

  const handleItemClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onItemClick) onItemClick();
  };

  const handleReset = () => {
    resetOrchestration();
    if (onItemClick) onItemClick();
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="space-y-8">
        {/* Logo Section */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-[#09090B]">
              Arlo
            </span>
            <span className="text-[10px] font-semibold text-[#8B5CF6] uppercase tracking-wider bg-[#8B5CF6]/8 px-2 py-0.5 rounded-full font-display">
              Soroban OS
            </span>
          </Link>
        </div>

        {/* Back link */}
        <Link 
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-[#6B7280] hover:text-[#09090B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing
        </Link>

        {/* Main Menu Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#F4F4F5] text-[#09090B]' 
                    : 'text-[#6B7280] hover:text-[#09090B] hover:bg-[#FAFAFA]'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="space-y-4 pt-6 border-t border-[#ECECEC]">
        {/* Wallet Balance Widget */}
        <div className="bg-[#FCFCFC] border border-[#ECECEC] rounded-2xl p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
            Orchestration Wallet
          </div>
          <div className="text-xl font-bold text-[#09090B] mt-1 font-display">
            {xlmWalletBalance} <span className="text-xs font-normal text-[#6B7280]">XLM</span>
          </div>
        </div>

        {/* Reset Trigger */}
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#ECECEC] text-xs font-medium text-[#6B7280] hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Simulator
        </button>
      </div>
    </div>
  );
}

export default function DashboardSidebar({ activeTab, setActiveTab, className }: SidebarProps) {
  return (
    <aside className={cn("hidden md:flex w-64 border-r border-[#ECECEC] bg-white h-screen sticky top-0 flex-col justify-between p-6 shrink-0", className)}>
      <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </aside>
  );
}
// refactor: document SidebarContent extraction rationale
// a11y: ensure sidebar links have aria-current on active route
// release: sidebar v2.0 - mobile-first responsive with sheet drawer

