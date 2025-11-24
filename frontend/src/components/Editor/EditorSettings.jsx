import React from 'react';

const EditorSettings = ({ fontSize, setFontSize, lineHeight, setLineHeight }) => {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 backdrop-blur-xl bg-opacity-95 ring-1 ring-black/5">
      <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Preferences</h3>
      
      <div className="space-y-5">
        {/* Font Size Control */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300 font-medium">Font Size</span>
            <span className="text-purple-400 font-mono text-xs bg-purple-900/20 px-2 py-0.5 rounded">{fontSize}px</span>
          </div>
          <input 
            type="range" min="12" max="24" 
            value={fontSize} 
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
          />
        </div>
        
        {/* Line Height Control */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300 font-medium">Line Height</span>
            <span className="text-purple-400 font-mono text-xs bg-purple-900/20 px-2 py-0.5 rounded">{lineHeight}</span>
          </div>
          <input 
            type="range" min="1" max="2" step="0.1"
            value={lineHeight} 
            onChange={(e) => setLineHeight(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
          />
        </div>
      </div>
    </div>
  );
};

export default EditorSettings;