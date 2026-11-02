import React from 'react';

export default function MetricCard({ title, value, subtext, icon: Icon, color = 'burgundy', badge }) {
  const colorStyles = {
    burgundy: {
      border: 'border-burgundy-900/40 hover:border-burgundy-600/60',
      iconBg: 'bg-burgundy-950/80 text-burgundy-400 border border-burgundy-800/40',
      badgeBg: 'bg-burgundy-950 text-burgundy-300 border-burgundy-800/50',
      glow: 'hover:shadow-burgundy-950/40',
    },
    emerald: {
      border: 'border-emerald-900/40 hover:border-emerald-600/60',
      iconBg: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-800/50',
      glow: 'hover:shadow-emerald-950/40',
    },
    cyan: {
      border: 'border-cyan-900/40 hover:border-cyan-600/60',
      iconBg: 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/40',
      badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-800/50',
      glow: 'hover:shadow-cyan-950/40',
    },
    rose: {
      border: 'border-rose-900/40 hover:border-rose-600/60',
      iconBg: 'bg-rose-950/80 text-rose-400 border border-rose-800/40',
      badgeBg: 'bg-rose-950 text-rose-300 border-rose-800/50',
      glow: 'hover:shadow-rose-950/40',
    },
    slate: {
      border: 'border-slate-800 hover:border-slate-700',
      iconBg: 'bg-slate-800/80 text-slate-300 border border-slate-700/50',
      badgeBg: 'bg-slate-800 text-slate-300 border-slate-700',
      glow: 'hover:shadow-slate-900/40',
    }
  };

  const style = colorStyles[color] || colorStyles.burgundy;

  return (
    <div className={`
      relative p-5 rounded-2xl bg-slate-900/70 backdrop-blur-sm border ${style.border}
      transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${style.glow}
      flex flex-col justify-between group
    `}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs uppercase font-medium tracking-wider text-slate-400 block mb-1">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            {value !== undefined ? value : '—'}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${style.iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || badge) && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 truncate pr-2">{subtext}</span>
          {badge && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${style.badgeBg} shrink-0`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

