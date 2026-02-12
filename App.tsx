import React, { useState } from 'react';
import { Layer1Landing } from './components/Layer1Landing';
import { Layer2Questions } from './components/Layer2Questions';
import { Layer3Processing } from './components/Layer3Processing';
import { Layer4Results } from './components/Layer4Results';
import { AppState, Question, AnalysisResult } from './types';
import { generateQuestions, generateAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LAYER1_LANDING);
  
  // Data State
  const [query, setQuery] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // TRANSITION 1: Landing -> Questions (L1 -> L2)
  const handleLayer1Next = async (initialQuery: string) => {
    setQuery(initialQuery);
    // Note: We don't reset answers here if user goes back and forth with same query? 
    // Usually a new search means new questions.
    // For simplicity, we regenerate questions.
    try {
        setAppState(AppState.LAYER3_PROCESSING); // Quick load state while fetching Qs
        const generatedQs = await generateQuestions(initialQuery);
        setQuestions(generatedQs);
        setAppState(AppState.LAYER2_QUESTIONS);
    } catch (e) {
        console.error("Failed to generate questions", e);
        setAppState(AppState.LAYER1_LANDING);
    }
  };

  // TRANSITION 2: Questions -> Processing -> Results (L2 -> L3 -> L4)
  const handleLayer2Complete = async (userAnswers: Record<string, string>) => {
    setAnswers(userAnswers);
    setAppState(AppState.LAYER3_PROCESSING);
    
    try {
        // Kick off the heavy analysis
        const result = await generateAnalysis({ originalQuery: query, answers: userAnswers });
        setAnalysisResult(result);
        setAppState(AppState.LAYER4_RESULTS);
    } catch (e) {
        console.error("Analysis Failed", e);
        alert("Agent encountered an error. Please try again.");
        setAppState(AppState.LAYER1_LANDING);
    }
  };

  // Back Navigation Handlers
  const handleBackFromL2 = () => {
    setAppState(AppState.LAYER1_LANDING);
  };

  const handleBackFromL3 = () => {
    // If we are in L3 (Processing), going back means cancelling or just returning to questions
    setAppState(AppState.LAYER2_QUESTIONS);
  };

  const handleBackFromL4 = () => {
    // L4 -> L3 (View Agents again)
    // Note: Since L3 auto-transitions when promise resolves, 
    // manually setting state to L3 here just shows the view without triggering a new analysis.
    setAppState(AppState.LAYER3_PROCESSING);
  };

  const handleReset = () => {
    setQuery('');
    setQuestions([]);
    setAnswers({});
    setAnalysisResult(null);
    setAppState(AppState.LAYER1_LANDING);
  };

  return (
    <div className="h-screen w-full bg-gray-50 overflow-hidden font-inter text-gray-900">
        {appState === AppState.LAYER1_LANDING && (
            <Layer1Landing 
                onNext={handleLayer1Next} 
                initialValue={query}
            />
        )}

        {appState === AppState.LAYER2_QUESTIONS && (
            <Layer2Questions 
                questions={questions} 
                onComplete={handleLayer2Complete} 
                onBack={handleBackFromL2}
                initialAnswers={answers}
            />
        )}

        {appState === AppState.LAYER3_PROCESSING && (
            <Layer3Processing 
                onBack={handleBackFromL3} 
            />
        )}

        {appState === AppState.LAYER4_RESULTS && analysisResult && (
            <Layer4Results 
                result={analysisResult} 
                onBack={handleBackFromL4} 
                onHome={handleReset}
                query={query} 
            />
        )}
    </div>
  );
};

export default App;
