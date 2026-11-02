import React, { useState, useEffect } from 'react';
import { 
  UserSearch, 
  Search, 
  User, 
  Dna, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Sliders,
  RefreshCw,
  FileText,
  BadgeCheck,
  ChevronDown
} from 'lucide-react';
import { fetchPatients, fetchPatientDetail, postPrediction } from '../api/apiService';

export default function PatientAnalysisPage() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('TCGA-LUAD-1001');
  const [patientData, setPatientData] = useState(null);
  const [patientPrediction, setPatientPrediction] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [patientError, setPatientError] = useState(null);

  // Quick sample patient options
  const samplePatients = [
    { id: 'TCGA-LUAD-1001', label: 'LUAD (Mutated)', type: 'LUAD' },
    { id: 'TCGA-LUAD-1003', label: 'LUAD (Wildtype)', type: 'LUAD' },
    { id: 'TCGA-LUSC-2001', label: 'LUSC (Mutated)', type: 'LUSC' },
    { id: 'TCGA-LUSC-2005', label: 'LUSC (Nonsense)', type: 'LUSC' },
  ];

  // Custom Predictor Form state
  const [customForm, setCustomForm] = useState({
    age: 65,
    sex: 'Male',
    mutation_status: 'Mutated',
    variant_class: 'Missense_Mutation'
  });
  const [customPrediction, setCustomPrediction] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState(null);

  // Load initial patient on mount
  useEffect(() => {
    handleSelectPatient('TCGA-LUAD-1001');
    runInitialCustomPrediction();
  }, []);

  const runInitialCustomPrediction = async () => {
    try {
      const pred = await postPrediction({
        age: 65,
        sex: 'Male',
        tp53_mutation_status: 'Mutated',
        tp53_variant_class: 'Missense_Mutation'
      });
      setCustomPrediction(pred);
    } catch (err) {
      console.warn('Initial prediction test error:', err);
    }
  };

  const handleSelectPatient = async (patientId) => {
    if (!patientId) return;
    try {
      setLoadingPatient(true);
      setPatientError(null);
      setSelectedPatientId(patientId);

      const res = await fetchPatientDetail(patientId);
      if (res && res.patient) {
        setPatientData(res.patient);
        setPatientPrediction(res.prediction);
      } else {
        throw new Error('Patient not found');
      }
    } catch (err) {
      console.error(err);
      setPatientError(`Could not find patient with ID "${patientId}". Please try another ID.`);
      setPatientData(null);
      setPatientPrediction(null);
    } finally {
      setLoadingPatient(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSelectPatient(searchQuery.trim());
    }
  };

  const handleCustomPredictSubmit = async (e) => {
    e.preventDefault();
    try {
      setCustomLoading(true);
      setCustomError(null);

      // If wildtype, variant class is None
      const varClass = customForm.mutation_status === 'Wildtype' ? 'None' : customForm.variant_class;

      const result = await postPrediction({
        age: Number(customForm.age),
        sex: customForm.sex,
        tp53_mutation_status: customForm.mutation_status,
        tp53_variant_class: varClass
      });
      setCustomPrediction(result);
    } catch (err) {
      console.error(err);
      setCustomError('Prediction failed. Please verify the feature inputs.');
    } finally {
      setCustomLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* SECTION 1: PATIENT SEARCH & RETRIEVAL */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <UserSearch className="w-5 h-5 text-burgundy-400" />
              Patient Profile Search & Model Evaluation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Query patient genomics and evaluate Random Forest lung cancer subtype classification
            </p>
          </div>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Quick Select:</span>
            {samplePatients.map((sample) => (
              <button
                key={sample.id}
                onClick={() => {
                  setSearchQuery(sample.id);
                  handleSelectPatient(sample.id);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition font-mono ${
                  selectedPatientId === sample.id
                    ? 'bg-burgundy-900/80 border-burgundy-500 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {sample.id}
              </button>
            ))}
          </div>
        </div>

        {/* Search input bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Patient ID (e.g., TCGA-LUAD-1001, TCGA-LUSC-2005)..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-12 pr-32 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-burgundy-500 focus:ring-1 focus:ring-burgundy-500 transition"
            />
            <button
              type="submit"
              disabled={loadingPatient}
              className="absolute right-2 px-5 py-2 rounded-lg bg-burgundy-700 hover:bg-burgundy-600 text-white text-xs font-semibold tracking-wide transition shadow-md shadow-burgundy-950 flex items-center gap-1.5 disabled:opacity-50"
            >
              {loadingPatient ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {patientError && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{patientError}</span>
          </div>
        )}
      </section>

      {/* PATIENT PROFILE & MODEL PREDICTION DISPLAY */}
      {patientData && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: Patient Profile Information Cards (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm space-y-6">
                <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300">
                      <User className="w-6 h-6 text-burgundy-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white font-mono tracking-tight">
                          {patientData.PATIENT_ID}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          TCGA Bio-specimen
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Clinical Profile & Genomic Markers</p>
                    </div>
                  </div>

                  {/* Subtype Badge */}
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                      Actual Subtype
                    </span>
                    <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold font-mono border ${
                      patientData.CANCER_SUBTYPE === 'LUAD'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60'
                        : 'bg-rose-950 text-rose-300 border-rose-700/60'
                    }`}>
                      {patientData.CANCER_SUBTYPE}
                    </span>
                  </div>
                </div>

                {/* 5 Clinical Data Fields in Clean Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800/70">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Patient ID</span>
                    <span className="text-sm font-bold text-white font-mono">{patientData.PATIENT_ID}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800/70">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Age</span>
                    <span className="text-sm font-bold text-white font-sans">{patientData.AGE} Years</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800/70">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Sex</span>
                    <span className="text-sm font-bold text-white font-sans">{patientData.SEX}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800/70">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">TP53 Status</span>
                    <span className={`text-sm font-bold font-mono inline-flex items-center gap-1.5 ${
                      patientData.TP53_MUTATION_STATUS === 'Mutated' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        patientData.TP53_MUTATION_STATUS === 'Mutated' ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}></span>
                      {patientData.TP53_MUTATION_STATUS}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800/70 sm:col-span-2">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">TP53 Variant Class</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      {patientData.TP53_VARIANT_CLASS.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Subtype Clinical Definition */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      Histological Classification: {patientData.CANCER_SUBTYPE === 'LUAD' ? 'Lung Adenocarcinoma' : 'Lung Squamous Cell Carcinoma'}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">ICD-O-3</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {patientData.CANCER_SUBTYPE === 'LUAD'
                      ? 'Characterized by glandular differentiation or mucin production. Often associated with peripheral lung lesions and heterogeneous driver mutations.'
                      : 'Characterized by keratinization, squamous pearls, and intercellular bridges. Strong epidemiological association with heavy smoking and near-universal TP53 inactivation.'}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: Random Forest Model Prediction Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-navy-950 to-burgundy-950/30 border border-slate-800/80 shadow-xl space-y-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-burgundy-950 text-burgundy-400 border border-burgundy-800/50">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Random Forest ML Model</h4>
                        <p className="text-xs text-slate-400">Subtype Prediction & Probabilities</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Scikit-Learn
                    </span>
                  </div>

                  {patientPrediction && (
                    <div className="space-y-6 mt-6">
                      {/* Prediction Result Pill */}
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
                        <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium">
                          Model Predicted Subtype
                        </span>
                        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                          <span className={patientPrediction.predicted_subtype === 'LUAD' ? 'text-cyan-400' : 'text-rose-400'}>
                            {patientPrediction.predicted_subtype}
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                            {patientPrediction.confidence}% confidence
                          </span>
                        </div>
                      </div>

                      {/* Prediction Probabilities Dual Progress Bar */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">Class Probabilities</span>
                          <span className="text-[11px] font-mono text-slate-400">Softmax Ensemble</span>
                        </div>

                        {/* LUAD Probability Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-cyan-300 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                              LUAD (Adenocarcinoma)
                            </span>
                            <span className="text-white font-bold">{patientPrediction.probabilities?.LUAD ?? 0}%</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                            <div 
                              className="h-full bg-cyan-500 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${patientPrediction.probabilities?.LUAD ?? 0}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* LUSC Probability Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-rose-300 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                              LUSC (Squamous Cell)
                            </span>
                            <span className="text-white font-bold">{patientPrediction.probabilities?.LUSC ?? 0}%</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                            <div 
                              className="h-full bg-rose-500 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${patientPrediction.probabilities?.LUSC ?? 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Concordance Assessment */}
                      <div className="pt-2">
                        {patientPrediction.predicted_subtype === patientData.CANCER_SUBTYPE ? (
                          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                              <strong>Concordant:</strong> The Random Forest model prediction agrees with the ground-truth clinical diagnosis.
                            </span>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center gap-2.5 text-xs text-amber-300">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>
                              <strong>Discordant Feature Vector:</strong> Clinical phenotype displays overlapping histological characteristics with subtype boundary.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span>Ensemble: 120 Decision Trees</span>
                  <span>Feature Space: 4 Attributes</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: SEPARATE FORM FOR USER-ENTERED PATIENT FEATURES (WHAT-IF PREDICTOR) */}
      <section className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-6">
        <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-burgundy-400" />
              Interactive Feature-Based Subtype Predictor
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Input hypothetical or custom patient features to generate real-time Random Forest predictions and class probabilities
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-burgundy-950 text-burgundy-300 border border-burgundy-800/60 self-start sm:self-auto">
            Live Model Inference
          </span>
        </div>

        <form onSubmit={handleCustomPredictSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Field 1: Age */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Patient Age
                </label>
                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {customForm.age} yrs
                </span>
              </div>
              <input
                type="range"
                min="35"
                max="88"
                step="1"
                value={customForm.age}
                onChange={(e) => setCustomForm({ ...customForm, age: Number(e.target.value) })}
                className="w-full accent-burgundy-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>35</span>
                <span>Cohort Avg: 66</span>
                <span>88</span>
              </div>
            </div>

            {/* Field 2: Sex */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Sex
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Male', 'Female'].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setCustomForm({ ...customForm, sex: option })}
                    className={`py-2 text-xs font-medium rounded-lg border transition ${
                      customForm.sex === option
                        ? 'bg-burgundy-900/80 border-burgundy-500 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 3: TP53 Mutation Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                TP53 Mutation Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Mutated', 'Wildtype'].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setCustomForm({ ...customForm, mutation_status: option })}
                    className={`py-2 text-xs font-medium rounded-lg border transition ${
                      customForm.mutation_status === option
                        ? option === 'Mutated'
                          ? 'bg-rose-950 border-rose-600 text-rose-200 font-semibold'
                          : 'bg-emerald-950 border-emerald-600 text-emerald-200 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 4: TP53 Variant Class */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                TP53 Variant Class
              </label>
              <select
                disabled={customForm.mutation_status === 'Wildtype'}
                value={customForm.mutation_status === 'Wildtype' ? 'None' : customForm.variant_class}
                onChange={(e) => setCustomForm({ ...customForm, variant_class: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-burgundy-500 disabled:opacity-40 disabled:cursor-not-allowed font-mono"
              >
                {customForm.mutation_status === 'Wildtype' ? (
                  <option value="None">None (Wildtype allele)</option>
                ) : (
                  <>
                    <option value="Missense_Mutation">Missense Mutation</option>
                    <option value="Nonsense_Mutation">Nonsense Mutation</option>
                    <option value="Frame_Shift_Del">Frame Shift Deletion</option>
                    <option value="Frame_Shift_Ins">Frame Shift Insertion</option>
                    <option value="Splice_Site">Splice Site</option>
                    <option value="In_Frame_Del">In Frame Deletion</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Model inputs pass through one-hot categorical encoding and Random Forest tree ensembles.
            </span>
            <button
              type="submit"
              disabled={customLoading}
              className="px-6 py-2.5 bg-burgundy-700 hover:bg-burgundy-600 text-white rounded-xl text-xs font-bold tracking-wide transition shadow-lg shadow-burgundy-950 flex items-center gap-2 disabled:opacity-50"
            >
              {customLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Compute Model Prediction</span>
                </>
              )}
            </button>
          </div>
        </form>

        {customError && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
            {customError}
          </div>
        )}

        {/* Custom Prediction Result Card */}
        {customPrediction && (
          <div className="p-5 rounded-xl bg-navy-950/80 border border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Inference Outcome</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-bold text-white">Predicted Subtype:</span>
                  <span className={`text-lg font-extrabold font-mono px-3 py-0.5 rounded-lg border ${
                    customPrediction.predicted_subtype === 'LUAD'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60'
                      : 'bg-rose-950 text-rose-300 border-rose-700/60'
                  }`}>
                    {customPrediction.predicted_subtype === 'LUAD' ? 'LUAD (Lung Adenocarcinoma)' : 'LUSC (Squamous Cell Carcinoma)'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Calculated Confidence</span>
                <span className="text-lg font-extrabold text-white font-mono">{customPrediction.confidence}%</span>
              </div>
            </div>

            {/* Dual probability sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-semibold">LUAD Probability</span>
                  <span className="text-white font-bold">{customPrediction.probabilities?.LUAD ?? 0}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${customPrediction.probabilities?.LUAD ?? 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-rose-400 font-semibold">LUSC Probability</span>
                  <span className="text-white font-bold">{customPrediction.probabilities?.LUSC ?? 0}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${customPrediction.probabilities?.LUSC ?? 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">
              * The Random Forest decision boundary places significant weight on TP53 mutation status and variant severity. TP53 mutated status in older male patients strongly increases LUSC posterior probability, while wildtype TP53 in female patients significantly shifts probability towards LUAD.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

