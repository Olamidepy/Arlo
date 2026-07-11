'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ArrowUpRight, Shield, Layers, HelpCircle, Heart } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import AgentGrid from '@/components/landing/AgentGrid';
import Timeline from '@/components/landing/Timeline';
import Faq from '@/components/landing/Faq';
import { useArloStore } from '@/lib/store';

// Import AgentCanvas dynamically to disable SSR (as it requires browser APIs for React Flow canvas)
const AgentCanvas = dynamic(() => import('@/components/landing/AgentCanvas'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const { startOrchestration } = useArloStore();
  const [idea, setIdea] = useState('');

  const handleLaunchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    
    // Set store and transition
    startOrchestration(idea);
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-[#FCFCFC] text-[#09090B] font-sans selection:bg-[#8B5CF6]/10 selection:text-[#8B5CF6]">
      {/* Sticky Blurred Glass Navbar */}
      <Navbar />

      {/* Global Background Gaussian Mesh Glows */}
      <div className="gaussian-gradient-wrapper">
        <div className="blur-blob blob-purple top-[-100px] left-[-200px]" />
        <div className="blur-blob blob-blue top-[15%] right-[-300px]" />
        <div className="blur-blob blob-pink bottom-[20%] left-[-200px]" />
        <div className="blur-blob blob-cyan bottom-[-100px] right-[-100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8B5CF6]/15 bg-[#8B5CF6]/5 text-[#8B5CF6] text-xs font-semibold font-display tracking-tight mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
          Soroban Agent Protocol Orchestrator
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-[#09090B] max-w-4xl font-display leading-[1.05]"
        >
          Launch a Startup with <br className="hidden sm:inline" />
          <span className="text-[#8B5CF6]">an AI Team.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="text-[#6B7280] text-lg md:text-xl font-sans max-w-2xl mt-6 font-light leading-relaxed"
        >
          Arlo assembles specialized AI agents that research, strategize, brand, design, and prepare your startup for launch through autonomous agent-to-agent collaboration powered by Stellar Soroban contracts.
        </motion.p>

        {/* Input Trigger Form */}
        <motion.form
          onSubmit={handleLaunchSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="w-full max-w-lg mt-10 p-2.5 rounded-full border border-[#ECECEC] bg-white shadow-sm flex flex-col sm:flex-row items-stretch gap-2 hover:border-neutral-300 transition-all duration-300"
        >
          <input
            type="text"
            required
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your startup idea (e.g. SaaS invoice tracker)..."
            className="flex-1 bg-transparent px-5 py-3 text-sm text-[#09090B] focus:outline-none placeholder:text-[#6B7280] font-sans"
          />
          <button
            type="submit"
            className="btn-arlo btn-arlo-primary !h-12 !px-6 text-sm flex items-center justify-center gap-2"
          >
            Launch Startup <ArrowRight className="w-4 h-4" />
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 mt-6"
        >
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-medium font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            No coding required
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-medium font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Stellar Soroban escrow settlement
          </div>
        </motion.div>
      </section>

      {/* Hero Visual: Interactive Flow Canvas */}
      <section className="max-w-7xl mx-auto px-6 pb-24 z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        >
          <AgentCanvas />
        </motion.div>
      </section>

      {/* Trusted By Logos */}
      <section className="py-12 border-y border-[#ECECEC] bg-[#FCFCFC] z-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-60">
          <span className="text-xs uppercase font-bold tracking-wider text-[#6B7280] font-display">
            Built for Autonomous Agents
          </span>
          <div className="flex flex-wrap items-center gap-8 sm:gap-12 text-sm font-bold tracking-tight text-[#09090B] font-display">
            <span>STELLAR</span>
            <span>SOROBAN</span>
            <span>STRIPE</span>
            <span>VERCEL</span>
            <span>WALLETCONNECT</span>
            <span>SUPABASE</span>
          </div>
        </div>
      </section>

      {/* Meet the Agents grid */}
      <AgentGrid />

      {/* Chronological Timeline */}
      <Timeline />

      {/* Built on Stellar Soroban Feature Section */}
      <section id="developers" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-semibold text-[#FF8A3D] uppercase tracking-wider bg-[#FF8A3D]/8 px-4 py-1.5 rounded-full font-display">
              Infrastructure
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-[#09090B] font-display">
              Powered by Soroban Smart Contracts
            </h2>
            <p className="text-[#6B7280] text-sm leading-relaxed font-sans font-light">
              Arlo operates directly on Stellar's Soroban smart contract framework, enforcing developer integrity and payments across multiple specialized worker nodes.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#09090B]">Secured Contracts</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed font-sans mt-0.5">
                    Hiring deposits are locked within decentralized contract escrows. If deliverables fail validation, tokens are instantly refunded.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#5B8CFF]/5 border border-[#5B8CFF]/10 flex items-center justify-center text-[#5B8CFF] shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#09090B]">Decoupled Compute</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed font-sans mt-0.5">
                    No single LLM context bottlenecks. Each node executes its specialized logic in isolated sandboxes, communicating peer-to-peer.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7 flex justify-end">
            <div className="arlo-panel p-8 w-full max-w-xl bg-white border border-[#ECECEC] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC]">
                <span className="text-xs font-bold text-[#09090B] font-display">Soroban Smart Contract</span>
                <span className="text-[10px] font-mono text-[#6B7280]">escrow/src/lib.rs</span>
              </div>
              <pre className="text-[11px] leading-relaxed text-[#6B7280] font-mono overflow-x-auto bg-[#FCFCFC] p-4 rounded-xl border border-[#ECECEC]">
{`#[contractimpl]
impl SorobanAgentEscrow {
    pub fn initialize(env: Env, orchestrator: Address, agent: Address, token: Address, amount: i128) {
        // Locks native XLM into contract
        token::Client::new(&env, &token).transfer(&orchestrator, &env.current_contract_address(), &amount);
    }
    pub fn release(env: Env, orchestrator: Address) {
        // Releases locked XLM directly to agent
        token::Client::new(&env, &token).transfer(&env.current_contract_address(), &agent, &amount);
    }
}`}
              </pre>
              <div className="text-[10px] text-[#6B7280] flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D]" />
                Integrate custom agents using standard stellar-cli tools
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-[#ECECEC] relative overflow-hidden bg-white">
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#FF5FA2]/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider bg-[#10B981]/8 px-4 py-1.5 rounded-full font-display">
              Fair Pricing
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-[#09090B] mt-4 font-display">
              Transparent Agent Rates
            </h2>
            <p className="text-[#6B7280] text-sm mt-4 font-sans font-light">
              Pay strictly for the compute complexity your agents consume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Play Plan */}
            <div className="arlo-panel p-8 bg-[#FCFCFC] border border-[#ECECEC] flex flex-col justify-between h-[360px]">
              <div>
                <h3 className="text-lg font-bold text-[#09090B] font-display">Starter Sandbox</h3>
                <p className="text-xs text-[#6B7280] font-sans mt-2">Test orchestration mechanisms with mock balances.</p>
                <div className="text-3xl font-bold text-[#09090B] mt-6 font-display">
                  $0 <span className="text-xs font-normal text-[#6B7280]">/ forever</span>
                </div>
              </div>
              <ul className="text-xs text-[#6B7280] space-y-2 mt-4 font-sans">
                <li className="flex items-center gap-2">✓ 1,000 Mock XLM tokens included</li>
                <li className="flex items-center gap-2">✓ Full landing page and dashboard simulation</li>
                <li className="flex items-center gap-2">✓ Dynamic React Flow charts</li>
              </ul>
              <Link 
                href="/dashboard"
                className="btn-arlo btn-arlo-secondary text-xs w-full text-center mt-6"
              >
                Launch Sandbox
              </Link>
            </div>

            {/* Paid Plan */}
            <div className="arlo-panel p-8 bg-white border-neutral-900 border-2 flex flex-col justify-between h-[360px] relative">
              <span className="absolute -top-3.5 right-6 bg-[#09090B] text-white text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full font-display">
                Enterprise
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#09090B] font-display">Production Node</h3>
                <p className="text-xs text-[#6B7280] font-sans mt-2">Deploy live ventures with verified domain connections.</p>
                <div className="text-3xl font-bold text-[#09090B] mt-6 font-display">
                  $149 <span className="text-xs font-normal text-[#6B7280]">/ venture build</span>
                </div>
              </div>
              <ul className="text-xs text-[#6B7280] space-y-2 mt-4 font-sans">
                <li className="flex items-center gap-2">✓ Actual Soroban agent contract escrow locks</li>
                <li className="flex items-center gap-2">✓ Standard domain mapping (.com / .io)</li>
                <li className="flex items-center gap-2">✓ Code repository handoff and Vercel hosting</li>
              </ul>
              <Link 
                href="/dashboard"
                className="btn-arlo btn-arlo-primary text-xs w-full text-center mt-6"
              >
                Buy Production Credits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <Faq />

      {/* Bottom CTA Card */}
      <section className="py-20 max-w-5xl mx-auto px-6 relative z-10">
        <div className="bg-gradient-to-br from-[#8B5CF6]/5 via-[#5B8CFF]/5 to-[#FF5FA2]/5 border border-[#8B5CF6]/15 rounded-3xl p-10 md:p-16 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#09090B] font-display">
            Ready to Launch Your Next Venture?
          </h2>
          <p className="text-[#6B7280] text-sm md:text-base font-sans max-w-xl mx-auto font-light">
            Input your idea below. Witness our autonomous specialists organize, pay, brand, compile, and deploy your business on the edge.
          </p>
          
          <form 
            onSubmit={handleLaunchSubmit}
            className="w-full max-w-md mx-auto p-2 rounded-full border border-[#ECECEC] bg-white shadow-sm flex flex-col sm:flex-row items-stretch gap-2 hover:border-neutral-300 transition-all duration-300"
          >
            <input
              type="text"
              required
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. AI smart calendar manager..."
              className="flex-1 bg-transparent px-5 py-3 text-xs text-[#09090B] focus:outline-none placeholder:text-[#6B7280] font-sans"
            />
            <button
              type="submit"
              className="btn-arlo btn-arlo-primary !h-10 !px-5 text-xs flex items-center justify-center gap-1.5"
            >
              Build Startup <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ECECEC] bg-[#FCFCFC] py-16 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-[#09090B]">Arlo</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#6B7280] bg-[#ECECEC] px-2 py-0.5 rounded font-display">
              STELLAR
            </span>
          </div>
          
          <p className="text-[11px] text-[#6B7280] font-sans">
            © {new Date().getFullYear()} Arlo Venture Orchestrator. Enabled by Stellar Soroban. Built for independent agent networks.
          </p>

          <div className="flex gap-6 text-xs text-[#6B7280] font-medium font-sans">
            <a href="#" className="hover:text-[#09090B] transition-colors">Documentation</a>
            <a href="#" className="hover:text-[#09090B] transition-colors flex items-center gap-0.5">
              GitHub <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="#" className="hover:text-[#09090B] transition-colors">License</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
