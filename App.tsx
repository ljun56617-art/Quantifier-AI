import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { analyzeTexts } from './services/geminiService';
import { QuantifierResponse, AnalysisStatus } from './types';
import { AnalysisCharts } from './components/AnalysisCharts';
import { AccuracyCard } from './components/AccuracyCard';
import { ReadabilityReport } from './components/ReadabilityReport';
import { Activity, Scale, BookOpen, ChevronRight, BarChart2, Camera, Eraser } from 'lucide-react';

const App: React.FC = () => {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<QuantifierResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'accuracy' | 'readability'>('overview');

  const handleAnalyze = async () => {
    if (!textA.trim() || !textB.trim()) return;
    
    setStatus(AnalysisStatus.LOADING);
    setError(null);
    
    try {
      const data = await analyzeTexts(textA, textB);
      setResult(data);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || '分析失败，请重试。');
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleSaveImage = async () => {
    const root = document.getElementById('root');
    if (!root) return;
    
    try {
      // Temporarily hide the save button to avoid capturing it in the screenshot
      const saveBtn = document.getElementById('save-btn');
      if (saveBtn) saveBtn.style.display = 'none';

      const canvas = await html2canvas(root, {
        backgroundColor: '#f8fafc',
        useCORS: true,
        logging: false,
        scale: 2 // Higher resolution
      });
      
      if (saveBtn) saveBtn.style.display = 'flex';

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      link.download = `analysis-report-${year}${month}${day}-${hours}${minutes}${seconds}.png`;
      link.click();
    } catch (err) {
      console.error("Screenshot failed", err);
      const saveBtn = document.getElementById('save-btn');
      if (saveBtn) saveBtn.style.display = 'flex';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              量化分析 <span className="text-blue-600">AI</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:block text-xs text-slate-500 font-mono">
              v1.0.0 • GEMINI-2.5-FLASH
            </div>
            <button
              id="save-btn"
              onClick={handleSaveImage}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-colors"
              title="保存为图片"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">保存图片</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col gap-8">
        
        {/* Input Section - Full Width Top Layout */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-700">输入数据</h2>
            <button 
              onClick={() => { setTextA(''); setTextB(''); setResult(null); setStatus(AnalysisStatus.IDLE); }}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
            >
              <Eraser className="w-3 h-3" />
              清空内容
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Group A Input */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-end">
                 <div className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-bold rounded-md border border-blue-100 shadow-sm">A 组</div>
              </div>
              <textarea
                className="w-full h-64 lg:h-96 bg-white border-2 border-slate-200 rounded-xl p-4 text-base text-slate-800 focus:border-blue-500 focus:ring-0 transition-colors resize-none placeholder-slate-400 shadow-sm leading-relaxed"
                placeholder="在此输入第一段需要分析的文本..."
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
              />
            </div>

            {/* Group B Input */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-end">
                 <div className="px-3 py-1 bg-pink-50 text-pink-600 text-sm font-bold rounded-md border border-pink-100 shadow-sm">B 组</div>
              </div>
              <textarea
                className="w-full h-64 lg:h-96 bg-white border-2 border-slate-200 rounded-xl p-4 text-base text-slate-800 focus:border-pink-500 focus:ring-0 transition-colors resize-none placeholder-slate-400 shadow-sm leading-relaxed"
                placeholder="在此输入第二段需要对比的文本..."
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={status === AnalysisStatus.LOADING || !textA || !textB}
            className={`
              w-full py-5 rounded-xl font-bold text-white shadow-md transition-all transform text-lg
              flex items-center justify-center gap-2 mt-2
              ${status === AnalysisStatus.LOADING 
                ? 'bg-slate-400 cursor-wait' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99]'}
              ${(!textA || !textB) && status !== AnalysisStatus.LOADING ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            `}
          >
            {status === AnalysisStatus.LOADING ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>正在量化分析...</span>
              </>
            ) : (
              <>
                <span>开始评估</span>
                <ChevronRight className="w-6 h-6" />
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results Section - Rendered below inputs */}
        {result && (
          <div className="flex flex-col gap-6 animate-fade-in border-t border-slate-200 pt-8 mt-4">
            <h2 className="text-xl font-bold text-slate-800">分析报告</h2>
            
            {/* Tabs */}
            <div className="flex p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <BarChart2 className="w-4 h-4" /> 专业性
              </button>
              <button 
                onClick={() => setActiveTab('accuracy')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all ${activeTab === 'accuracy' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Scale className="w-4 h-4" /> 准确性
              </button>
              <button 
                onClick={() => setActiveTab('readability')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all ${activeTab === 'readability' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <BookOpen className="w-4 h-4" /> 风格
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg border border-slate-200 text-center shadow-sm">
                         <div className="text-sm text-blue-600 font-bold mb-2">A组 综合评分</div>
                         <div className="text-5xl font-bold text-slate-800 tracking-tight">
                           {((result.groupA.professionalism.terminology + result.groupA.professionalism.logic + result.groupA.professionalism.density)/3).toFixed(1)}
                         </div>
                      </div>
                      <div className="bg-white p-6 rounded-lg border border-slate-200 text-center shadow-sm">
                         <div className="text-sm text-pink-600 font-bold mb-2">B组 综合评分</div>
                         <div className="text-5xl font-bold text-slate-800 tracking-tight">
                           {((result.groupB.professionalism.terminology + result.groupB.professionalism.logic + result.groupB.professionalism.density)/3).toFixed(1)}
                         </div>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-1 bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm h-full">
                         <table className="w-full text-sm text-left h-full">
                           <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                             <tr>
                               <th className="p-4 font-medium">评估指标</th>
                               <th className="p-4 font-medium text-blue-600">A 组</th>
                               <th className="p-4 font-medium text-pink-600">B 组</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             <tr>
                               <td className="p-4 text-slate-600">术语规范性</td>
                               <td className="p-4 text-slate-900 font-mono font-bold text-lg">{result.groupA.professionalism.terminology}</td>
                               <td className="p-4 text-slate-900 font-mono font-bold text-lg">{result.groupB.professionalism.terminology}</td>
                             </tr>
                             <tr>
                               <td className="p-4 text-slate-600">逻辑严谨性</td>
                               <td className="p-4 text-slate-900 font-mono font-bold text-lg">{result.groupA.professionalism.logic}</td>
                               <td className="p-4 text-slate-900 font-mono font-bold text-lg">{result.groupB.professionalism.logic}</td>
                             </tr>
                             <tr>
                               <td className="p-4 text-slate-600">信息密度</td>
                               <td className="p-4 text-slate-900 font-mono font-bold text-lg">{result.groupA.professionalism.density}</td>
                               <td className="p-4 text-slate-900 font-mono font-bold text-lg">{result.groupB.professionalism.density}</td>
                             </tr>
                           </tbody>
                         </table>
                      </div>
                      <div className="lg:col-span-2">
                         <AnalysisCharts data={result} />
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'accuracy' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AccuracyCard groupName="A 组" result={result.groupA.accuracy} color="blue" />
                  <AccuracyCard groupName="B 组" result={result.groupB.accuracy} color="pink" />
                </div>
              )}

              {activeTab === 'readability' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ReadabilityReport groupName="A 组" result={result.groupA.readability} color="blue" />
                  <ReadabilityReport groupName="B 组" result={result.groupB.readability} color="pink" />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;