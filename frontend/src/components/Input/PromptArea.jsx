import React from 'react';
import { Play } from 'lucide-react';
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
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-1 flex-1 flex flex-col shadow-lg">
      
      {/* Language Selector */}
      <LanguageSelect language={language} setLanguage={setLanguage} />

      {/* Text Input Area */}
      <div className="flex-1 p-3 flex flex-col">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the code you want to generate..."
          className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none transition-all"
        />
      </div>

      {/* Generate Button */}
      <div className="p-3 pt-0">
        <button 
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95
            ${isLoading || !prompt.trim() 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/20'
            }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
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