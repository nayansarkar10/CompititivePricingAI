import React, { useState } from 'react';
import { HeroSearch } from './components/HeroSearch';
import { PricingTable } from './components/PricingTable';
import { AnalysisReport } from './components/AnalysisReport';
import { AnalysisResult, AppState } from './types';
import { sendMessage, startNewChat } from './services/geminiService';
import { ArrowLeft, RefreshCw, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    setAppState(AppState.ANALYZING);
    try {
        startNewChat(); // Reset session for new search
        const result = await sendMessage(query);
        setAnalysisResult(result);
        setAppState(AppState.RESULTS);
    } catch (e) {
        console.error("Analysis failed", e);
        setAppState(AppState.LANDING); // Go back on error for now
        alert("We encountered an issue analyzing the market. Please try again.");
    }
  };

  const resetSearch = () => {
      setAppState(AppState.LANDING);
      setAnalysisResult(null);
      setCurrentQuery('');
  };

  return (
    <div className="h-screen w-full bg-gray-50 overflow-hidden font-inter text-gray-900">
        
        {/* Layer 1: Landing / Search */}
        {appState === AppState.LANDING && (
            <HeroSearch onSearch={handleSearch} isLoading={false} />
        )}

        {/* Loading State */}
        {appState === AppState.ANALYZING && (
            <div className="h-full flex flex-col items-center justify-center bg-white relative">
                 <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                 <div className="z-10 flex flex-col items-center max-w-md text-center">
                    <div className="relative w-24 h-24 mb-8">
                        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        <Layers className="absolute inset-0 m-auto text-blue-600 w-8 h-8 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Market Data</h2>
                    <p className="text-gray-500">
                        Investigating competitors for "{currentQuery}"...
                        <br />
                        <span className="text-sm mt-2 block opacity-75">Identifying demographic trends, cost structures, and verifying pricing links.</span>
                    </p>
                 </div>
            </div>
        )}

        {/* Layer 2: Results Dashboard */}
        {appState === AppState.RESULTS && analysisResult && (
            <div className="h-full flex flex-col max-w-[1920px] mx-auto">
                {/* Header */}
                <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-20">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={resetSearch}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                            title="New Search"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="font-bold text-gray-900 text-lg">Analysis Results</h1>
                            <p className="text-xs text-gray-500">Query: {currentQuery}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                           onClick={() => handleSearch(currentQuery)}
                           className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" /> Regenerate Analysis
                        </button>
                    </div>
                </header>

                {/* Main Content Grid */}
                <main className="flex-1 overflow-hidden p-6 bg-gray-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                        
                        {/* Left: Report */}
                        <div className="h-full overflow-hidden flex flex-col animate-in slide-in-from-left duration-500 fade-in">
                            <AnalysisReport markdown={analysisResult.report} />
                        </div>

                        {/* Right: Table */}
                        <div className="h-full overflow-hidden flex flex-col animate-in slide-in-from-right duration-500 fade-in delay-100">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1 flex-1 overflow-hidden">
                                {analysisResult.data.length > 0 ? (
                                    <PricingTable data={analysisResult.data} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400">
                                        <p>No pricing data table generated. Check the report.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        )}
    </div>
  );
};

export default App;
