import React from 'react';
import { Terminal, Search, RefreshCw, X, ChevronRight } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, history, loadFromHistory, searchTerm, setSearchTerm, refreshHistory }) => {
  const filteredHistory = history.filter(item => 
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLanguageStyle = (lang) => {
    const l = lang?.toLowerCase() || "";
    switch (l) {
      case 'python': return 'bg-blue-900/30 text-blue-400 border-blue-800';
      case 'javascript': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800';
      case 'typescript': return 'bg-blue-900/30 text-blue-300 border-blue-800';
      case 'cpp': case 'c++': return 'bg-indigo-900/30 text-indigo-400 border-indigo-800';
      case 'java': return 'bg-orange-900/30 text-orange-400 border-orange-800';
      case 'sql': return 'bg-emerald-900/30 text-emerald-400 border-emerald-800';
      case 'html': return 'bg-orange-900/30 text-orange-500 border-orange-800';
      case 'css': return 'bg-sky-900/30 text-sky-400 border-sky-800';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div 
        className={`fixed md:relative z-30 top-0 left-0 h-full w-80 bg-slate-950 border-r border-slate-800 transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:translate-x-0 md:hidden'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
            <h2 className="font-bold text-lg flex items-center gap-2 text-purple-400 tracking-tight">
              <Terminal size={20} strokeWidth={2.5} /> DevGen
            </h2>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 space-y-3 shrink-0">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 text-slate-500 group-hover:text-purple-400 transition-colors" size={16} />
              <input 
                type="text" placeholder="Search history..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 group-hover:border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-200 placeholder-slate-600 transition-all"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3">
                  <Search size={20} className="text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm">
                  {history.length === 0 ? "No history yet.\nStart generating!" : "No matches found."}
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800/50 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getLanguageStyle(item.language)} uppercase tracking-wider`}>
                      {item.language}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 group-hover:text-slate-200 truncate font-medium pr-4 transition-colors">
                    {item.prompt}
                  </p>
                  <ChevronRight size={14} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-purple-500" />
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-950">
            <button 
              onClick={refreshHistory}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 py-2.5 rounded-lg transition-all border border-transparent hover:border-slate-800"
            >
              <RefreshCw size={14} /> Refresh History
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;