import React from 'react';
import { Menu, Activity, ShieldCheck, Dna, Sparkles } from 'lucide-react';

export default function Header({ currentPage, setMobileOpen, systemStatus }) {
  const getPageInfo = () => {
    switch (currentPage) {
      case 'dashboard':
        return {
          title: 'Cohort Analytics Dashboard',
          subtitle: 'Epidemiological & genomic distribution across Non-Small Cell Lung Cancer subtypes',
          tag: 'Overview & 5 Visualizations'
        };
      case 'patients':
        return {
          title: 'Patient Cohort & ML Subtype Prediction',
          subtitle: 'Search individual patient profiles and evaluate Random Forest classification probabilities',
          tag: 'Clinical Inference'
        };
      case 'gene-explorer':
        return {
          title: 'TP53 Gene & Molecular Pathogenicity Explorer',
          subtitle: 'Biological characteristics of Gene ID: 7157 and differential mutation spectrum in LUAD vs LUSC',
          tag: 'Genomic Profiling'
        };
      default:
        return {
          title: 'TP53 Lung Cancer Analysis System',
          subtitle: 'Bioinformatics and Machine Learning Dashboard',
          tag: 'Research Portal'
        };
    }
  };

  const info = getPageInfo();

  return (
    <header className="sticky top-0 z-30 bg-navy-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {info.title}
              </h1>
              <span className="hidden sm:inline-flex text-[11px] px-2.5 py-0.5 rounded-full bg-burgundy-950 text-burgundy-300 border border-burgundy-800/60 font-medium">
                {info.tag}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 line-clamp-1">
              {info.subtitle}
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Subtypes:</span>
            <span className="font-semibold text-cyan-400">LUAD</span>
            <span className="text-slate-600">vs</span>
            <span className="font-semibold text-rose-400">LUSC</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-mono text-[11px]">
              {systemStatus?.total_records ? `${systemStatus.total_records} Patients` : 'Connected'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

