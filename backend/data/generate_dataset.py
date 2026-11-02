import numpy as np
import pandas as pd

def generate_reference_dataset(output_path="backend/data/dataset.csv", n_samples=600):
    np.random.seed(42)
    
    # LUAD vs LUSC breakdown (approx 53% LUAD, 47% LUSC)
    n_luad = 320
    n_lusc = 280
    
    records = []
    
    # Variant classes for TP53 mutations with realistic probabilities
    variant_classes = [
        "Missense_Mutation",
        "Nonsense_Mutation", 
        "Frame_Shift_Del",
        "Frame_Shift_Ins",
        "Splice_Site",
        "In_Frame_Del"
    ]
    var_weights = [0.63, 0.16, 0.10, 0.04, 0.05, 0.02]
    
    # Generate LUAD cohort
    # TCGA LUAD: ~48% TP53 mutated, 52% Wildtype; balanced sex (47% F, 53% M); Age ~65 std ~9.5
    for i in range(1, n_luad + 1):
        pid = f"TCGA-LUAD-{1000 + i}"
        age = int(np.clip(np.random.normal(65, 9), 38, 86))
        sex = np.random.choice(["Female", "Male"], p=[0.47, 0.53])
        is_mutated = np.random.choice([True, False], p=[0.48, 0.52])
        
        if is_mutated:
            mut_status = "Mutated"
            var_class = np.random.choice(variant_classes, p=var_weights)
        else:
            mut_status = "Wildtype"
            var_class = "None"
            
        records.append({
            "PATIENT_ID": pid,
            "AGE": age,
            "SEX": sex,
            "TP53_MUTATION_STATUS": mut_status,
            "TP53_VARIANT_CLASS": var_class,
            "CANCER_SUBTYPE": "LUAD"
        })
        
    # Generate LUSC cohort
    # TCGA LUSC: ~81% TP53 mutated, 19% Wildtype; Male dominant (26% F, 74% M); Age ~67 std ~8.5
    for i in range(1, n_lusc + 1):
        pid = f"TCGA-LUSC-{2000 + i}"
        age = int(np.clip(np.random.normal(67, 8.5), 42, 88))
        sex = np.random.choice(["Female", "Male"], p=[0.26, 0.74])
        is_mutated = np.random.choice([True, False], p=[0.81, 0.19])
        
        if is_mutated:
            mut_status = "Mutated"
            var_class = np.random.choice(variant_classes, p=var_weights)
        else:
            mut_status = "Wildtype"
            var_class = "None"
            
        records.append({
            "PATIENT_ID": pid,
            "AGE": age,
            "SEX": sex,
            "TP53_MUTATION_STATUS": mut_status,
            "TP53_VARIANT_CLASS": var_class,
            "CANCER_SUBTYPE": "LUSC"
        })
        
    df = pd.DataFrame(records)
    # Shuffle randomly
    df = df.sample(frac=1.0, random_state=42).reset_index(drop=True)
    df.to_csv(output_path, index=False)
    print(f"Saved {len(df)} records to {output_path}")
    print("Summary:")
    print(df["CANCER_SUBTYPE"].value_counts())
    print("\nTP53 Mutation Status by Subtype:")
    print(pd.crosstab(df["CANCER_SUBTYPE"], df["TP53_MUTATION_STATUS"], margins=True))
    print("\nVariant class distribution:")
    print(df[df["TP53_MUTATION_STATUS"] == "Mutated"]["TP53_VARIANT_CLASS"].value_counts())

if __name__ == "__main__":
    generate_reference_dataset()

