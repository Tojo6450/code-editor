import React, { useState, useEffect } from 'react';
import { Menu, Settings } from 'lucide-react';

import Sidebar from './components/Layout/Sidebar';
import PromptArea from './components/Input/PromptArea';
import CodeOutput from './components/Editor/CodeOutput';
import EditorSettings from './components/Editor/EditorSettings';


const API_BASE_URL = "https://code-editor-30tn.onrender.com/api";


const App = () => {

  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("// Your AI generated code will appear here...");
  const [isLoading, setIsLoading] = useState(false);
  
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchHistory();
  
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- API Logic ---
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`);
      const data = await res.json();
      if (data.success) setHistory(data.data);
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
        body: JSON.stringify({ prompt, language, userId: 1 })
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedCode(data.data.code);
        fetchHistory(); 
      } else {
        setGeneratedCode(`// Error: ${data.error}\n// Details: ${JSON.stringify(data.details)}`);
      }
    } catch (error) {
      console.error("Error:", error);
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
    <div className="flex h-dvh bg-[#0B1120] text-slate-200 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-hidden">
      
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        history={history}
        loadFromHistory={loadFromHistory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        refreshHistory={fetchHistory}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 border-b border-slate-800 bg-[#0B1120] flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
            <h1 className="text-sm md:text-base font-bold text-slate-200 tracking-tight">
              AI Code Generator
            </h1>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className={`p-2 rounded-lg transition-all duration-200 ${showSettings ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              <Settings size={20} />
            </button>
            {showSettings && (
              <EditorSettings 
                fontSize={fontSize} setFontSize={setFontSize} 
                lineHeight={lineHeight} setLineHeight={setLineHeight} 
              />
            )}
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden p-4 gap-4 relative">
       
          <div className="w-full md:w-[40%] flex flex-col gap-4 shrink-0 md:shrink h-auto md:h-full">
            <PromptArea 
              prompt={prompt} setPrompt={setPrompt}
              language={language} setLanguage={setLanguage}
              handleGenerate={handleGenerate} isLoading={isLoading}
            />
          </div>
          <div className="w-full md:flex-1 flex flex-col h-auto md:h-full pb-4 md:pb-0">
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