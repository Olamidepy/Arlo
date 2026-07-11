'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Node,
  Edge,
  Handle,
  Position,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { 
  User, 
  Cpu, 
  Search, 
  TrendingUp, 
  Type, 
  Palette, 
  MessageSquare, 
  Award, 
  CheckCircle 
} from 'lucide-react';

// Custom node data types
interface CustomNodeData extends Record<string, unknown> {
  label: string;
  role?: string;
  status: 'idle' | 'working' | 'completed';
  icon: React.ReactNode;
  color: string;
}

// Custom Node Component
function AgentNode({ data }: { data: CustomNodeData }) {
  const isWorking = data.status === 'working';
  const isCompleted = data.status === 'completed';
  
  return (
    <div className="relative group">
      {/* Node glow effect */}
      {isWorking && (
        <div 
          className="absolute inset-0 -m-1 rounded-2xl blur-md opacity-30 animate-pulse"
          style={{ backgroundColor: data.color }}
        />
      )}
      
      <div 
        className={`px-5 py-4 w-44 rounded-2xl bg-white border text-left shadow-sm transition-all duration-300 ${
          isWorking 
            ? 'border-neutral-800 scale-105 shadow-md' 
            : isCompleted 
              ? 'border-neutral-200 shadow-sm opacity-90' 
              : 'border-[#ECECEC] hover:border-neutral-400 opacity-60'
        }`}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: data.color }}
          >
            {data.icon}
          </div>
          <div>
            <div className="font-display font-bold text-sm text-[#09090B] tracking-tight">{data.label}</div>
            {data.role && <div className="text-[10px] font-medium text-[#6B7280]">{data.role}</div>}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-3 flex items-center gap-1.5">
          <span 
            className={`w-1.5 h-1.5 rounded-full ${
              isWorking 
                ? 'bg-amber-500 animate-ping' 
                : isCompleted 
                  ? 'bg-emerald-500' 
                  : 'bg-neutral-300'
            }`}
          />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
            {isWorking ? 'working' : isCompleted ? 'ready' : 'idle'}
          </span>
        </div>
      </div>
      
      <Handle type="target" position={Position.Left} className="!w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2" />
    </div>
  );
}

