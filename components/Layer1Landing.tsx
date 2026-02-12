import React, { useState } from 'react';
import { Send, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

interface Layer1LandingProps {
  onNext: (query: string) => void;
  initialValue?: string;
}

export const Layer1Landing: React.FC<Layer1LandingProps> = ({ onNext, initialValue = '' }) => {
  const [input, setInput] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onNext(input.trim());
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-white relative overflow-hidden p-6">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-2xl flex flex-col gap-8 animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold tracking-wide border border-blue-100">
                <Sparkles className="w-3 h-3" /> CompetitivePricingAI V3
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Market Intelligence <br/><span className="text-blue-600">Reimagined</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
                Discover genuine competitive pricing in the Indian market. We analyze demographics, verify links, and structure data for you.
            </p>
        </div>

        {/* Input Card */}
        <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-200 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300 transform hover:scale-[1.01]">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="E.g., Gaming Laptop under 1 Lakh, Corporate CRM..."
                    className="flex-1 px-4 py-4 text-lg bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                    autoFocus
                />
                <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ArrowRight className="w-6 h-6" />
                </button>
            </form>
        </div>

        {/* Features / Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {[
                { title: "Real-time Search", desc: "Across Amazon, Flipkart, & more" },
                { title: "Genuine Links", desc: "Direct purchase verification" },
                { title: "Strategic Positioning", desc: "Compare & Analyze value" }
            ].map((f, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                    <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};
