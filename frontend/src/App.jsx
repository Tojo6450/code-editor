import React, { useState, useEffect } from 'react';
import { 
  Terminal, Copy, Check, Search, Settings, 
  Code2, Play, Trash2, Menu, X, RefreshCw
} from 'lucide-react';

// --- API CONFIGURATION ---
const API_BASE_URL = "http://localhost:8000/api";

// --- SUB-COMPONENTS ---

const EditorSettings = ({ fontSize, setFontSize, lineHeight, setLineHeight }) => {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-4 z-50">
      <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Preferences</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Font Size</span>
            <span className="text-slate-400">{fontSize}px</span>
          </div>
          <input 
            type="range" min="10" max="24" 
            value={fontSize} 
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Line Height</span>
            <span className="text-slate-400">{lineHeight}</span>
          </div>
          <input 
            type="range" min="1" max="2" step="0.1"
            value={lineHeight} 
            onChange={(e) => setLineHeight(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

const LanguageSelect = ({ language, setLanguage }) => {
  return (
    <div className="p-3 border-b border-slate-800">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
        Target Language
      </label>
      <div className="relative">
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full appearance-none bg-slate-900 border border-slate-700 hover:border-slate-600 text-white py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="sql">SQL</option>
        </select>
        <Code2 className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
      </div>
    </div>
  );
};

const PromptArea = ({ prompt, setPrompt, language, setLanguage, handleGenerate, isLoading }) => {
  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-1 flex-1 flex flex-col shadow-lg">
      <LanguageSelect language={language} setLanguage={setLanguage} />
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

const CodeOutput = ({ generatedCode, language, fontSize, lineHeight, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Improved Syntax Highlighter
  const colorize = (text) => {
    const keywords = [
      'def', 'return', 'if', 'else', 'elif', 'for', 'in', 'while', 'break', 'continue',
      'const', 'let', 'var', 'function', 'class', 'import', 'from', 'export', 'default',
      'int', 'void', 'char', 'bool', 'double', 'float', 'struct', 'new', 'this',
      'public', 'private', 'static', 'async', 'await', 'try', 'catch', 'finally', 'throw',
      'print', 'console', 'log', 'true', 'false', 'null', 'undefined', 'select', 'from', 'where', 'insert', 'update', 'delete',
      'using', 'namespace', 'std', 'vector', 'iostream', 'string'
    ];
    
    // Updated Regex: Specifically captures #include and #define before generic # comments
    const splitRegex = /([a-zA-Z0-9_$]+|"[^"]*"|'[^']*'|\/\/.*|#include|#define|#.*|--.*)/;

    return text.split(splitRegex).map((part, i) => {
      if (!part) return null;
      
      // C++ Directives (Colorful!)
      if (part === '#include' || part === '#define') {
        return <span key={i} className="text-violet-400 font-bold">{part}</span>;
      }

      // Keywords
      if (keywords.includes(part.toLowerCase())) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
      
      // Strings (Double or Single quotes)
      if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-green-400">{part}</span>;
      
      // Numbers
      if (!isNaN(parseFloat(part)) && isFinite(part)) return <span key={i} className="text-orange-400">{part}</span>;
      
      // Comments (JS //, Python #, SQL --)
      // Note: #include will have been caught above, so starting with # here means it's a comment
      if (part.startsWith('//') || part.startsWith('#') || part.startsWith('--')) return <span key={i} className="text-slate-500 italic">{part}</span>;
      
      // Default
      return <span key={i} className="text-slate-200">{part}</span>;
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 rounded-xl border border-slate-800 shadow-lg overflow-hidden relative group">
      <div className="h-10 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          result.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : 'txt'}
        </div>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="flex-1 relative bg-slate-950 overflow-hidden">
         {isLoading && (
           <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
             <div className="text-purple-400 animate-pulse font-mono">Processing Request...</div>
           </div>
         )}
         
        {/* Render Code with Syntax Highlighting and Line Numbers */}
        <pre 
          className="w-full h-full overflow-auto p-4 font-mono"
          style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
        >
          <code>
            {(generatedCode || "").split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none text-slate-700 w-8 text-right mr-4 text-xs pt-1 opacity-50 font-mono">{i + 1}</span>
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

const Sidebar = ({ sidebarOpen, setSidebarOpen, history, loadFromHistory, searchTerm, setSearchTerm, refreshHistory }) => {
  const filteredHistory = history.filter(item => 
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col absolute md:relative z-20 h-full`}>
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="font-bold text-lg flex items-center gap-2 text-purple-400">
          <Terminal size={20} /> DevGen
        </h2>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <input 
            type="text" placeholder="Search history..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-200"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredHistory.length === 0 ? (
          <div className="text-center text-slate-600 mt-10 text-sm">
            {history.length === 0 ? "No history yet." : "No matches found."}
          </div>
        ) : (
          filteredHistory.map((item) => (
            <button 
              key={item.id}
              onClick={() => loadFromHistory(item)}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-400`}>
                  {item.language}
                </span>
                <span className="text-[10px] text-slate-600">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-300 truncate font-medium">{item.prompt}</p>
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={refreshHistory}
          className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white py-2 rounded transition-colors"
        >
          <RefreshCw size={14} /> Refresh List
        </button>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("// Code will appear here...");
  const [isLoading, setIsLoading] = useState(false);
  
  // History is now fetched from Backend
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Settings
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [showSettings, setShowSettings] = useState(false);

  // Initial Load of History
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // userId: 1 is our seed user
        body: JSON.stringify({ prompt, language, userId: 1 })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedCode(data.data.code);
        // Refresh history to show the new item
        fetchHistory(); 
      } else {
        setGeneratedCode(`// Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error generating code:", error);
      setGeneratedCode("// Network Error: Could not connect to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    setPrompt(item.prompt);
    setLanguage(item.language);
    setGeneratedCode(item.code);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        history={history}
        loadFromHistory={loadFromHistory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        refreshHistory={fetchHistory}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                <Menu size={20} />
              </button>
            )}
            <h1 className="text-sm font-medium text-slate-400">AI Code Generator</h1>
          </div>
          <div className="relative">
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-slate-800 text-slate-400 rounded-lg">
              <Settings size={20} />
            </button>
            {showSettings && (
              <EditorSettings fontSize={fontSize} setFontSize={setFontSize} lineHeight={lineHeight} setLineHeight={setLineHeight} />
            )}
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <PromptArea 
              prompt={prompt} setPrompt={setPrompt}
              language={language} setLanguage={setLanguage}
              handleGenerate={handleGenerate} isLoading={isLoading}
            />
          </div>
          <div className="w-full md:w-2/3 flex flex-col">
             <CodeOutput 
               generatedCode={generatedCode} language={language}
               fontSize={fontSize} lineHeight={lineHeight} isLoading={isLoading}
             />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;