from pathlib import Path

from transformers import AutoModel, AutoTokenizer

ROOT = Path(__file__).resolve().parents[1]
MODEL_ID = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
MODEL_DIR = ROOT / "models" / "paraphrase-multilingual-MiniLM-L12-v2"


def main():
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    model = AutoModel.from_pretrained(MODEL_ID)
    tokenizer.save_pretrained(MODEL_DIR)
    model.save_pretrained(MODEL_DIR, safe_serialization=True)
    print(f"Downloaded {MODEL_ID}")
    print(f"Saved to {MODEL_DIR}")


if __name__ == "__main__":
    main()
