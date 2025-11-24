import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeOutput = ({ generatedCode, language, fontSize, lineHeight, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting visualizer
  const colorize = (text) => {
    const keywords = ['def', 'return', 'if', 'for', 'in', 'const', 'let', 'var', 'function', 'class', 'import', 'from', 'include', 'int', 'void', 'print', 'console'];
    return text.split(/(\s+)/).map((word, i) => {
      if (keywords.includes(word)) return <span key={i} className="text-purple-400 font-bold">{word}</span>;
      if (word.startsWith('"') || word.startsWith("'")) return <span key={i} className="text-green-400">{word}</span>;
      if (!isNaN(word)) return <span key={i} className="text-orange-400">{word}</span>;
      if (word.startsWith('#') || word.startsWith('//')) return <span key={i} className="text-gray-500 italic">{word}</span>;
      return <span key={i} className="text-gray-200">{word}</span>;
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 rounded-xl border border-slate-800 shadow-lg overflow-hidden relative group">
      
      {/* Toolbar */}
      <div className="h-10 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          main.{language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'js'}
        </div>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code Display */}
      <div className="flex-1 relative bg-slate-950 overflow-hidden">
         {isLoading && (
           <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
             <div className="text-purple-400 animate-pulse font-mono">Thinking...</div>
           </div>
         )}
         
        <pre 
          className="w-full h-full overflow-auto p-4 font-mono"
          style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
        >
          <code>
            {generatedCode.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none text-slate-700 w-8 text-right mr-4 text-xs pt-1 opacity-50">{i + 1}</span>
                <div className="flex-1 whitespace-pre-wrap break-all">
                   {colorize(line)} 
                </div>
              </div>
            ))}
          </code>
        </pre>
      </div>

    </div>
  );
};

export default CodeOutput;