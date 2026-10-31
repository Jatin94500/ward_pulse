import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# API Key for authentication (Default provided, can be set via environment variable)
API_KEY = os.getenv("WARD_PULSE_API_KEY", "wardpulse-key-2026")
API_KEY_NAME = "X-API-Key"

# Data paths
DATA_DIR = BASE_DIR / "data"
GEOJSON_PATH = DATA_DIR / "wards.geojson"
WARD_FEATURES_PATH = DATA_DIR / "ward_features_clean.csv"
CITY_RATE_PATH = DATA_DIR / "city_rate.csv"
SUBMISSION_PATH = DATA_DIR / "submission.csv"

# Model paths
MODEL_METADATA_PATH = BASE_DIR / "model_metadata.pkl"
POISSON_BASE_MODEL_PATH = BASE_DIR / "poisson_base_model.pkl"
L1_MAE_MODEL_PATH = BASE_DIR / "l1_mae_model.pkl"
TWEEDIE_MODEL_PATH = BASE_DIR / "tweedie_model.pkl"
POISSON_REG_MODEL_PATH = BASE_DIR / "poisson_regularized_model.pkl"
JOBLIB_BUNDLE_PATH = BASE_DIR / "ward_pulse_model.joblib"
