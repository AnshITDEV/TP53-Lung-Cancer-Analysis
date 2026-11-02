import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Dna, 
  Activity, 
  ShieldCheck, 
  Percent, 
  FileSpreadsheet, 
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

import MetricCard from '../components/MetricCard';
import ChartCard from '../components/ChartCard';
import { fetchStats } from '../api/apiService';

// Theme color constants
const COLORS = {
  luad: '#38bdf8',       // Light cyan/sky
  lusc: '#e11d48',       // Rose / Burgundy
  mutated: '#f43f5e',    // Bright crimson
  wildtype: '#10b981',   // Emerald
  slateDark: '#1e293b',
  variants: [
    '#e11d48', // Missense
    '#f59e0b', // Nonsense
    '#8b5cf6', // Frame shift del
    '#06b6d4', // Splice site
    '#ec4899', // Frame shift ins
    '#10b981', // In-frame del
  ]
};

// Custom Tooltip component for Recharts
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
              {entry.value.toLocaleString()} {entry.unit || ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('Unable to connect to Flask backend. Please ensure the backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-burgundy-900 border-t-burgundy-500 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium">Loading clinical cohort analytics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-rose-300 max-w-2xl mx-auto my-12 text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="font-bold text-white text-base">Backend Connection Notice</h3>
        <p className="text-xs text-rose-300 mt-1">{error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-4 px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { charts } = stats;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-burgundy-950 text-burgundy-400 border border-burgundy-800/50">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Cohort Epidemiological Overview</h2>
            <p className="text-xs text-slate-400">
              Comparative analysis of TP53 somatic alterations between Lung Adenocarcinoma (LUAD) & Lung Squamous Cell Carcinoma (LUSC)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Source: TCGA Standardized Matrix</span>
        </div>
      </div>

      {/* 6 Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Patients"
          value={stats.total_patients}
          subtext="Clinically profiled cohort"
          badge="100%"
          icon={Users}
          color="slate"
        />
        <MetricCard
          title="TP53 Mutated"
          value={stats.mutated_patients}
          subtext="Pathogenic / Somatic alterations"
          badge={`${stats.mutation_percentage}%`}
          icon={Dna}
          color="burgundy"
        />
        <MetricCard
          title="Wildtype TP53"
          value={stats.wildtype_patients}
          subtext="Intact tumor suppressor gene"
          badge={`${(100 - stats.mutation_percentage).toFixed(1)}%`}
          icon={ShieldCheck}
          color="emerald"
        />
        <MetricCard
          title="LUAD Patients"
          value={stats.luad_count}
          subtext="Adenocarcinoma subtype"
          badge={`${((stats.luad_count / stats.total_patients) * 100).toFixed(1)}%`}
          icon={Activity}
          color="cyan"
        />
        <MetricCard
          title="LUSC Patients"
          value={stats.lusc_count}
          subtext="Squamous cell carcinoma"
          badge={`${((stats.lusc_count / stats.total_patients) * 100).toFixed(1)}%`}
          icon={Activity}
          color="rose"
        />
        <MetricCard
          title="Mutation Rate"
          value={`${stats.mutation_percentage}%`}
          subtext="Overall TP53 frequency"
          badge="Enriched in LUSC"
          icon={Percent}
          color="burgundy"
        />
      </div>

      {/* Row of Charts: 1. LUAD vs LUSC (Donut) & 2. TP53 Mutated vs Wildtype (Pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: LUAD vs LUSC Distribution */}
        <ChartCard
          title="LUAD vs LUSC Subtype Distribution"
          subtitle="Relative cohort proportions of Lung Adenocarcinoma and Squamous Cell Carcinoma"
          badge="Donut Chart"
        >
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.subtype_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="name"
                >
                  <Cell fill={COLORS.luad} />
                  <Cell fill={COLORS.lusc} />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* CHART 2: TP53 Mutated vs Wildtype */}
        <ChartCard
          title="TP53 Mutation Status"
          subtitle="Distribution of somatic TP53 gene mutations vs intact wildtype alleles"
          badge="Pie Chart"
        >
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.mutation_distribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percentage }) => `${percentage}%`}
                  labelLine={false}
                >
                  <Cell fill={COLORS.mutated} />
                  <Cell fill={COLORS.wildtype} />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Row of Charts: 3. TP53 Variant Class & 4. Age Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 3: TP53 Variant Class Distribution */}
        <ChartCard
          title="TP53 Variant Class Distribution"
          subtitle="Frequencies of functional alteration types observed across mutated patients"
          badge="Bar Chart"
        >
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.variant_distribution}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis 
                  type="category" 
                  dataKey="variantClass" 
                  stroke="#94a3b8" 
                  fontSize={11}
                  tickLine={false}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  name="Mutated Patients" 
                  radius={[0, 6, 6, 0]}
                >
                  {charts.variant_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.variants[index % COLORS.variants.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* CHART 4: Age Distribution */}
        <ChartCard
          title="Patient Age Distribution"
          subtitle="Cohort distribution across 10-year age intervals at clinical presentation"
          badge="Histogram / Binned"
        >
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.age_distribution}
                margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="ageGroup" 
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
                <Bar 
                  dataKey="count" 
                  name="Number of Patients" 
                  fill="#818cf8" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* CHART 5: TP53 Mutation Status Across Cancer Subtypes (Stacked Bar Chart) */}
      <ChartCard
        title="TP53 Mutation Status Across Cancer Subtypes"
        subtitle="Comparative breakdown of Mutated vs Wildtype alleles in LUAD and LUSC cohorts"
        badge="Stacked Bar Chart"
      >
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={charts.subtype_mutation_stacked}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="fullName" 
                stroke="#94a3b8" 
                fontSize={12}
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
                dataKey="Mutated" 
                name="Mutated TP53" 
                stackId="subtype" 
                fill={COLORS.mutated} 
                radius={[0, 0, 0, 0]} 
              />
              <Bar 
                dataKey="Wildtype" 
                name="Wildtype TP53" 
                stackId="subtype" 
                fill={COLORS.wildtype} 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Small Section Explaining TP53 Gene and Its Role as a Tumor Suppressor Gene */}
      <section className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-900/90 via-navy-950 to-burgundy-950/40 border border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-burgundy-900/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-burgundy-900/50 border border-burgundy-700/60 flex items-center justify-center shrink-0 text-burgundy-300 shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                About the TP53 Gene & Its Role as a Tumour Suppressor
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-burgundy-950 text-burgundy-300 border border-burgundy-800/60">
                Guardian of the Genome
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              The <strong className="text-white">TP53</strong> gene, located on chromosome 17p13.1, encodes the 
              tumour antigen <strong className="text-white">p53</strong>—a master sequence-specific transcription 
              factor universally recognized as the <em>Guardian of the Genome</em>. Under physiological cellular stress, 
              such as DNA double-strand breaks, hypoxia, or oncogenic signaling, p53 coordinates critical biological 
              safeguards including <strong className="text-white">cell cycle arrest at the G1/S checkpoint</strong> (via p21/CDKN1A), 
              transcriptional activation of DNA damage repair machinery, cellular senescence, and the induction of 
              irreversible programmed cell death (<strong className="text-white">apoptosis</strong> via BAX, PUMA, and NOXA).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <h4 className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  LUAD Subtype Context (Lung Adenocarcinoma)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In Lung Adenocarcinoma, TP53 mutations occur in approximately 45–50% of cases. LUAD frequently harbors 
                  actionable targetable kinase oncogenes (EGFR mutations, ALK rearrangements, KRAS G12C). TP53 co-mutations in LUAD 
                  often modulate resistance to targeted tyrosine kinase inhibitors (TKIs) and affect overall clinical prognosis.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <h4 className="text-xs font-semibold text-rose-300 flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  LUSC Subtype Context (Lung Squamous Cell Carcinoma)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In Lung Squamous Cell Carcinoma, TP53 inactivation is an omnipresent hallmark feature, exceeding 80% mutation prevalence. 
                  Driven by heavy tobacco-derived polycyclic aromatic hydrocarbons, these mutations lead to profound genomic instability, 
                  chromosomal aneuploidy, and loss of cell-cycle restraint, making TP53 status a primary differentiator between the two subtypes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