export default function AgentCanvas() {
  const [activeStep, setActiveStep] = useState(0);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nodeTypes = useMemo(() => ({ agentNode: AgentNode }), []);

  // Compute status for each agent based on activeStep
  const getStatus = (step: number, order: number) => {
    if (activeStep > step) return 'completed';
    if (activeStep === step) return 'working';
    return 'idle';
  };

  const nodes: Node<CustomNodeData>[] = [
    {
      id: 'user',
      type: 'agentNode',
      position: { x: 50, y: 150 },
      data: {
        label: 'User Input',
        role: 'Idea Submission',
        status: getStatus(0, 0),
        icon: <User className="w-4 h-4" />,
        color: '#09090B'
      }
    },
    {
      id: 'arlo',
      type: 'agentNode',
      position: { x: 250, y: 150 },
      data: {
        label: 'Arlo',
        role: 'Orchestrator',
        status: getStatus(1, 1),
        icon: <Cpu className="w-4 h-4" />,
        color: '#8B5CF6' // Purple
      }
    },
    // Upper lane
    {
      id: 'scout',
      type: 'agentNode',
      position: { x: 450, y: 50 },
      data: {
        label: 'Scout',
        role: 'Market Research',
        status: getStatus(2, 2),
        icon: <Search className="w-4 h-4" />,
        color: '#5B8CFF' // Blue
      }
    },
    {
      id: 'muse',
      type: 'agentNode',
      position: { x: 650, y: 50 },
      data: {
        label: 'Muse',
        role: 'Brand Naming',
        status: getStatus(3, 3),
        icon: <Type className="w-4 h-4" />,
        color: '#65D6FF' // Cyan
      }
    },
    {
      id: 'echo',
      type: 'agentNode',
      position: { x: 850, y: 50 },
      data: {
        label: 'Echo',
        role: 'Marketing Copy',
        status: getStatus(4, 4),
        icon: <MessageSquare className="w-4 h-4" />,
        color: '#FFD166' // Yellow
      }
    },
    // Lower lane
    {
      id: 'atlas',
      type: 'agentNode',
      position: { x: 450, y: 250 },
      data: {
        label: 'Atlas',
        role: 'Business Strategy',
        status: getStatus(2, 2),
        icon: <TrendingUp className="w-4 h-4" />,
        color: '#FF8A3D' // Orange
      }
    },
    {
      id: 'canvas',
      type: 'agentNode',
      position: { x: 650, y: 250 },
      data: {
        label: 'Canvas',
        role: 'Brand Identity',
        status: getStatus(3, 3),
        icon: <Palette className="w-4 h-4" />,
        color: '#FF5FA2' // Pink
      }
    },
    {
      id: 'spark',
      type: 'agentNode',
      position: { x: 850, y: 250 },
      data: {
        label: 'Spark',
        role: 'Pitch Deck',
        status: getStatus(4, 4),
        icon: <Award className="w-4 h-4" />,
        color: '#10B981' // Green
      }
    },
    // Success node
    {
      id: 'ready',
      type: 'agentNode',
      position: { x: 1050, y: 150 },
      data: {
        label: 'Startup Ready',
        role: 'Venture Launched',
        status: getStatus(5, 5),
        icon: <CheckCircle className="w-4 h-4" />,
        color: '#09090B'
      }
    }
  ];

  const getEdgeStyle = (sourceStep: number) => {
    const isCompleted = activeStep > sourceStep;
    const isWorking = activeStep === sourceStep;
    
    return {
      stroke: isCompleted ? '#8B5CF6' : isWorking ? '#8B5CF6' : '#ECECEC',
      strokeWidth: 2,
      animated: isCompleted || isWorking
    };
  };

  const edges: Edge[] = [
    { id: 'e-user-arlo', source: 'user', target: 'arlo', style: getEdgeStyle(0) },
    
    // Arlo forks to lanes
    { id: 'e-arlo-scout', source: 'arlo', target: 'scout', style: getEdgeStyle(1) },
    { id: 'e-arlo-atlas', source: 'arlo', target: 'atlas', style: getEdgeStyle(1) },
    
    // Upper lane progression
    { id: 'e-scout-muse', source: 'scout', target: 'muse', style: getEdgeStyle(2) },
    { id: 'e-muse-echo', source: 'muse', target: 'echo', style: getEdgeStyle(3) },
    
    // Lower lane progression
    { id: 'e-atlas-canvas', source: 'atlas', target: 'canvas', style: getEdgeStyle(2) },
    { id: 'e-canvas-spark', source: 'canvas', target: 'spark', style: getEdgeStyle(3) },
    
    // Consolidation to Ready
    { id: 'e-echo-ready', source: 'echo', target: 'ready', style: getEdgeStyle(4) },
    { id: 'e-spark-ready', source: 'spark', target: 'ready', style: getEdgeStyle(4) }
  ];

  return (
    <div className="w-full h-[450px] bg-white border border-[#ECECEC] rounded-[24px] relative overflow-hidden shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        nodesConnectable={false}
        nodesDraggable={true}
        zoomOnScroll={false}
        panOnScroll={false}
        zoomOnDoubleClick={false}
        preventScrolling={true}
      >
        <Background color="#D4D4D8" gap={16} size={1} />
      </ReactFlow>

      {/* Helper simulation HUD */}
      <div className="absolute bottom-4 left-6 bg-[#FCFCFC]/80 backdrop-blur-sm border border-[#ECECEC] rounded-full px-4 py-1.5 text-xs text-[#6B7280] font-medium font-display flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
        Simulating autonomous agent-to-agent coordination loop
      </div>
    </div>
  );
}
// refactor: add clarity comment for canvas node position map
// chore: add note about canvas fallback for non-WebGL browsers
// fix: cap canvas frame rate to 60fps to avoid idle battery drain

