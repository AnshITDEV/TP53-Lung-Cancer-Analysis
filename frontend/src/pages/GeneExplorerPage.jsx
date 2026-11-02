import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  Layers, 
  Activity, 
  ShieldAlert, 
  HelpCircle, 
  BookOpen, 
  GitCompare, 
  ExternalLink,
  ChevronRight,
  Database,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

import ChartCard from '../components/ChartCard';
import { fetchGeneInfo } from '../api/apiService';

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-950/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs">
        {label && <p className="font-semibold text-white mb-1.5 border-b border-slate-800 pb-1">{label}</p>}
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function GeneExplorerPage() {
  const [geneData, setGeneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGeneData();
  }, []);

  const loadGeneData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGeneInfo();
      setGeneData(data);
    } catch (err) {
      console.error('Failed to load gene info:', err);
      setError('Unable to fetch gene information from backend API.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-burgundy-900 border-t-burgundy-500 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium">Loading TP53 genomic profile & subtype comparative analysis...</p>
      </div>
    );
  }

  if (error || !geneData) {
    return (
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-rose-300 max-w-2xl mx-auto my-12 text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="font-bold text-white text-base">Genomics Service Unavailable</h3>
        <p className="text-xs text-rose-300 mt-1">{error}</p>
        <button
          onClick={loadGeneData}
          className="mt-4 px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { gene_info, subtype_comparison, variant_comparison } = geneData;

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* SECTION 1: TP53 GENE METADATA BANNER & ESSENTIAL STATS */}
      <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-navy-950 to-burgundy-950/30 border border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-burgundy-950 text-burgundy-300 border border-burgundy-800/60 font-mono font-semibold">
                NCBI RefSeq: NG_017013
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Canonical Tumor Suppressor
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Dna className="w-8 h-8 text-burgundy-500 animate-pulse" />
              <span>TP53 Gene Profile</span>
              <span className="text-sm font-normal text-slate-400 font-mono">
                ({gene_info.protein_name})
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {gene_info.description}
            </p>
          </div>

          {/* Quick Gene IDs Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 shrink-0 min-w-[240px]">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Gene ID</span>
              <span className="text-sm font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {gene_info.gene_id}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Chromosome</span>
              <span className="text-sm font-mono font-bold text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                {gene_info.chromosome}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Organism</span>
              <span className="text-sm font-sans font-bold text-cyan-300">
                {gene_info.organism}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: BIOLOGICAL FUNCTION & ROLE OF p53 PROTEIN */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-burgundy-400" />
            Biological Function & Role of p53 Protein
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Key physiological pathways orchestrated by p53 in response to oncogenic and genotoxic stress
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gene_info.molecular_functions.map((func, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-burgundy-950/80 text-burgundy-400 border border-burgundy-800/50 flex items-center justify-center font-bold font-mono text-xs mb-3">
                  0{i + 1}
                </div>
                <h4 className="text-sm font-bold text-white mb-2 tracking-tight">
                  {func.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {func.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Transcriptional downstream axis</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: COMPARISON OF TP53 MUTATION STATUS IN LUAD AND LUSC */}
      <section className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-burgundy-400" />
            Comparison of TP53 Mutation Status in LUAD vs LUSC
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Statistical and biological divergence between Lung Adenocarcinoma and Lung Squamous Cell Carcinoma
          </p>
        </div>

        {/* Subtype Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LUAD Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-900/40 hover:border-cyan-700/60 transition shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] text-cyan-400 font-mono font-semibold uppercase tracking-wider block">Subtype 1</span>
                <h4 className="text-lg font-bold text-white">LUAD (Lung Adenocarcinoma)</h4>
              </div>
              <span className="text-xl font-mono font-extrabold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-xl border border-cyan-800/60">
                {subtype_comparison.luad.mutation_rate}% Mutated
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {subtype_comparison.luad.characteristics}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2.5 rounded-lg bg-navy-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Total Patients</span>
                <span className="text-sm font-bold text-white font-mono">{subtype_comparison.luad.total}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-navy-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Mutated</span>
                <span className="text-sm font-bold text-rose-400 font-mono">{subtype_comparison.luad.mutated}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-navy-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Wildtype</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{subtype_comparison.luad.wildtype}</span>
              </div>
            </div>
          </div>

          {/* LUSC Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-rose-900/40 hover:border-rose-700/60 transition shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] text-rose-400 font-mono font-semibold uppercase tracking-wider block">Subtype 2</span>
                <h4 className="text-lg font-bold text-white">LUSC (Squamous Cell Carcinoma)</h4>
              </div>
              <span className="text-xl font-mono font-extrabold text-rose-300 bg-rose-950 px-3 py-1 rounded-xl border border-rose-800/60">
                {subtype_comparison.lusc.mutation_rate}% Mutated
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {subtype_comparison.lusc.characteristics}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2.5 rounded-lg bg-navy-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Total Patients</span>
                <span className="text-sm font-bold text-white font-mono">{subtype_comparison.lusc.total}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-navy-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Mutated</span>
                <span className="text-sm font-bold text-rose-400 font-mono">{subtype_comparison.lusc.mutated}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-navy-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Wildtype</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{subtype_comparison.lusc.wildtype}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COMPARATIVE CHART: TP53 Mutation Types in LUAD vs LUSC (Actual Dataset supported only) */}
        <ChartCard
          title="TP53 Variant Class Distribution by Subtype (LUAD vs LUSC)"
          subtitle="Direct comparison of observed mutation types across both lung cancer subtypes in the dataset"
          badge="Comparative Bar Chart"
        >
          <div className="w-full h-84">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={variant_comparison}
                margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="variantClass" 
                  stroke="#94a3b8" 
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                />
                <Bar 
                  dataKey="LUAD" 
                  name="LUAD (Adenocarcinoma)" 
                  fill="#38bdf8" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="LUSC" 
                  name="LUSC (Squamous Cell)" 
                  fill="#e11d48" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Structured Comparison Metrics Table */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl overflow-hidden">
          <h4 className="text-sm font-bold text-white mb-4 tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-burgundy-400" />
            Biological and Clinical Divergence Summary
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                  <th className="py-3 px-4 font-semibold">Evaluation Metric</th>
                  <th className="py-3 px-4 font-semibold text-cyan-400">LUAD Subtype</th>
                  <th className="py-3 px-4 font-semibold text-rose-400">LUSC Subtype</th>
                  <th className="py-3 px-4 font-semibold text-slate-300">Biomedical Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {subtype_comparison.comparison_metrics.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                      {row.metric}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300 whitespace-nowrap">
                      {row.luad}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-300 whitespace-nowrap">
                      {row.lusc}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 leading-relaxed">
                      {row.interpretation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Dataset Compliance Notice */}
      <div className="p-4 rounded-xl bg-navy-950/90 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
        <Database className="w-4 h-4 text-burgundy-400 shrink-0" />
        <span>
          <strong>Dataset Conformity Note:</strong> All visual comparisons and frequency distributions on this page are strictly derived from the validated clinical dataset schema (Patient ID, Age, Sex, TP53 Mutation Status, Variant Class, Cancer Subtype).
        </span>
      </div>
    </div>
  );
}

