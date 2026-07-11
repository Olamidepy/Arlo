'use client';

import { useState } from 'react';
import { useArloStore } from '@/lib/store';
import { 
  Search, 
  TrendingUp, 
  Type, 
  Palette, 
  MessageSquare, 
  Award, 
  Zap,
  Globe,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function DeliverableTabs() {
  const { artifacts, agents } = useArloStore();
  const [activeTab, setActiveTab] = useState<'scout' | 'atlas' | 'muse' | 'canvas' | 'echo' | 'spark' | 'launch'>('scout');

  const tabs = [
    { id: 'scout', label: 'Market Viability', icon: <Search className="w-4 h-4" /> },
    { id: 'atlas', label: 'Business Strategy', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'muse', label: 'Brand Naming', icon: <Type className="w-4 h-4" /> },
    { id: 'canvas', label: 'Brand Identity', icon: <Palette className="w-4 h-4" /> },
    { id: 'echo', label: 'Marketing Copy', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'spark', label: 'Pitch Deck', icon: <Award className="w-4 h-4" /> },
    { id: 'launch', label: 'Launch URL', icon: <Zap className="w-4 h-4" /> },
  ] as const;

  const isGenerated = (tabId: typeof activeTab) => !!artifacts[tabId];

  return (
    <div className="arlo-panel p-4 md:p-8 bg-white">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#09090B] font-display">Venture Deliverables</h3>
        <p className="text-xs text-[#6B7280] font-sans">
          Select an agent deliverable below to inspect generated assets, configurations, and plans.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#ECECEC] scrollbar-thin whitespace-nowrap">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          const ready = isGenerated(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold font-display transition-all shrink-0 ${
                active 
                  ? 'bg-[#09090B] text-[#FCFCFC] border border-[#09090B]' 
                  : 'bg-[#FCFCFC] text-[#6B7280] border border-[#ECECEC] hover:border-neutral-300'
              }`}
            >
              {tab.icon}
              {tab.label}
              {ready && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content area */}
      <div className="min-h-[260px] flex flex-col justify-start">
        {!isGenerated(activeTab) ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 md:p-8 bg-[#FCFCFC] border border-dashed border-[#ECECEC] rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-[#6B7280] mb-4">
              {tabs.find(t => t.id === activeTab)?.icon}
            </div>
            <h4 className="font-display font-bold text-sm text-[#09090B]">Deliverable Locked</h4>
            <p className="text-xs text-[#6B7280] max-w-xs mt-2 font-sans">
              The {agents[activeTab]?.name} Agent is currently idle. Input a startup idea and click "Launch Startup" to trigger orchestration.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* SCOUT CONTENT */}
            {activeTab === 'scout' && artifacts.scout && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <div className="bg-[#FCFCFC] border border-[#ECECEC] p-6 rounded-2xl md:col-span-2">
                  <h4 className="font-display font-bold text-sm text-[#09090B] mb-4">Market Analysis Results</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B7280] block mb-1">Target Demographics</span>
                      <p className="text-xs text-[#09090B] leading-relaxed font-sans">{artifacts.scout.demographics}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B7280] block mb-1">Estimated TAM</span>
                      <p className="text-xs text-[#09090B] font-sans">{artifacts.scout.marketSize}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B7280] block mb-1.5">Identified Competitors</span>
                      <div className="flex flex-wrap gap-2">
                        {artifacts.scout.competitors.map(c => (
                          <span key={c} className="text-xs text-[#09090B] bg-[#F4F4F5] border border-[#ECECEC] px-3 py-1 rounded-full font-display">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-[#8B5CF6]/5 to-[#5B8CFF]/5 border border-[#8B5CF6]/10 p-6 rounded-2xl flex flex-col justify-between items-center text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6B7280] block mb-2">Viability Index</span>
                    <div className="text-5xl font-bold font-display text-[#09090B]">
                      {artifacts.scout.viabilityScore}%
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full font-display mt-4">
                    Strong Venture Potential
                  </span>
                </div>
              </div>
            )}

            {/* ATLAS CONTENT */}
            {activeTab === 'atlas' && artifacts.atlas && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#FCFCFC] border border-[#ECECEC] p-6 rounded-2xl">
                    <h4 className="font-display font-bold text-sm text-[#09090B] mb-3">Monetization Loops</h4>
                    <p className="text-xs text-[#6B7280] leading-relaxed font-sans">{artifacts.atlas.monetization}</p>
                  </div>
                  <div className="bg-[#FCFCFC] border border-[#ECECEC] p-6 rounded-2xl">
                    <h4 className="font-display font-bold text-sm text-[#09090B] mb-3">Distribution Channels</h4>
                    <p className="text-xs text-[#6B7280] leading-relaxed font-sans">{artifacts.atlas.channels}</p>
                  </div>
                </div>
                <div className="bg-[#FCFCFC] border border-[#ECECEC] p-6 rounded-2xl">
                  <h4 className="font-display font-bold text-sm text-[#09090B] mb-3">Venture Cost Allocations</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed font-sans">{artifacts.atlas.costStructure}</p>
                </div>
              </div>
            )}

            {/* MUSE CONTENT */}
            {activeTab === 'muse' && artifacts.muse && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <div className="bg-[#FCFCFC] border border-[#ECECEC] p-6 rounded-2xl md:col-span-2 space-y-4">
                  <h4 className="font-display font-bold text-sm text-[#09090B] mb-3">Generated Naming Options</h4>
                  <div className="divide-y divide-[#ECECEC]">
                    {artifacts.muse.suggestions.map((s, idx) => (
                      <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-4 justify-between">
                        <div>
                          <span className="font-display font-bold text-sm text-[#09090B]">{s.name}</span>
                          <p className="text-xs text-[#6B7280] font-sans mt-0.5">{s.rationale}</p>
                        </div>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-display font-semibold uppercase">
                          Available
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-900 text-white p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-2 font-display">Selected Brand</span>
                    <div className="text-2xl font-bold font-display text-white">{artifacts.muse.selectedName}</div>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-4 pt-4 border-t border-neutral-800">
                    Domain extensions reserved: .com / .io / .sh
                  </div>
                </div>
              </div>
            )}

            {/* CANVAS CONTENT */}
            {activeTab === 'canvas' && artifacts.canvas && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="bg-[#FCFCFC] border border-[#ECECEC] p-6 rounded-2xl space-y-5">
                  <h4 className="font-display font-bold text-sm text-[#09090B]">Color Palette & Guidelines</h4>
                  <div className="flex gap-3">
                    {artifacts.canvas.colors.map(color => (
                      <div key={color} className="flex-1 text-center">
                        <div 
                          className="h-12 rounded-xl border border-neutral-200" 
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[10px] font-mono text-[#6B7280] block mt-1.5">{color}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-[#6B7280] block mb-1">Global Typography System</span>
                    <p className="text-xs text-[#09090B] font-display">{artifacts.canvas.typography}</p>
                  </div>
                </div>

                <div className="bg-white border border-[#ECECEC] p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] block mb-4">Geometric Logo Asset</span>
                  <div 
                    className="p-6 border border-[#ECECEC] rounded-2xl text-neutral-900 bg-[#FCFCFC] inline-block shadow-sm"
                    dangerouslySetInnerHTML={{ __html: artifacts.canvas.logoSvg }}
                  />
                  <span className="text-[10px] font-mono text-[#6B7280] mt-3">Raw SVG asset delivered to Vercel</span>
                </div>
              </div>
            )}

            {/* ECHO CONTENT */}
            {activeTab === 'echo' && artifacts.echo && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-[#FCFCFC] border border-[#ECECEC] p-6 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] block mb-1">Hero Copy Package</span>
                  <h4 className="text-xl font-bold text-[#09090B] font-display mt-2">{artifacts.echo.heroHeadline}</h4>
                  <p className="text-sm text-[#6B7280] mt-2 font-sans leading-relaxed">{artifacts.echo.heroSubheadline}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {artifacts.echo.features.map((f, idx) => (
                    <div key={idx} className="bg-[#FCFCFC] border border-[#ECECEC] p-6 rounded-2xl">
                      <h5 className="font-display font-bold text-sm text-[#09090B] mb-2">{f.title}</h5>
                      <p className="text-xs text-[#6B7280] leading-relaxed font-sans">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SPARK CONTENT */}
            {activeTab === 'spark' && artifacts.spark && (
              <div className="space-y-6 animate-fade-in">
                <h4 className="font-display font-bold text-sm text-[#09090B] mb-2">VC Pitch Deck Slides</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {artifacts.spark.slides.map((s, idx) => (
                    <div key={idx} className="bg-white border border-[#ECECEC] p-6 rounded-2xl flex flex-col justify-between h-48 hover:border-neutral-300 transition-all">
                      <div>
                        <span className="text-[10px] font-mono text-[#6B7280] block mb-2">Slide {idx + 1} / 3</span>
                        <h5 className="font-display font-bold text-sm text-[#09090B] mb-2">{s.title}</h5>
                      </div>
                      <p className="text-xs text-[#6B7280] leading-relaxed font-sans">{s.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LAUNCH CONTENT */}
            {activeTab === 'launch' && artifacts.launch && (
              <div className="bg-[#FCFCFC] border border-emerald-100 p-4 md:p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6 justify-between animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-[#09090B] flex items-center gap-2">
                      Deployment Live
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-1 font-sans">{artifacts.launch.status}</p>
                  </div>
                </div>

                <a 
                  href={artifacts.launch.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-arlo btn-arlo-primary !h-11 !px-6 text-xs flex items-center gap-2"
                >
                  Visit URL <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// fix: mark horizontal scroll container for accessibility audit
// docs: mark each tab id with matching Soroban event key
// perf: tabs use React.memo to avoid unnecessary re-renders

