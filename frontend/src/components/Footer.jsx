import React from 'react';
import { Dna, GitBranch, Terminal, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-navy-950/70 py-6 px-4 sm:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-burgundy-900/60 border border-burgundy-700/50 flex items-center justify-center text-burgundy-400">
            <Dna className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-slate-200">
              TP53 Lung Cancer Analysis System
            </span>
            <span className="text-slate-400 ml-2">
              Bioinformatics & Machine Learning Mini-Project
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400">
          <span>React 19 • Vite • Tailwind</span>
          <span>•</span>
          <span>Python Flask</span>
          <span>•</span>
          <span>Scikit-Learn Random Forest</span>
          <span>•</span>
          <span>Recharts</span>
        </div>
      </div>
    </footer>
  );
}

