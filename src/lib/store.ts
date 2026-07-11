import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AgentId = 'scout' | 'atlas' | 'muse' | 'canvas' | 'echo' | 'spark' | 'launch';

export interface AgentInfo {
  id: AgentId;
  name: string;
  role: string;
  cost: number;
  description: string;
  status: 'idle' | 'hired' | 'working' | 'paid' | 'completed';
  color: string;
  escrowContractId: string;
  stellarAddress: string;
}

export interface StellarTransaction {
  id: string; // 64-char transaction hash
  from: string;
  to: string;
  amount: number;
  type: 'deposit' | 'release' | 'refund';
  agentId?: AgentId;
  timestamp: number;
  ledgerSeq: number;
}

export interface VentureArtifacts {
  scout?: {
    demographics: string;
    marketSize: string;
    competitors: string[];
    viabilityScore: number;
  };
  atlas?: {
    monetization: string;
    channels: string;
    costStructure: string;
  };
  muse?: {
    suggestions: { name: string; rationale: string }[];
    selectedName: string;
  };
  canvas?: {
    colors: string[];
    typography: string;
    logoSvg: string;
  };
  echo?: {
    heroHeadline: string;
    heroSubheadline: string;
    features: { title: string; description: string }[];
  };
  spark?: {
    slides: { title: string; content: string }[];
  };
  launch?: {
    url: string;
    status: string;
  };
}

export interface LiveLog {
  id: string;
  timestamp: number;
  agentId?: AgentId;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'code';
}

interface ArloState {
  // Venture info
  startupIdea: string;
  isOrchestrating: boolean;
  activeAgentId: AgentId | null;
  stepIndex: number;
  progress: number; // 0 to 100
  
  // Wallet
  xlmWalletBalance: number;
  walletAddress: string;
  
  // Core agents data
  agents: Record<AgentId, AgentInfo>;
  
  // Simulation lists
  logs: LiveLog[];
  transactions: StellarTransaction[];
  artifacts: VentureArtifacts;
  
  // Actions
  startOrchestration: (idea: string) => void;
  resetOrchestration: () => void;
  addLog: (message: string, agentId?: AgentId, type?: LiveLog['type']) => void;
  addTransaction: (tx: Omit<StellarTransaction, 'id' | 'timestamp'>) => void;
  setAgentStatus: (agentId: AgentId, status: AgentInfo['status']) => void;
}

const INITIAL_AGENTS: Record<AgentId, AgentInfo> = {
  scout: {
    id: 'scout',
    name: 'Scout',
    role: 'Market Research',
    cost: 45.0,
    description: 'Conducts market sizing, demographic targeting, and analyzes competitors.',
    status: 'idle',
    color: '#8B5CF6', // Electric Purple
    escrowContractId: 'CC7R2X2V6G2L3P2M6F5N4B2Y1V0M8K9J0X1Z2W3Y4X5P6Q7R8S9T0U1V',
    stellarAddress: 'GCSCOUT3W7U43XG77RQL7O63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3'
  },
  atlas: {
    id: 'atlas',
    name: 'Atlas',
    role: 'Business Strategy',
    cost: 60.0,
    description: 'Generates business canvas models, pricing strategy, and cost analysis.',
    status: 'idle',
    color: '#5B8CFF', // Royal Blue
    escrowContractId: 'CC3W7U43XG77RQL7O63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3O4P5Q',
    stellarAddress: 'GCATLASW7U43XG77RQL7O63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3'
  },
  muse: {
    id: 'muse',
    name: 'Muse',
    role: 'Brand Naming',
    cost: 25.0,
    description: 'Generates unique brand names, checks domain extensions, and details semantic rationale.',
    status: 'idle',
    color: '#65D6FF', // Soft Cyan
    escrowContractId: 'CCMUSE43XG77RQL7O63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3O4P5Q',
    stellarAddress: 'GCMUSEW7U43XG77RQL7O63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3'
  },
  canvas: {
    id: 'canvas',
    name: 'Canvas',
    role: 'Brand Identity',
    cost: 80.0,
    description: 'Builds color palettes, defines typography systems, and outputs vector logo specs.',
    status: 'idle',
    color: '#FF8A3D', // Warm Orange
    escrowContractId: 'CCCANVASG77RQL7O63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3O4P5Q',
    stellarAddress: 'GCCANVAS7U43XG77RQL7O63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3'
  },
  echo: {
    id: 'echo',
    name: 'Echo',
    role: 'Marketing Copy',
    cost: 40.0,
    description: 'Writes conversion-optimized copywriting for landing pages, ads, and product descriptions.',
    status: 'idle',
    color: '#FFD166', // Golden Yellow
    escrowContractId: 'CCECHOO63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1',
    stellarAddress: 'GCECHOW7U43XG77RQL7O63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3'
  },
  spark: {
    id: 'spark',
    name: 'Spark',
    role: 'Pitch Deck',
    cost: 90.0,
    description: 'Assembles full venture pitch decks for early stage seed investments.',
    status: 'idle',
    color: '#FF5FA2', // Soft Pink
    escrowContractId: 'CCSPARK5C3E2D4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6',
    stellarAddress: 'GCSPARK7U43XG77RQL7O63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3'
  },
  launch: {
    id: 'launch',
    name: 'Launch',
    role: 'Deployment',
    cost: 110.0,
    description: 'Configures cloud hosting, maps domains, and establishes DNS records.',
    status: 'idle',
    color: '#10B981', // Emerald Green
    escrowContractId: 'CCLAUNCH1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5',
    stellarAddress: 'GCLAUNCHU43XG77RQL7O63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3'
  }
};

