import os
import pandas as pd
import numpy as np

DATA_DIR = os.path.dirname(__file__)

class DataService:
    def __init__(self):
        self.df = None
        self.dataset_file = None
        self.load_dataset()

    def load_dataset(self):
        # Look for custom user datasets first, then default
        candidates = [
            os.path.join(DATA_DIR, "tp53_lung_cancer.csv"),
            os.path.join(DATA_DIR, "user_dataset.csv"),
            os.path.join(DATA_DIR, "dataset.csv")
        ]
        
        target = None
        for path in candidates:
            if os.path.exists(path):
                target = path
                break
                
        if not target:
            raise FileNotFoundError("No dataset CSV found in backend/data/")

        self.dataset_file = os.path.basename(target)
        df = pd.read_csv(target)
        
        # Standardize column headers
        col_map = {}
        for c in df.columns:
            clean = c.strip().upper().replace(" ", "_")
            col_map[c] = clean
        df = df.rename(columns=col_map)
        
        # Validate or set fallback defaults for expected columns
        expected_cols = ["PATIENT_ID", "AGE", "SEX", "TP53_MUTATION_STATUS", "TP53_VARIANT_CLASS", "CANCER_SUBTYPE"]
        for col in expected_cols:
            if col not in df.columns:
                print(f"[DataService] Warning: Missing column {col} in dataset.")

        # Clean string columns
        if "PATIENT_ID" in df.columns:
            df["PATIENT_ID"] = df["PATIENT_ID"].astype(str).str.strip()
        if "SEX" in df.columns:
            df["SEX"] = df["SEX"].astype(str).str.strip().str.capitalize()
        if "TP53_MUTATION_STATUS" in df.columns:
            df["TP53_MUTATION_STATUS"] = df["TP53_MUTATION_STATUS"].astype(str).str.strip().str.capitalize()
        if "TP53_VARIANT_CLASS" in df.columns:
            df["TP53_VARIANT_CLASS"] = df["TP53_VARIANT_CLASS"].fillna("None").astype(str).str.strip()
        if "CANCER_SUBTYPE" in df.columns:
            df["CANCER_SUBTYPE"] = df["CANCER_SUBTYPE"].astype(str).str.strip().str.upper()

        self.df = df
        print(f"[DataService] Loaded {len(df)} records from {target}")

    def get_summary_stats(self):
        df = self.df
        total_patients = int(len(df))
        
        mutated_count = int(len(df[df["TP53_MUTATION_STATUS"] == "Mutated"]))
        wildtype_count = int(len(df[df["TP53_MUTATION_STATUS"] == "Wildtype"]))
        mutation_percentage = round((mutated_count / total_patients * 100), 1) if total_patients > 0 else 0.0

        luad_count = int(len(df[df["CANCER_SUBTYPE"] == "LUAD"]))
        lusc_count = int(len(df[df["CANCER_SUBTYPE"] == "LUSC"]))

        # 1. Subtype distribution (LUAD vs LUSC)
        subtype_distribution = [
            {"name": "LUAD (Lung Adenocarcinoma)", "shortName": "LUAD", "count": luad_count, "percentage": round(luad_count / total_patients * 100, 1)},
            {"name": "LUSC (Squamous Cell Carcinoma)", "shortName": "LUSC", "count": lusc_count, "percentage": round(lusc_count / total_patients * 100, 1)},
        ]

        # 2. TP53 Status distribution (Mutated vs Wildtype)
        mutation_distribution = [
            {"name": "Mutated TP53", "status": "Mutated", "count": mutated_count, "percentage": mutation_percentage},
            {"name": "Wildtype TP53", "status": "Wildtype", "count": wildtype_count, "percentage": round(wildtype_count / total_patients * 100, 1)},
        ]

        # 3. TP53 Variant Class distribution (for Mutated)
        mut_df = df[df["TP53_MUTATION_STATUS"] == "Mutated"]
        variant_counts = mut_df["TP53_VARIANT_CLASS"].value_counts()
        variant_distribution = [
            {
                "variantClass": str(k).replace("_", " "),
                "rawName": str(k),
                "count": int(v),
                "percentage": round(int(v) / mutated_count * 100, 1) if mutated_count > 0 else 0
            }
            for k, v in variant_counts.items() if str(k) not in ["None", "Wildtype", "nan"]
        ]

        # 4. Age distribution (binned into 10-year brackets)
        bins = [0, 49, 59, 69, 79, 120]
        labels = ["< 50", "50-59", "60-69", "70-79", "80+"]
        df_copy = df.copy()
        df_copy["age_group"] = pd.cut(df_copy["AGE"], bins=bins, labels=labels, right=True)
        age_counts = df_copy["age_group"].value_counts().reindex(labels, fill_value=0)
        
        age_distribution = [
            {"ageGroup": label, "count": int(age_counts[label]), "percentage": round(int(age_counts[label]) / total_patients * 100, 1)}
            for label in labels
        ]

        # 5. TP53 Mutation Status across Subtypes (Stacked)
        ct = pd.crosstab(df["CANCER_SUBTYPE"], df["TP53_MUTATION_STATUS"])
        subtype_mutation_stacked = []
        for subtype in ["LUAD", "LUSC"]:
            mut = int(ct.loc[subtype, "Mutated"]) if (subtype in ct.index and "Mutated" in ct.columns) else 0
            wt = int(ct.loc[subtype, "Wildtype"]) if (subtype in ct.index and "Wildtype" in ct.columns) else 0
            sub_total = mut + wt
            mut_rate = round(mut / sub_total * 100, 1) if sub_total > 0 else 0
            subtype_mutation_stacked.append({
                "subtype": subtype,
                "fullName": "Lung Adenocarcinoma" if subtype == "LUAD" else "Lung Squamous Cell Carcinoma",
                "Mutated": mut,
                "Wildtype": wt,
                "total": sub_total,
                "mutationRate": mut_rate
            })

        return {
            "dataset_file": self.dataset_file,
            "total_patients": total_patients,
            "mutated_patients": mutated_count,
            "wildtype_patients": wildtype_count,
            "luad_count": luad_count,
            "lusc_count": lusc_count,
            "mutation_percentage": mutation_percentage,
            "charts": {
                "subtype_distribution": subtype_distribution,
                "mutation_distribution": mutation_distribution,
                "variant_distribution": variant_distribution,
                "age_distribution": age_distribution,
                "subtype_mutation_stacked": subtype_mutation_stacked
            }
        }

    def get_gene_explorer_data(self):
        df = self.df
        total_patients = len(df)
        mut_df = df[df["TP53_MUTATION_STATUS"] == "Mutated"]
        
        # Subtype comparisons
        luad_df = df[df["CANCER_SUBTYPE"] == "LUAD"]
        lusc_df = df[df["CANCER_SUBTYPE"] == "LUSC"]
        
        luad_mut = len(luad_df[luad_df["TP53_MUTATION_STATUS"] == "Mutated"])
        luad_total = len(luad_df)
        luad_rate = round(luad_mut / luad_total * 100, 1) if luad_total > 0 else 0
        
        lusc_mut = len(lusc_df[lusc_df["TP53_MUTATION_STATUS"] == "Mutated"])
        lusc_total = len(lusc_df)
        lusc_rate = round(lusc_mut / lusc_total * 100, 1) if lusc_total > 0 else 0

        # Variant breakdown by subtype
        var_by_subtype = pd.crosstab(mut_df["TP53_VARIANT_CLASS"], mut_df["CANCER_SUBTYPE"])
        variant_comparison = []
        for var in var_by_subtype.index:
            if var in ["None", "Wildtype", "nan"]:
                continue
            luad_v = int(var_by_subtype.loc[var, "LUAD"]) if "LUAD" in var_by_subtype.columns else 0
            lusc_v = int(var_by_subtype.loc[var, "LUSC"]) if "LUSC" in var_by_subtype.columns else 0
            variant_comparison.append({
                "variantClass": str(var).replace("_", " "),
                "rawName": str(var),
                "LUAD": luad_v,
                "LUSC": lusc_v,
                "total": luad_v + lusc_v
            })
            
        variant_comparison.sort(key=lambda x: x["total"], reverse=True)

        return {
            "gene_info": {
                "gene_symbol": "TP53",
                "gene_id": "7157",
                "chromosome": "17 (17p13.1)",
                "organism": "Homo sapiens",
                "aliases": ["p53", "LFS1", "TRP53", "BCC7"],
                "protein_name": "Cellular tumor antigen p53",
                "description": "TP53 is a crucial tumor suppressor gene that encodes the p53 transcription factor, historically called the 'Guardian of the Genome'. It responds to diverse cellular stresses (DNA damage, oncogene activation, hypoxia) by initiating cell cycle arrest, DNA repair, senescence, or apoptosis.",
                "molecular_functions": [
                    {"title": "Cell Cycle Regulation", "desc": "Transcriptional upregulation of p21 (CDKN1A) inhibits Cyclin-CDK complexes, arresting cells in G1/S or G2/M checkpoints to facilitate repair."},
                    {"title": "DNA Damage Repair", "desc": "Promotes homologous recombination and nucleotide excision repair by upregulating repair factors like DDB2, XPC, and GADD45."},
                    {"title": "Apoptosis Induction", "desc": "When genomic damage is irreparable, transactivates pro-apoptotic factors (BAX, PUMA, NOXA, FAS) to prevent oncogenic clonal propagation."},
                    {"title": "Metabolic & Redox Homeostasis", "desc": "Inhibits glycolysis (TIGAR) and supports mitochondrial respiration while curbing lethal reactive oxygen species accumulation."}
                ]
            },
            "subtype_comparison": {
                "luad": {
                    "subtype": "LUAD",
                    "fullName": "Lung Adenocarcinoma",
                    "total": luad_total,
                    "mutated": luad_mut,
                    "wildtype": luad_total - luad_mut,
                    "mutation_rate": luad_rate,
                    "characteristics": "Commonly arises in distal airways (alveoli/bronchioles), associated with both smokers and non-smokers, distinct oncogenic drivers (EGFR, KRAS, ALK, BRAF) with ~45-50% TP53 mutation frequency."
                },
                "lusc": {
                    "subtype": "LUSC",
                    "fullName": "Lung Squamous Cell Carcinoma",
                    "total": lusc_total,
                    "mutated": lusc_mut,
                    "wildtype": lusc_total - lusc_mut,
                    "mutation_rate": lusc_rate,
                    "characteristics": "Predominantly central/bronchial origin, overwhelmingly linked to heavy tobacco smoke carcinogens (benzo[a]pyrene), hallmark genomic instability with >80% TP53 inactivation rate."
                },
                "comparison_metrics": [
                    {"metric": "TP53 Mutation Rate", "luad": f"{luad_rate}%", "lusc": f"{lusc_rate}%", "interpretation": "LUSC exhibits nearly double the TP53 mutation frequency compared to LUAD."},
                    {"metric": "Predominant Etiology", "luad": "Glandular / Tobacco & Non-tobacco", "lusc": "Squamous epithelium / High tobacco linkage", "interpretation": "Tobacco carcinogen signature strongly enriches TP53 transversions in LUSC."},
                    {"metric": "Genomic Complexity", "luad": "Often targeted kinase alterations (EGFR/ALK)", "lusc": "Extreme copy number alterations & p53 loss", "interpretation": "TP53 serves as a pivotal discriminant feature in ML subtype classification."}
                ]
            },
            "variant_comparison": variant_comparison
        }

    def search_patients(self, query=None, limit=50, subtype=None, mutation=None):
        df = self.df
        filtered = df.copy()

        if query:
            q = str(query).strip().upper()
            filtered = filtered[filtered["PATIENT_ID"].str.upper().str.contains(q)]

        if subtype and subtype.upper() != "ALL":
            filtered = filtered[filtered["CANCER_SUBTYPE"] == subtype.upper()]

        if mutation and mutation.upper() != "ALL":
            filtered = filtered[filtered["TP53_MUTATION_STATUS"] == mutation.capitalize()]

        total_matches = len(filtered)
        paged = filtered.head(limit)

        records = paged.to_dict(orient="records")
        return {
            "total_matches": total_matches,
            "returned_count": len(records),
            "patients": records
        }

    def get_patient_by_id(self, patient_id):
        df = self.df
        clean_id = str(patient_id).strip().upper()
        match = df[df["PATIENT_ID"].str.upper() == clean_id]
        if match.empty:
            # Try partial match if exact not found
            match = df[df["PATIENT_ID"].str.upper().str.contains(clean_id)]
            if match.empty:
                return None

        record = match.iloc[0].to_dict()
        return record

# Global data service instance
data_service = DataService()

