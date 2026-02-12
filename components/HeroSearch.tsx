import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface HeroSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-4xl px-6 text-center">
        
        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            CompetitivePricing<span className="text-blue-600">AI</span>
          </h1>
        </div>

        {/* Value Prop */}
        <h2 className="text-xl md:text-2xl text-gray-600 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Unlock market dominance. We research competitors, analyze cost structures, 
          and determine the perfect pricing strategy for your product or service.
        </h2>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-12 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What product or service do you want to price? (e.g., 'SaaS CRM for Startups' or 'Handmade Leather Wallets')"
            className="w-full pl-14 pr-4 py-5 text-lg bg-white border-2 border-gray-100 rounded-2xl shadow-xl hover:shadow-2xl focus:shadow-2xl focus:border-blue-500 focus:outline-none transition-all duration-300"
            disabled={isLoading}
            autoFocus
          />
          <button 
            type="submit"
            className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            {isLoading ? 'Analyzing...' : 'Research'} 
            {!isLoading && <Sparkles className="w-4 h-4" />}
          </button>
        </form>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Genuine Verification Links</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
             <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>Strategic Positioning</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
            <Search className="w-4 h-4 text-purple-500" />
            <span>Demographic Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