const AGENT_ORDER: AgentId[] = ['scout', 'atlas', 'muse', 'canvas', 'echo', 'spark', 'launch'];

const SIMULATED_ARTIFACTS = (idea: string): VentureArtifacts => {
  const cleanIdea = idea.trim();
  const baseName = cleanIdea.split(' ')[0] || 'Venture';
  return {
    scout: {
      demographics: 'Tech-savvy early adopters, developer teams, and small to medium SaaS businesses looking to automate workflows.',
      marketSize: '$15.4B TAM globally, with an estimated CAGR of 16.8% over the next 5 years.',
      competitors: ['Linear', 'Stripe', 'OpenRouter', 'Retool'],
      viabilityScore: 92
    },
    atlas: {
      monetization: 'Freemium tier, Pro tier ($29/user/month), and Enterprise licensing based on volume.',
      channels: 'Product-led growth, developer advocate campaigns, and community integrations.',
      costStructure: '75% AI API compute costs, 15% infrastructure fees, 10% marketing outreach.'
    },
    muse: {
      suggestions: [
        { name: `${baseName}flow`, rationale: `Blends the core concept of "${baseName}" with smooth developer workflows.` },
        { name: `Arlo${baseName.substring(0, 4)}`, rationale: 'Combines the Arlo orchestrator prefix with the business concept.' },
        { name: `Aether${baseName.substring(0, 3)}`, rationale: 'Imparts a feeling of light, high-performance execution.' }
      ],
      selectedName: `${baseName}flow`
    },
    canvas: {
      colors: ['#09090B', '#FCFCFC', '#8B5CF6', '#5B8CFF'],
      typography: 'Space Grotesk & Inter',
      logoSvg: `<svg viewBox="0 0 100 100" class="w-16 h-16"><rect x="25" y="25" width="50" height="50" rx="16" fill="none" stroke="currentColor" stroke-width="6"/><path d="M40 50h20M50 40v20" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>`
    },
    echo: {
      heroHeadline: `Accelerate Your ${baseName} Development`,
      heroSubheadline: `Arlo specialized AI agent teams built, branded, and launched this project to automate your startup roadmap.`,
      features: [
        { title: 'Instant Launch', description: 'Zero boilerplate setup. Your application goes from idea to live deployment in minutes.' },
        { title: 'Secure Infrastructure', description: 'Built-in security audits and token-gate permissions ready out-of-the-box.' }
      ]
    },
    spark: {
      slides: [
        { title: 'The Problem', content: 'Building a new venture requires hiring designers, copywriters, and developers, delaying product-market fit.' },
        { title: 'The Solution', content: 'Autonomous coordination of specialized AI agents that build and deploy startups collaboratively over Stellar Soroban.' },
        { title: 'The Traction', content: 'Launching beta nodes across Stellar network and sandbox ledgers, servicing 500+ trial startups.' }
      ]
    },
    launch: {
      url: `https://${baseName.toLowerCase()}flow.arlo.sh`,
      status: 'DNS mapped, SSL certified, deployed on Vercel Edge Server network.'
    }
  };
};

