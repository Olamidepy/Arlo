'use client';

import { motion } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  Type, 
  Palette, 
  MessageSquare, 
  Award, 
  Zap 
} from 'lucide-react';

interface AgentCardProps {
  name: string;
  role: string;
  cost: number;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const AGENTS_LIST: AgentCardProps[] = [
  {
    name: 'Scout',
    role: 'Market Research',
    cost: 12.5,
    description: 'Scrapes data boards, maps TAM/SAM, identifies demographics, and computes market viability indexes.',
    color: '#8B5CF6', // Purple
    icon: <Search className="w-5 h-5" />
  },
  {
    name: 'Atlas',
    role: 'Business Strategy',
    cost: 18.0,
    description: 'Models subscription loops, forecasts COGS/margins, and constructs complete lean business plans.',
    color: '#5B8CFF', // Blue
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    name: 'Muse',
    role: 'Brand Naming',
    cost: 8.5,
    description: 'Explores registries for available domains, details naming rationales, and filters semantic options.',
    color: '#65D6FF', // Cyan
    icon: <Type className="w-5 h-5" />
  },
  {
    name: 'Canvas',
    role: 'Brand Identity',
    cost: 22.0,
    description: 'Drafts Tailwind color parameters, maps geometric typography grids, and packages scalable vector logo assets.',
    color: '#FF8A3D', // Orange
    icon: <Palette className="w-5 h-5" />
  },
  {
    name: 'Echo',
    role: 'Marketing Copy',
    cost: 14.0,
    description: 'Compiles landing page headlines, designs value-prop matrices, and writes conversion CTAs.',
    color: '#FFD166', // Yellow
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    name: 'Spark',
    role: 'Pitch Deck',
    cost: 25.0,
    description: 'Generates VC investment outlines, compiles core presentation slides, and maps traction scorecards.',
    color: '#FF5FA2', // Pink
    icon: <Award className="w-5 h-5" />
  },
  {
    name: 'Launch',
    role: 'Deployment',
    cost: 30.0,
    description: 'Maps global CDN networks, provisions edge hosting, triggers code builds, and verifies DNS security.',
    color: '#10B981', // Green
    icon: <Zap className="w-5 h-5" />
  }
];

export default function AgentGrid() {
  return (
    <section id="agents" className="py-24 relative overflow-hidden">
      {/* Background soft glow blobs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#65D6FF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#FF5FA2]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-wider bg-[#8B5CF6]/8 px-4 py-1.5 rounded-full font-display">
            The Specialists
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-[#09090B] mt-4 font-display">
            Meet the Agents
          </h2>
          <p className="text-[#6B7280] text-lg mt-4 font-sans font-light">
            A squad of autonomous agents, hired and coordinated collaboratively via CROO Agent Protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AGENTS_LIST.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              className="arlo-panel arlo-panel-hover p-8 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Subtle back corner blur */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none opacity-[0.06] blur-[20px]"
                style={{ backgroundColor: agent.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.icon}
                  </div>
                  <span className="text-xs font-semibold text-[#6B7280] bg-[#F4F4F5] px-3 py-1 rounded-full font-display">
                    {agent.cost} XLM / task
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#09090B] font-display flex items-center gap-2">
                    {agent.name}
                    <span className="text-xs font-normal text-[#6B7280]">— {agent.role}</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-[#6B7280] mt-3 font-sans">
                    {agent.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#ECECEC] pt-4 mt-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Stellar Protocol Verified
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
// feat: annotate XLM rate display logic per agent card

