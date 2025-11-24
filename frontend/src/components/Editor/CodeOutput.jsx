import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeOutput = ({ generatedCode, language, fontSize, lineHeight, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorize = (text) => {
    const keywords = [
      'def', 'return', 'if', 'else', 'elif', 'for', 'in', 'while', 'break', 'continue',
      'const', 'let', 'var', 'function', 'class', 'import', 'from', 'export', 'default',
      'int', 'void', 'char', 'bool', 'double', 'float', 'struct', 'new', 'this',
      'public', 'private', 'static', 'async', 'await', 'try', 'catch', 'finally', 'throw',
      'print', 'console', 'log', 'true', 'false', 'null', 'undefined', 'select', 'from', 'where', 'insert', 'update', 'delete',
      'using', 'namespace', 'std', 'vector', 'iostream', 'string', 'main'
    ];
    
    const splitRegex = /([a-zA-Z0-9_$]+|"[^"]*"|'[^']*'|\/\/.*|#include|#define|#ifdef|#endif|#.*|--.*)/;

    return text.split(splitRegex).map((part, i) => {
      if (!part) return null;
      
      if (['#include', '#define', '#ifdef', '#endif', '#pragma'].includes(part)) {
        return <span key={i} className="text-pink-400 font-bold">{part}</span>;
      }
      if (part.startsWith('"') || part.startsWith("'")) {
        return <span key={i} className="text-green-400">{part}</span>;
      }
      if (part.startsWith('//') || part.startsWith('--') || (part.startsWith('#') && !part.match(/^#[a-z]/))) {
        return <span key={i} className="text-slate-500 italic">{part}</span>;
      }
      if (keywords.includes(part.toLowerCase())) {
        return <span key={i} className="text-purple-400 font-bold">{part}</span>;
      }
      if (!isNaN(parseFloat(part)) && isFinite(part)) {
        return <span key={i} className="text-orange-400">{part}</span>;
      }
      return <span key={i} className="text-slate-200">{part}</span>;
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative group min-h-[400px] md:min-h-0">
 
      <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
          </div>
          <div className="h-4 w-px bg-slate-800 mx-1"></div>
          <div className="text-xs text-slate-500 font-mono font-medium">
            main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : 'txt'}
          </div>
        </div>
        
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>

      <div className="flex-1 relative bg-[#0B1120] overflow-auto custom-scrollbar">
         {isLoading && (
           <div className="absolute inset-0 z-10 bg-[#0B1120]/90 backdrop-blur-sm flex items-center justify-center">
             <div className="flex flex-col items-center gap-3">
               <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
               <div className="text-purple-400 animate-pulse font-mono text-sm">Generating Solution...</div>
             </div>
           </div>
         )}
         
        <pre 
          className="p-4 font-mono w-full"
          style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
        >
          <code>
            {(generatedCode || "").split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none text-slate-700 w-8 text-right mr-4 text-xs pt-[0.2em] opacity-50 font-mono shrink-0">{i + 1}</span>
                <div className="whitespace-pre">
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