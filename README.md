# TP53 Lung Cancer Analysis System – Bioinformatics and Machine Learning

A biomedical analytics dashboard exploring the relationship between somatic mutations in the **TP53** tumor suppressor gene (Gene ID: 7157, Chromosome 17p13.1) and two prominent non-small cell lung cancer (NSCLC) subtypes:
1. **LUAD** – Lung Adenocarcinoma
2. **LUSC** – Lung Squamous Cell Carcinoma

---

## 🔬 Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Data Visualization**: Recharts
- **Iconography**: Lucide React
- **Backend**: Python Flask, Flask-CORS
- **Machine Learning & Analytics**: Scikit-Learn (Random Forest Classifier), Pandas, NumPy, Joblib

---

## 🧬 Project Architecture

```
BM-MiniProject/
├── backend/
│   ├── app.py                      # Flask REST API endpoints
│   ├── requirements.txt            # Python dependencies
│   ├── data/
│   │   ├── dataset.csv             # Standardized TCGA reference clinical cohort (600 patients)
│   │   ├── generate_dataset.py     # Deterministic benchmark cohort generator
│   │   └── data_service.py         # Dynamic CSV ingestion & statistical aggregation
│   └── model/
│       ├── rf_model.joblib         # Serialized Scikit-learn Random Forest model
│       └── model_service.py        # Model inference pipeline & probability engine
│
├── frontend/
│   ├── index.html                  # HTML entry point with Inter & JetBrains fonts
│   ├── package.json
│   ├── vite.config.js              # Vite bundler & backend API reverse proxy
│   ├── tailwind.config.js          # Dark navy + burgundy theme configuration
│   └── src/
│       ├── App.jsx                 # Application shell & state router
│       ├── api/
│           └── apiService.js       # Centralized REST API client
│       ├── components/
│       │   ├── Sidebar.jsx         # Responsive sidebar with active indicators
│       │   ├── Header.jsx          # Top status navbar
│       │   ├── MetricCard.jsx      # Summary metrics with hover glow
│       │   ├── ChartCard.jsx       # Recharts container wrapper
│       │   └── Footer.jsx          # Academic attribution & stack info
│       └── pages/
│           ├── DashboardPage.jsx   # PAGE 1: Cohort overview & 5 Recharts
│           ├── PatientAnalysisPage.jsx # PAGE 2: Patient lookup & ML subtype predictor
│           └── GeneExplorerPage.jsx    # PAGE 3: TP53 Gene ID 7157 & LUAD vs LUSC
│
└── README.md
```

---

## 🚀 Running the Project

### 1. Start the Flask Backend (Port 5000)
```powershell
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```
Backend will be active at: `http://127.0.0.1:5000`

### 2. Start the React Frontend (Port 5173)
```powershell
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install --legacy-peer-deps

# Run the development server
npm run dev
```
Frontend will be active at: `http://127.0.0.1:5173`

---

## 📑 Website Pages & Features

### 1. Page 1: Dashboard (`/`)
- **Key Metrics**:
  - Total number of patients
  - Total TP53 mutated patients
  - Total wildtype patients
  - LUAD patient count
  - LUSC patient count
  - TP53 mutation percentage
- **Interactive Recharts**:
  1. *LUAD vs LUSC Distribution* (Donut Chart)
  2. *TP53 Mutated vs Wildtype* (Pie Chart)
  3. *TP53 Variant Class Distribution* (Bar Chart)
  4. *Patient Age Distribution* (Histogram / Binned Bar Chart)
  5. *TP53 Mutation Status Across Cancer Subtypes* (Stacked Bar Chart)
- **Biological Context**:
  - Section detailing TP53's role as the *Guardian of the Genome*, cell cycle checkpoints, and biological differences between adenocarcinoma and squamous cell carcinoma.

### 2. Page 2: Patient Analysis
- **Patient Search**:
  - Search any patient by `PATIENT_ID` (e.g., `TCGA-LUAD-1001`, `TCGA-LUSC-2001`).
  - One-click sample selector pills for immediate testing.
- **Patient Profile**:
  - Patient ID, Age, Sex, TP53 mutation status, TP53 variant class, and confirmed cancer subtype.
- **Random Forest Model Evaluation**:
  - Real-time subtype prediction (`LUAD` vs `LUSC`).
  - Prediction confidence and dual animated probability bars.
  - Concordance assessment comparing model prediction to histological diagnosis.
- **Interactive What-If Clinical Feature Predictor**:
  - Custom feature form allowing researchers to adjust Age, Sex, TP53 Mutation Status, and Variant Class to observe immediate model classification probabilities.

### 3. Page 3: TP53 Gene Explorer
- **Gene Information**:
  - Gene ID: `7157`
  - Chromosome: `17` (`17p13.1`)
  - Organism: `Homo sapiens`
  - Canonical protein: Cellular tumor antigen p53 (393 amino acids)
- **Molecular Pathway Roles**:
  - G1/S checkpoint cell cycle arrest (p21 / CDKN1A axis)
  - DNA damage repair machinery
  - Apoptosis induction (BAX, PUMA, NOXA)
  - Cellular senescence and metabolic regulation
- **Dataset-Derived Visualizations**:
  - Comparative bar chart showing mutation variant classes in LUAD vs LUSC.
  - Subtype divergence summary table (rates, carcinogen signatures, clinical implications).
  - Strictly conforms to dataset schema (no unsupported codon or DNA sequence assumptions).

---

## 🔄 How to Plug In Your Actual CSV Dataset & Joblib Model in the Next Step

1. **Custom CSV Dataset**:
   - Place your dataset CSV file in `backend/data/` as either `tp53_lung_cancer.csv` or `user_dataset.csv`.
   - Ensure the column headers contain:
     - `PATIENT_ID`
     - `AGE`
     - `SEX`
     - `TP53_MUTATION_STATUS`
     - `TP53_VARIANT_CLASS`
     - `CANCER_SUBTYPE`
   - `data_service.py` will automatically detect and load your file upon restart.

2. **Custom Trained Joblib Model**:
   - Save your trained Scikit-learn Pipeline or RandomForestClassifier as `backend/model/rf_model.joblib`.
   - `model_service.py` will automatically load your model file.

