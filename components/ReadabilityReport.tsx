import React from 'react';
import { ReadabilityResult } from '../types';

interface ReadabilityReportProps {
  groupName: string;
  result: ReadabilityResult;
  color: 'blue' | 'pink';
}

export const ReadabilityReport: React.FC<ReadabilityReportProps> = ({ groupName, result, color }) => {
  const textColor = color === 'blue' ? 'text-blue-600' : 'text-pink-600';

  return (
    <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
      <h4 className={`font-bold ${textColor} mb-3 border-b border-slate-100 pb-2`}>{groupName}</h4>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-xs text-slate-500 uppercase block">语调风格</span>
          <span className="text-sm text-slate-800 font-medium">{result.tone}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 uppercase block">词汇难度</span>
          <span className="text-sm text-slate-800 font-medium">{result.vocabularyLevel}</span>
        </div>
      </div>

      <div>
        <span className="text-xs text-slate-500 uppercase block mb-1">风格简评</span>
        <p className="text-sm text-slate-600 italic">"{result.analysis}"</p>
      </div>
    </div>
  );
};