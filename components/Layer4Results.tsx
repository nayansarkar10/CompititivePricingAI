import React, { useState } from 'react';
import { AnalysisResult, PricingItem } from '../types';
import { ArrowUp, ArrowDown, ExternalLink, CheckCircle2, Tag, Flame, Star, RefreshCw, ArrowLeft, FileText, Home } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Layer4ResultsProps {
  result: AnalysisResult;
  onBack: () => void;
  onHome: () => void;
  query: string;
}

export const Layer4Results: React.FC<Layer4ResultsProps> = ({ result, onBack, onHome, query }) => {
  const [activeView, setActiveView] = useState<'table' | 'report'>('table');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const sortedData = [...result.data].sort((a, b) => {
    return sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
  });

  const toggleSort = () => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');

  const formatPrice = (price: number, currency: string) => {
      let code = currency.toUpperCase();
      if (currency === '$') code = 'USD';
      if (currency === '₹') code = 'INR';
      const locale = code === 'INR' ? 'en-IN' : 'en-US';
      try {
          return new Intl.NumberFormat(locale, { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(price);
      } catch (e) {
          return `${currency} ${price}`;
      }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm flex-shrink-0">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack} 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    title="Back"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        Market Analysis <span className="text-xs font-normal text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">{query}</span>
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveView('table')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeView === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Table
                    </button>
                    <button 
                        onClick={() => setActiveView('report')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeView === 'report' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Report
                    </button>
                </div>
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                 <button 
                    onClick={onHome} 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    title="New Search"
                >
                    <Home className="w-5 h-5" />
                </button>
            </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
            
            {activeView === 'table' && (
                <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
                     {/* Stats Row */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Lowest Price</span>
                            <div className="text-2xl font-bold text-green-600 mt-1">
                                {result.data.length > 0 ? formatPrice(Math.min(...result.data.map(d => d.price)), result.data[0].currency) : '-'}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Average Market Price</span>
                            <div className="text-2xl font-bold text-blue-600 mt-1">
                                {result.data.length > 0 
                                    ? formatPrice(result.data.reduce((a, b) => a + b.price, 0) / result.data.length, result.data[0].currency) 
                                    : '-'}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Highest Price</span>
                            <div className="text-2xl font-bold text-purple-600 mt-1">
                                {result.data.length > 0 ? formatPrice(Math.max(...result.data.map(d => d.price)), result.data[0].currency) : '-'}
                            </div>
                        </div>
                     </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Company / Product</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">USP & Specs</th>
                                <th 
                                className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors text-right"
                                onClick={toggleSort}
                                >
                                <div className="flex items-center justify-end gap-1">
                                    Price
                                    {sortOrder === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                                </div>
                                </th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {sortedData.map((item, idx) => (
                                <tr key={idx} className={`hover:bg-blue-50/20 transition-colors group ${item.isBestDeal ? 'bg-yellow-50/30' : ''}`}>
                                <td className="py-4 px-6 align-top">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 text-sm">{item.company}</span>
                                            {item.isBestDeal && <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1"><Flame className="w-3 h-3" /> HOT DEAL</span>}
                                        </div>
                                        {item.brand && item.brand !== item.company && (
                                            <span className="text-xs text-gray-500 mt-1">{item.brand}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-6 align-top">
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2 text-sm text-gray-600">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-xs leading-relaxed font-medium">{item.usp}</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-sm text-gray-500">
                                            <Tag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-xs leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">{item.specs}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 align-top text-right">
                                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-900 rounded-lg text-sm font-bold whitespace-nowrap">
                                        {formatPrice(item.price, item.currency)}
                                    </span>
                                </td>
                                <td className="py-4 px-6 align-middle text-center">
                                    {item.link ? (
                                        <a 
                                            href={item.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-bold gap-2 shadow-sm hover:shadow-md"
                                        >
                                            Buy / Verify <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'report' && (
                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm max-w-4xl mx-auto animate-in fade-in duration-500">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Strategic Analysis Report</h2>
                            <p className="text-sm text-gray-500">Generated by CompetitivePricingAI Master Agent</p>
                        </div>
                    </div>
                    
                    <div className="prose prose-sm md:prose-base max-w-none text-gray-700 prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-blue-600 prose-strong:text-gray-900">
                        <ReactMarkdown>{result.report}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
