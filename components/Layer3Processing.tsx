import React, { useEffect, useState } from 'react';
import { AgentStage } from '../types';
import { Search, Brain, Target, Database, Check, Loader2, ArrowLeft } from 'lucide-react';

interface Layer3ProcessingProps {
  onBack: () => void;
}

const AGENTS = [
    { id: 'gathering', name: 'Agent 1: Information Gathering', icon: Search, desc: 'Scanning Amazon, Flipkart, & Retailers...' },
    { id: 'analysis', name: 'Agent 2: Competitive Analysis', icon: Database, desc: 'Extracting specs, pricing, and genuine links...' },
    { id: 'positioning', name: 'Agent 3: Positioning Strategy', icon: Target, desc: 'Calculating market fit and premium status...' },
    { id: 'intelligence', name: 'Agent 4: Market Intelligence', icon: Brain, desc: 'Identifying substitutes and best deals...' },
];

export const Layer3Processing: React.FC<Layer3ProcessingProps> = ({ onBack }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        // Slow down as it gets closer to 100 to wait for actual API
        const increment = prev > 80 ? 0.2 : 1.5; 
        return prev + increment;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate agent switching based on progress roughly
    if (progress < 25) setActiveStageIndex(0);
    else if (progress < 50) setActiveStageIndex(1);
    else if (progress < 75) setActiveStageIndex(2);
    else setActiveStageIndex(3);
  }, [progress]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
        {/* Back Button */}
        <button 
            onClick={onBack}
            className="absolute top-6 left-6 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-500 z-20 border border-gray-200"
            title="Back to Refinement"
        >
            <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Progress Bar Top */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-200">
            <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
        
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
            
            {/* Visualizer Circle */}
            <div className="flex flex-col items-center justify-center text-center">
                <div className="relative w-48 h-48 mb-8">
                    {/* Pulsing Rings */}
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse opacity-40"></div>
                    
                    {/* Center Content */}
                    <div className="absolute inset-2 bg-white rounded-full shadow-2xl flex items-center justify-center border border-gray-100">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-blue-600">{Math.round(progress)}%</span>
                            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Processing</span>
                        </div>
                    </div>

                    {/* Orbiting Dot */}
                    <div className="absolute inset-0 animate-spin [animation-duration:3s]">
                        <div className="w-4 h-4 bg-blue-600 rounded-full absolute -top-2 left-1/2 -translate-x-1/2 shadow-lg shadow-blue-400"></div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Orchestrating Agents</h2>
                <p className="text-gray-500">Master Agent is consolidating data...</p>
            </div>

            {/* Agent List */}
            <div className="space-y-4">
                {AGENTS.map((agent, index) => {
                    const isActive = index === activeStageIndex;
                    const isCompleted = index < activeStageIndex;
                    const Icon = agent.icon;

                    return (
                        <div 
                            key={agent.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                                isActive 
                                ? 'bg-white border-blue-500 shadow-md scale-105' 
                                : isCompleted 
                                    ? 'bg-gray-50 border-gray-200 opacity-60' 
                                    : 'bg-white border-gray-100 opacity-40'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isActive ? 'bg-blue-100 text-blue-600' : isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold text-sm ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {agent.name}
                                </h3>
                                <p className="text-xs text-gray-500 truncate">
                                    {isActive ? <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> {agent.desc}</span> : agent.desc}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  );
};
