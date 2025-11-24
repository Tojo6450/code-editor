import React, { useState } from 'react';
import { Menu, Settings } from 'lucide-react';
import EditorSettings from '../Editor/EditorSettings';

const Navbar = ({ sidebarOpen, setSidebarOpen, fontSize, setFontSize, lineHeight, setLineHeight }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="text-sm font-medium text-slate-400">AI Code Generator</h1>
      </div>
      
      <div className="flex items-center gap-2">
         <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
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
      </div>
    </header>
  );
};

export default Navbar;