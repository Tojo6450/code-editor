import React from 'react';

const EditorSettings = ({ fontSize, setFontSize, lineHeight, setLineHeight }) => {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-4 z-50">
      <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Editor Preferences</h3>
      
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

export default EditorSettings;