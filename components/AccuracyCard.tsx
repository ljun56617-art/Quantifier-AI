import React from 'react';
import { AccuracyResult } from '../types';

interface AccuracyCardProps {
  groupName: string;
  result: AccuracyResult;
  color: 'blue' | 'pink';
}

export const AccuracyCard: React.FC<AccuracyCardProps> = ({ groupName, result, color }) => {
  const borderColor = color === 'blue' ? 'border-blue-500' : 'border-pink-500';
  const textColor = color === 'blue' ? 'text-blue-600' : 'text-pink-600';
  const badgeBg = result.isCorrect 
    ? 'bg-green-100 text-green-700 border-green-200' 
    : 'bg-red-100 text-red-700 border-red-200';

  return (
    <div className={`bg-white rounded-lg p-6 border-l-4 ${borderColor} shadow-sm border border-slate-100 h-full`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-xl font-bold ${textColor}`}>{groupName}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeBg}`}>
          {result.isCorrect ? '逻辑正确' : '存在错误'}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">思维链推导</h4>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {result.chainOfThought}
          </p>
        </div>

        {!result.isCorrect && result.firstErrorStep && (
          <div className="bg-red-50 p-3 rounded border border-red-100">
            <h4 className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-1">检测到错误</h4>
            <p className="text-sm text-red-800">
              <span className="font-semibold">首个错误步骤:</span> {result.firstErrorStep}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};