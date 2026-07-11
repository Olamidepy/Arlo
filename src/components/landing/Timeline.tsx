'use client';

import { motion } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  Type, 
  Palette, 
  MessageSquare, 
  Award, 
  Zap, 
  Check 
} from 'lucide-react';

interface TimelineItem {
  time: string;
  agent: string;
  role: string;
  message: string;
  icon: React.ReactNode;
  color: string;
}

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    time: '09:42',
    agent: 'Scout',
    role: 'Market Research',
    message: 'Accepted task. Synthesized Google search query indices, scanned developer repositories, and mapped TAM limits.',
    icon: <Search className="w-4 h-4" />,
    color: '#8B5CF6'
  },
  {
    time: '09:44',
    agent: 'Atlas',
    role: 'Business Strategy',
    message: 'Authorized business strategy parameters. Generated SaaS cost margins and configured Lean Canvas modules.',
    icon: <TrendingUp className="w-4 h-4" />,
    color: '#5B8CFF'
  },
  {
    time: '09:46',
    agent: 'Muse',
    role: 'Brand Naming',
    message: 'Completed registrar queries. Screened semantic availability, validated .io/.sh domains, and proposed base names.',
    icon: <Type className="w-4 h-4" />,
    color: '#65D6FF'
  },
  {
    time: '09:48',
    agent: 'Canvas',
    role: 'Brand Identity',
    message: 'Delivered brand system. Exported Tailwind color parameters and built custom geometric SVG vector logos.',
    icon: <Palette className="w-4 h-4" />,
    color: '#FF8A3D'
  },
  {
    time: '09:50',
    agent: 'Echo',
    role: 'Marketing Copy',
    message: 'Compiled landing copy. Created value propositions, hero headlines, features grids, and optimized call-to-actions.',
    icon: <MessageSquare className="w-4 h-4" />,
    color: '#FFD166'
  },
  {
    time: '09:54',
    agent: 'Spark',
    role: 'Pitch Deck',
    message: 'Prepared VC presentation slides. Compiled key problem/solution frameworks and modeled traction sheets.',
    icon: <Award className="w-4 h-4" />,
    color: '#FF5FA2'
  },
  {
    time: '09:55',
    agent: 'Launch',
    role: 'Deployment',
    message: 'Deployment finalized on Vercel. Configured CDN cache layers, mapped custom domain pointers, and verified SSL.',
    icon: <Zap className="w-4 h-4" />,
    color: '#10B981'
  }
];

export default function Timeline() {
  return (
    <section id="how-it-works" className="py-24 bg-white border-y border-[#ECECEC] relative">
      {/* Background Soft Gaussian Blurs */}
      <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-[#8B5CF6]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#5B8CFF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-xs font-semibold text-[#5B8CFF] uppercase tracking-wider bg-[#5B8CFF]/8 px-4 py-1.5 rounded-full font-display">
            Orchestration Workflow
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-[#09090B] mt-4 font-display">
            Chronological Timeline
          </h2>
          <p className="text-[#6B7280] text-lg mt-4 font-sans font-light">
            Observe the automatic handoffs and Stellar Soroban settlements that construct your venture.
          </p>
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 sm:left-1/2 top-2 bottom-2 w-[1px] bg-[#ECECEC] transform -translate-x-1/2" />

          <div className="space-y-16">
            {TIMELINE_ITEMS.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={item.agent}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 }}
                  className={`flex flex-col sm:flex-row items-stretch relative ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge (Timeline Circle) */}
                  <div className="absolute left-6 sm:left-1/2 top-4 transform -translate-x-1/2 z-10 flex items-center justify-center">
                    <div 
                      className="w-10 h-10 rounded-full bg-white border border-[#ECECEC] flex items-center justify-center text-white shadow-sm"
                      style={{ borderColor: item.color }}
                    >
                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.icon}
                      </div>
                    </div>
                  </div>

                  {/* Spacer Column (Desktop only) */}
                  <div className="hidden sm:block w-1/2" />

                  {/* Content Column */}
                  <div className="w-full sm:w-1/2 pl-16 sm:pl-0 sm:px-12 flex flex-col justify-start">
                    <div className="bg-[#FCFCFC] border border-[#ECECEC] p-6 rounded-2xl relative hover:border-neutral-300 transition-all duration-300">
                      {/* Triangle Pointer for Desktop */}
                      <div 
                        className={`hidden sm:block absolute top-6 w-3 h-3 bg-[#FCFCFC] border-t border-l border-[#ECECEC] transform rotate-45 ${
                          isEven 
                            ? 'left-full -translate-x-1.5 border-t-0 border-l-0 border-r border-b' 
                            : 'right-full translate-x-1.5'
                        }`}
                      />
                      
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-[#09090B] text-base">{item.agent}</span>
                          <span className="text-xs text-[#6B7280] font-sans">— {item.role}</span>
                        </div>
                        <span className="font-display font-semibold text-xs text-[#6B7280] bg-[#F4F4F5] px-2.5 py-0.5 rounded">
                          {item.time} AM
                        </span>
                      </div>
                      
                      <p className="text-xs text-[#6B7280] leading-relaxed font-sans">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Launch Ready Success Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex justify-center relative pt-8"
            >
              <div className="absolute left-6 sm:left-1/2 top-0 h-8 w-[1px] bg-[#ECECEC] transform -translate-x-1/2" />
              
              <div className="z-10 bg-emerald-50 border border-emerald-200 px-6 py-3 rounded-full flex items-center gap-2.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-display font-bold text-emerald-800 text-sm tracking-tight">
                  Venture Launched Successfully
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
// docs: annotate each timeline milestone key

