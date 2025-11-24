import React, { useState, useEffect } from 'react';
import { Menu, Settings } from 'lucide-react';

// --- Import Modular Components ---
// Ensure these paths match where you saved the files
import Sidebar from './components/Layout/Sidebar';
import PromptArea from './components/Input/PromptArea';
import CodeOutput from './components/Editor/CodeOutput';
import EditorSettings from './components/Editor/EditorSettings';

// --- API Configuration ---
const API_BASE_URL = "https://code-editor-30tn.onrender.com/api";

const App = () => {
  // --- State Management ---
  
  // Input State
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("// Code will appear here...");
  const [isLoading, setIsLoading] = useState(false);
  
  // Sidebar/History State
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Editor/Settings State
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [showSettings, setShowSettings] = useState(false);

  // --- Effects ---
  
  useEffect(() => {
    fetchHistory();
  }, []);

  // --- API Functions ---

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
      // userId: 1 is the default seed user
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language, userId: 1 })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedCode(data.data.code);
        // Refresh history to show the new item immediately
        fetchHistory(); 
      } else {
        setGeneratedCode(`// Error: ${data.error}\n// Details: ${JSON.stringify(data.details)}`);
      }
    } catch (error) {
      console.error("Error generating code:", error);
      setGeneratedCode("// Network Error: Could not connect to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Event Handlers ---

  const loadFromHistory = (item) => {
    setPrompt(item.prompt);
    setLanguage(item.language);
    setGeneratedCode(item.code);
    // Automatically close sidebar on mobile when an item is clicked
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const refreshHistory = () => {
    fetchHistory();
  };

  // --- Render ---

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Sidebar (Left Panel) */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        history={history}
        loadFromHistory={loadFromHistory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        refreshHistory={refreshHistory}
      />

      {/* Main Content (Right Panel) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
            <h1 className="text-sm font-medium text-slate-400">AI Code Generator</h1>
          </div>
          
          {/* Settings Toggle */}
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <Settings size={20} />
            </button>
            
            {showSettings && (
              <EditorSettings 
                fontSize={fontSize} 
                setFontSize={setFontSize} 
                lineHeight={lineHeight} 
                setLineHeight={setLineHeight} 
              />
            )}
          </div>
        </header>

        {/* Main Workspace Grid */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
          
          {/* Left: Input Area */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <PromptArea 
              prompt={prompt} 
              setPrompt={setPrompt}
              language={language} 
              setLanguage={setLanguage}
              handleGenerate={handleGenerate} 
              isLoading={isLoading}
            />
          </div>

          {/* Right: Code Output */}
          <div className="w-full md:w-2/3 flex flex-col">
             <CodeOutput 
               generatedCode={generatedCode} 
               language={language}
               fontSize={fontSize} 
               lineHeight={lineHeight} 
               isLoading={isLoading}
             />
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;