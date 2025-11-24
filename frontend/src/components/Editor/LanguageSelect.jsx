import React from 'react';
import { Code2 } from 'lucide-react';

const LanguageSelect = ({ language, setLanguage }) => {
  return (
    <div className="p-3 border-b border-slate-800 bg-slate-900/50">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
        Target Language
      </label>
      <div className="relative group">
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full appearance-none bg-slate-950 border border-slate-700 hover:border-slate-600 text-slate-200 py-3 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer text-sm md:text-base"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="sql">SQL</option>
        </select>
        <Code2 className="absolute right-3 top-3.5 text-slate-400 pointer-events-none group-hover:text-purple-400 transition-colors" size={18} />
      </div>
    </div>
  );
};

export default LanguageSelect;