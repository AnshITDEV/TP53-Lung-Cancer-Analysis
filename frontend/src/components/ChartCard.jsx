import React from 'react';

export default function ChartCard({ title, subtitle, badge, children, className = '' }) {
  return (
    <div className={`p-5 rounded-2xl bg-slate-900/70 backdrop-blur-sm border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 flex flex-col ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {badge && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
            {badge}
          </span>
        )}
      </div>
      <div className="flex-1 w-full min-h-[260px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

