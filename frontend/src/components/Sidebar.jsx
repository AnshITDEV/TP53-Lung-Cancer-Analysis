import React from 'react';
import { 
  LayoutDashboard, 
  UserSearch, 
  Dna, 
  Activity, 
  ShieldAlert, 
  Database,
  Cpu,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, mobileOpen, setMobileOpen, systemStatus }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Cohort Dashboard',
      subtitle: 'Overview & Analytics',
      icon: LayoutDashboard,
      badge: '5 Charts'
    },
    {
      id: 'patients',
      label: 'Patient Analysis',
      subtitle: 'Search & ML Prediction',
      icon: UserSearch,
      badge: 'Random Forest'
    },
    {
      id: 'gene-explorer',
      label: 'TP53 Gene Explorer',
      subtitle: 'Gene 7157 • Chr 17',
      icon: Dna,
      badge: 'Bioinformatics'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-navy-950 border-r border-slate-800/80
        flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-burgundy-700 to-burgundy-900 flex items-center justify-center shadow-lg shadow-burgundy-900/30 border border-burgundy-600/40">
              <Dna className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-tight text-base">TP53</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-burgundy-950 text-burgundy-400 border border-burgundy-800/50 font-mono font-medium">LUAD/LUSC</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Cancer Analysis System</p>
            </div>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Subtitle */}
        <div className="px-5 py-3 bg-navy-900/40 border-b border-slate-800/40">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
            Bioinformatics & Machine Learning
          </p>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileOpen(false);
                }}
                className={`
                  w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between group transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-burgundy-950/80 to-slate-900/60 border border-burgundy-700/50 text-white shadow-md shadow-burgundy-950/50' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-burgundy-600 text-white shadow-sm shadow-burgundy-500/30' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'}
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold block tracking-tight leading-tight">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                    isActive 
                      ? 'bg-burgundy-900/80 text-burgundy-300 border border-burgundy-700/50' 
                      : 'bg-slate-800/70 text-slate-400 border border-slate-700/50'
                  }`}>
                    {item.badge}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-burgundy-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'}`} />
                </div>
              </button>
            );
          })}
        </nav>

        {/* System & Model status footer */}
        <div className="p-4 border-t border-slate-800/80 bg-navy-950/80 space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Database className="w-3.5 h-3.5 text-burgundy-400" />
                Dataset Source
              </span>
              <span className="text-slate-200 font-mono text-[11px] px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">
                {systemStatus?.dataset_file || 'dataset.csv'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Model Engine
              </span>
              <span className="text-slate-200 font-mono text-[11px] px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">
                Random Forest
              </span>
            </div>
            <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Backend API</span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {systemStatus?.status === 'online' ? 'Active (:5000)' : 'Connecting...'}
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-[10px] text-slate-400 font-mono">
              TCGA LUAD vs LUSC Benchmark • 2026
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

