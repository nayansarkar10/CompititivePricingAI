import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle2, Circle, ArrowLeft } from 'lucide-react';

interface Layer2QuestionsProps {
  questions: Question[];
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
  initialAnswers?: Record<string, string>;
}

export const Layer2Questions: React.FC<Layer2QuestionsProps> = ({ questions, onComplete, onBack, initialAnswers = {} }) => {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);

  const handleSelect = (questionText: string, option: string) => {
    setAnswers(prev => ({
        ...prev,
        [questionText]: option
    }));
  };

  const isComplete = questions.every(q => answers[q.text]);

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50 animate-in slide-in-from-right duration-500 scrollbar-hide">
      <div className="min-h-full flex flex-col items-center justify-center p-6 relative">
        
        {/* Back Button */}
        <button 
            onClick={onBack}
            className="absolute top-6 left-6 p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
            title="Back to Search"
        >
            <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="w-full max-w-2xl my-auto py-8">
          <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Let's refine your search</h2>
              <p className="text-gray-500">Help our agents understand exactly what you need.</p>
          </div>

          <div className="space-y-6">
              {questions.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                      <h3 className="font-semibold text-lg text-gray-800 mb-4">{q.text}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {q.options.map((opt) => {
                              const isSelected = answers[q.text] === opt;
                              return (
                                  <button
                                      key={opt}
                                      onClick={() => handleSelect(q.text, opt)}
                                      className={`relative px-4 py-3 rounded-xl text-left text-sm transition-all border ${
                                          isSelected 
                                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium shadow-sm' 
                                          : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600'
                                      }`}
                                  >
                                      <span className="flex items-center justify-between">
                                          {opt}
                                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                                      </span>
                                  </button>
                              );
                          })}
                      </div>
                  </div>
              ))}
          </div>

          <div className="mt-8 flex justify-end">
              <button
                  onClick={() => onComplete(answers)}
                  disabled={!isComplete}
                  className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-lg"
              >
                  Start Research Agents
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
