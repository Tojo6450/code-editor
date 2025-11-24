import React from 'react';
import { Terminal, Search, Trash2, X } from 'lucide-react';

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  history, 
  loadFromHistory, 
  clearHistory, 
  searchTerm, 
  setSearchTerm 
}) => {
  
  const filteredHistory = history.filter(item => 
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className={`${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} 
      bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col absolute md:relative z-20 h-full`}
    >
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="font-bold text-lg flex items-center gap-2 text-purple-400">
          <Terminal size={20} /> DevGen
        </h2>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search history..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-slate-200"
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredHistory.length === 0 ? (
          <div className="text-center text-slate-600 mt-10 text-sm">No history found</div>
        ) : (
          filteredHistory.map((item) => (
            <button 
              key={item.id}
              onClick={() => loadFromHistory(item)}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.language === 'python' ? 'bg-yellow-900/30 text-yellow-400' :
                  item.language === 'javascript' ? 'bg-blue-900/30 text-blue-400' :
                  'bg-pink-900/30 text-pink-400'
                }`}>
                  {item.language}
                </span>
                <span className="text-[10px] text-slate-600">{item.timestamp}</span>
              </div>
              <p className="text-sm text-slate-300 truncate font-medium">{item.prompt}</p>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={clearHistory}
          className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 py-2 rounded transition-colors"
        >
          <Trash2 size={14} /> Clear History
        </button>
      </div>
    </div>
  );
};

export default Sidebar;