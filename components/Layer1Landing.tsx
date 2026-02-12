import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

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
      {/* Minimal Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f3f4f6_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-xl flex flex-col gap-10 animate-in fade-in zoom-in duration-700">
        
        {/* Minimal Header */}
        <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
                Pricing Intelligence
            </h1>
        </div>

        {/* Minimal Input */}
        <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-white p-1 rounded-2xl shadow-sm border border-gray-100 focus-within:border-gray-300 focus-within:shadow-md transition-all duration-300">
                <form onSubmit={handleSubmit} className="flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search product or service..."
                        className="flex-1 px-6 py-4 text-lg bg-transparent border-none outline-none text-gray-900 placeholder-gray-300 font-normal"
                        autoFocus
                    />
                    <button 
                        type="submit"
                        disabled={!input.trim()}
                        className="p-3 mr-1 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform active:scale-95"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
};
