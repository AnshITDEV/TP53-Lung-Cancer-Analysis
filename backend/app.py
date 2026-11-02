import os
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS

# Add current dir to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from data.data_service import data_service
from model.model_service import predictor

app = Flask(__name__)
# Enable CORS for all routes (Vite dev server and production)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "TP53 Lung Cancer Analysis Backend",
        "dataset_file": data_service.dataset_file,
        "total_records": len(data_service.df),
        "model_loaded": predictor.is_loaded
    })

@app.route("/api/stats", methods=["GET"])
def get_stats():
    try:
        stats = data_service.get_summary_stats()
        return jsonify({"success": True, "data": stats})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/patients", methods=["GET"])
def get_patients():
    try:
        q = request.args.get("q", "")
        limit = int(request.args.get("limit", 50))
        subtype = request.args.get("subtype", "ALL")
        mutation = request.args.get("mutation", "ALL")

        results = data_service.search_patients(query=q, limit=limit, subtype=subtype, mutation=mutation)
        return jsonify({"success": True, "data": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/patients/<patient_id>", methods=["GET"])
def get_patient_detail(patient_id):
    try:
        patient = data_service.get_patient_by_id(patient_id)
        if not patient:
            return jsonify({"success": False, "error": f"Patient with ID '{patient_id}' not found"}), 404

        # Run prediction on patient features
        pred = predictor.predict({
            "AGE": patient["AGE"],
            "SEX": patient["SEX"],
            "TP53_MUTATION_STATUS": patient["TP53_MUTATION_STATUS"],
            "TP53_VARIANT_CLASS": patient["TP53_VARIANT_CLASS"]
        })

        return jsonify({
            "success": True,
            "patient": patient,
            "prediction": pred
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        payload = request.get_json(force=True) or {}
        
        # Validate inputs
        age = payload.get("age") or payload.get("AGE")
        sex = payload.get("sex") or payload.get("SEX")
        mutation_status = payload.get("tp53_mutation_status") or payload.get("TP53_MUTATION_STATUS")
        variant_class = payload.get("tp53_variant_class") or payload.get("TP53_VARIANT_CLASS")

        if age is None:
            return jsonify({"success": False, "error": "Age is required"}), 400

        result = predictor.predict({
            "AGE": age,
            "SEX": sex,
            "TP53_MUTATION_STATUS": mutation_status,
            "TP53_VARIANT_CLASS": variant_class
        })

        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/gene-info", methods=["GET"])
def get_gene_info():
    try:
        data = data_service.get_gene_explorer_data()
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/model/info", methods=["GET"])
def get_model_info():
    try:
        importances = predictor.get_feature_importances()
        return jsonify({
            "success": True,
            "model_type": "Random Forest Classifier",
            "target": "CANCER_SUBTYPE (LUAD vs LUSC)",
            "features": predictor.feature_names,
            "classes": predictor.classes,
            "feature_importances": importances
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Flask server on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)

