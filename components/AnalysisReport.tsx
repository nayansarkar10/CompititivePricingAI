import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText } from 'lucide-react';

interface AnalysisReportProps {
  markdown: string;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ markdown }) => {
  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm h-full overflow-y-auto">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Strategic Analysis Report</h2>
        </div>
        
        <div className="prose prose-sm md:prose-base max-w-none text-gray-700 prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-blue-600 prose-strong:text-gray-900">
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
    </div>
  );
};