// Generates a mock 64-char transaction hash for Stellar
const generateTxHash = () => {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

export const useArloStore = create<ArloState>()(
  persist(
    (set, get) => ({
      startupIdea: '',
      isOrchestrating: false,
      activeAgentId: null,
      stepIndex: 0,
      progress: 0,
      
      xlmWalletBalance: 1000.0, // Initial balance in native XLM
      walletAddress: 'GD3W7U43XG77RQL7O63H4H5S6E5C3E2D4F5G6H7I8J9K0L1M2N3O4P5Q',
      
      agents: INITIAL_AGENTS,
      logs: [
        {
          id: 'init',
          timestamp: Date.now(),
          message: 'Arlo AI Startup Engine online on Stellar Network. Standing by for idea...',
          type: 'info'
        }
      ],
      transactions: [],
      artifacts: {},
      
      addLog: (message, agentId, type = 'info') => set((state) => ({
        logs: [
          {
            id: Math.random().toString(36).substring(2, 11),
            timestamp: Date.now(),
            agentId,
            message,
            type
          },
          ...state.logs
        ]
      })),
      
      addTransaction: (tx) => set((state) => ({
        transactions: [
          {
            ...tx,
            id: generateTxHash(),
            timestamp: Date.now()
          },
          ...state.transactions
        ]
      })),
      
      setAgentStatus: (agentId, status) => set((state) => ({
        agents: {
          ...state.agents,
          [agentId]: {
            ...state.agents[agentId],
            status
          }
        }
      })),
      
      startOrchestration: async (idea) => {
        const state = get();
        if (state.isOrchestrating) return;
        
        // Reset state for new run
        set({
          startupIdea: idea,
          isOrchestrating: true,
          activeAgentId: null,
          stepIndex: 0,
          progress: 0,
          artifacts: {},
          agents: Object.keys(INITIAL_AGENTS).reduce((acc, key) => {
            acc[key as AgentId] = { ...INITIAL_AGENTS[key as AgentId], status: 'idle' };
            return acc;
          }, {} as Record<AgentId, AgentInfo>)
        });
        
        get().addLog(`Kicking off orchestration on Stellar network for: "${idea}"`, undefined, 'info');
        get().addLog('Querying Horizon network directory for verified agent contract addresses...', undefined, 'info');
        
        const generatedArtifacts = SIMULATED_ARTIFACTS(idea);
        let baseLedgerSeq = 45912401;
        
        const runAgentStep = async (idx: number) => {
          if (idx >= AGENT_ORDER.length) {
            set({
              isOrchestrating: false,
              activeAgentId: null,
              progress: 100
            });
            get().addLog('Venture orchestration complete! Startup is launch-ready and all escrows released.', undefined, 'success');
            return;
          }
          
          const agentId = AGENT_ORDER[idx];
          const agent = get().agents[agentId];
          const currentLedger = baseLedgerSeq + idx * 2;
          
          set({ activeAgentId: agentId, stepIndex: idx, progress: Math.floor((idx / AGENT_ORDER.length) * 100) });
          
          // 1. Setup Soroban Escrow Contract
          get().setAgentStatus(agentId, 'hired');
          get().addLog(`Soroban Escrow: Initializing contract deployment for ${agent.name}...`, agentId, 'info');
          get().addLog(`stellar contract deploy --wasm build/soroban_agent_escrow.wasm --source arlo_wallet --network testnet`, agentId, 'code');
          
          await new Promise(resolve => setTimeout(resolve, 800));
          
          get().addLog(`Contract instance deployed at ID: ${agent.escrowContractId.substring(0, 16)}...`, agentId, 'success');
          
          // 2. Fund the Escrow (Deposit)
          get().addLog(`Soroban Escrow: Locking payment of ${agent.cost} XLM for ${agent.role}...`, agentId, 'info');
          get().addLog(`stellar contract invoke --id ${agent.escrowContractId.substring(0, 8)}... --source arlo_wallet --network testnet --initialize --orchestrator ${get().walletAddress.substring(0, 8)}... --agent ${agent.stellarAddress.substring(0, 8)}... --amount ${agent.cost}`, agentId, 'code');
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Deduct from balance
          set((state) => ({ xlmWalletBalance: Number((state.xlmWalletBalance - agent.cost).toFixed(2)) }));
          get().addTransaction({
            from: get().walletAddress,
            to: agent.escrowContractId,
            amount: agent.cost,
            type: 'deposit',
            agentId,
            ledgerSeq: currentLedger
          });
          
          get().setAgentStatus(agentId, 'paid');
          get().addLog(`Funds successfully locked in escrow contract. Ledger Seq: ${currentLedger}`, agentId, 'success');
          
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // 3. Agent Working
          get().setAgentStatus(agentId, 'working');
          get().addLog(`${agent.name} accepted task. Commencing compilation for venture...`, agentId, 'info');
          
          // Specific logs for each agent type to make it feel extremely alive
          if (agentId === 'scout') {
            get().addLog('Scout: Querying TAM statistics, analyzing competitive landscape index, formatting developer profiles.', agentId, 'code');
            await new Promise(resolve => setTimeout(resolve, 1200));
            get().addLog('Scout: TAM sizing complete. Competitor map established. Viability score: 92/100.', agentId, 'info');
          } else if (agentId === 'atlas') {
            get().addLog('Atlas: Designing monetization schedules, computing hosting thresholds, structuring SaaS costs.', agentId, 'code');
            await new Promise(resolve => setTimeout(resolve, 1200));
            get().addLog('Atlas: 3-tier monetization framework and Lean Strategy Canvas structured.', agentId, 'info');
          } else if (agentId === 'muse') {
            get().addLog('Muse: Scoring brand semantic availability, scanning WHOIS entries for domains, filtering suggestions.', agentId, 'code');
            await new Promise(resolve => setTimeout(resolve, 1200));
            get().addLog(`Muse: Naming recommendations compiled. Selected candidate: "${generatedArtifacts.muse?.selectedName}"`, agentId, 'info');
          } else if (agentId === 'canvas') {
            get().addLog('Canvas: Creating brand assets, exporting typography parameters, rendering raw SVG logos.', agentId, 'code');
            await new Promise(resolve => setTimeout(resolve, 1200));
            get().addLog('Canvas: Geometric vector logo and CSS/Tailwind variables packaged successfully.', agentId, 'info');
          } else if (agentId === 'echo') {
            get().addLog('Echo: Compiling SEO metadata tags, structuring core value propositions, composing marketing copy.', agentId, 'code');
            await new Promise(resolve => setTimeout(resolve, 1200));
            get().addLog('Echo: Landing page copywriting and layout feature copy finished.', agentId, 'info');
          } else if (agentId === 'spark') {
            get().addLog('Spark: Arranging pitch presentation layouts, compiling financial milestones, drafting problem/solution slides.', agentId, 'code');
            await new Promise(resolve => setTimeout(resolve, 1200));
            get().addLog('Spark: VC pitch presentation compiled (3 slides).', agentId, 'info');
          } else if (agentId === 'launch') {
            get().addLog('Launch: Spinning up Vercel production server, checking DNS mappings, deploying SSL configs.', agentId, 'code');
            await new Promise(resolve => setTimeout(resolve, 1200));
            get().addLog(`Launch: Live web app successfully deployed at: ${generatedArtifacts.launch?.url}`, agentId, 'success');
          }
          
          // 4. Complete Agent Task (Release)
          set((state) => ({
            artifacts: {
              ...state.artifacts,
              [agentId]: generatedArtifacts[agentId]
            }
          }));
          get().setAgentStatus(agentId, 'completed');
          get().addLog(`Deliverables verified. Triggering Soroban escrow release to ${agent.name}...`, agentId, 'success');
          get().addLog(`stellar contract invoke --id ${agent.escrowContractId.substring(0, 8)}... --source arlo_wallet --network testnet --release --orchestrator ${get().walletAddress.substring(0, 8)}...`, agentId, 'code');
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          get().addTransaction({
            from: agent.escrowContractId,
            to: agent.stellarAddress,
            amount: agent.cost,
            type: 'release',
            agentId,
            ledgerSeq: currentLedger + 1
          });
          get().addLog(`Escrow released. Transfer of ${agent.cost} XLM from contract to ${agent.name} verified in Ledger ${currentLedger + 1}`, agentId, 'success');
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Next step
          runAgentStep(idx + 1);
        };
        
        runAgentStep(0);
      },
      
      resetOrchestration: () => set({
        startupIdea: '',
        isOrchestrating: false,
        activeAgentId: null,
        stepIndex: 0,
        progress: 0,
        xlmWalletBalance: 1000.0,
        agents: INITIAL_AGENTS,
        logs: [
          {
            id: 'init-reset',
            timestamp: Date.now(),
            message: 'Arlo AI Startup Engine reset. Ready for business idea...',
            type: 'info'
          }
        ],
        transactions: [],
        artifacts: {}
      })
    }),
    {
      name: 'arlo-venture-storage',
      partialize: (state) => ({
        startupIdea: state.startupIdea,
        xlmWalletBalance: state.xlmWalletBalance,
        transactions: state.transactions,
        artifacts: state.artifacts,
        logs: state.logs
      })
    }
  )
);
// refactor: document Stellar address generation mock strategy

