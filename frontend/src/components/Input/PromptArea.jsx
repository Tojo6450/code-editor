import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import LanguageSelect from '../Editor/LanguageSelect';

const PromptArea = ({ 
  prompt, 
  setPrompt, 
  language, 
  setLanguage, 
  handleGenerate, 
  isLoading 
}) => {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col shadow-xl overflow-hidden h-full min-h-[350px] md:min-h-0">
      
      {/* Language Selector */}
      <LanguageSelect language={language} setLanguage={setLanguage} />

      {/* Text Input Area */}
      <div className="flex-1 p-3 flex flex-col relative">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the code you want to generate..."
          className="flex-1 w-full bg-slate-950/50 border border-slate-700/50 rounded-lg p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 resize-none transition-all font-medium leading-relaxed"
        />
        <div className="absolute bottom-4 right-4 pointer-events-none text-slate-700">
          <Sparkles size={16} className="opacity-20" />
        </div>
      </div>

      {/* Generate Button Area */}
      <div className="p-4 pt-0 bg-slate-900 border-t border-slate-800/50 mt-auto">
        <button 
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-3.5 rounded-lg font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-lg
            ${isLoading || !prompt.trim() 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-purple-900/20 hover:shadow-purple-900/40'
            }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="animate-pulse">Thinking...</span>
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" /> Generate Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptArea;