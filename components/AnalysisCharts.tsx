import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { QuantifierResponse } from '../types';

interface AnalysisChartsProps {
  data: QuantifierResponse;
}

const ProfessionalismChart: React.FC<{ data: QuantifierResponse }> = ({ data }) => {
  const chartData = [
    {
      subject: '专业术语',
      A: data.groupA.professionalism.terminology,
      B: data.groupB.professionalism.terminology,
      fullMark: 10,
    },
    {
      subject: '逻辑严密',
      A: data.groupA.professionalism.logic,
      B: data.groupB.professionalism.logic,
      fullMark: 10,
    },
    {
      subject: '信息密度',
      A: data.groupA.professionalism.density,
      B: data.groupB.professionalism.density,
      fullMark: 10,
    },
  ];

  return (
    <div className="h-80 w-full bg-white rounded-lg p-4 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">专业性对比</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Radar
            name="A组"
            dataKey="A"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Radar
            name="B组"
            dataKey="B"
            stroke="#ec4899"
            strokeWidth={2}
            fill="#ec4899"
            fillOpacity={0.3}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }}/>
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#334155' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <ProfessionalismChart data={data} />
    </div>
  );
};