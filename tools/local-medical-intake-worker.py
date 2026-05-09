import json
import math
import re
import sys
from pathlib import Path

import torch
import torch.nn.functional as F
from transformers import AutoModel, AutoTokenizer

ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT / "models" / "paraphrase-multilingual-MiniLM-L12-v2"

SPECIALTY_BY_SYSTEM = {
    "orthopedic": "Orthopedics",
    "neurology": "Neurology",
    "cardiology": "Cardiology",
    "gastro": "Gastroenterology",
    "psychiatry": "Psychiatry",
    "general": "GeneralMedicine",
    "pulmonology": "Pulmonology",
    "urology": "Urology",
    "dermatology": "Dermatology",
    "ent": "ENT",
    "dental": "Dentistry",
    "ophthalmology": "Ophthalmology",
    "obgyn": "Obstetrics and Gynaecology",
    "pediatrics": "Pediatrics",
}

CONCEPTS = [
    {
        "id": "lower_back_pain",
        "system": "orthopedic",
        "terms": ["lower back pain", "back pain", "backpain", "bakpain", "back ache", "spine pain", "kamar pain", "sonta novu"],
    },
    {
        "id": "functional_limitation",
        "system": "orthopedic",
        "terms": [
            "cannot stand",
            "cannot sit",
            "cannot bend",
            "cannot walk",
            "unable to walk",
            "difficulty standing",
            "difficulty bending",
            "cnt stnd",
            "cnt bend",
            "sitting problem",
            "nilloke agalla",
            "baggoke agalla",
        ],
    },
    {
        "id": "bladder_bowel_loss",
        "system": "orthopedic",
        "red_flag": True,
        "terms": ["bladder control loss", "bowel control loss", "urine control problem", "susu control problem", "saddle numbness"],
    },
    {
        "id": "chest_pressure",
        "system": "cardiology",
        "terms": ["chest pain", "chest pressure", "chest heaviness", "chest tightness", "seene mein dard", "seena dard"],
    },
    {
        "id": "heart_attack_pattern",
        "system": "cardiology",
        "red_flag": True,
        "terms": [
            "chest pain sweating left arm pain",
            "chest heaviness sweating left hand pain",
            "chest pressure sweating jaw pain",
            "heart attack symptoms",
            "seene mein dard pasina left haath pain",
        ],
    },
    {
        "id": "shortness_of_breath",
        "system": "pulmonology",
        "terms": ["shortness of breath", "breathlessness", "breathing problem", "saans problem"],
    },
    {
        "id": "vomiting",
        "system": "gastro",
        "terms": ["vomiting", "vomit", "throwing up", "nausea vomiting", "vaantulu", "vantulu", "vanti"],
    },
    {
        "id": "diarrhea",
        "system": "gastro",
        "terms": ["diarrhea", "diarrhoea", "loose motions", "loose motion", "virechanalu", "virechanaalu", "virechanam", "dast"],
    },
    {
        "id": "abdominal_pain",
        "system": "gastro",
        "terms": ["stomach pain", "abdominal pain", "belly pain", "kadupu noppi", "pet dard", "vayiru vali"],
    },
    {
        "id": "gi_bleeding",
        "system": "gastro",
        "red_flag": True,
        "terms": ["blood in stool", "black stool", "blood vomit", "vomiting blood", "stomach bleeding"],
    },
    {
        "id": "one_sided_weakness",
        "system": "neurology",
        "red_flag": True,
        "terms": ["one sided weakness", "one side weakness", "face drooping", "facial droop", "slurred speech", "weakness of one body side", "stroke symptoms"],
    },
    {
        "id": "headache_migraine",
        "system": "neurology",
        "terms": ["migraine", "headache", "severe headache", "light sensitivity headache", "sir dard", "chakkar", "balance problem"],
    },
    {
        "id": "seizure",
        "system": "neurology",
        "red_flag": True,
        "terms": ["seizure", "fits", "convulsion", "fainting with confusion"],
    },
    {
        "id": "anxiety_panic",
        "system": "psychiatry",
        "terms": ["panic attack", "anxiety", "fear heartbeat", "not sleeping anxiety"],
    },
    {
        "id": "self_harm",
        "system": "psychiatry",
        "red_flag": True,
        "terms": ["self harm", "suicidal thoughts", "hurt myself", "unsafe thoughts"],
    },
    {
        "id": "rash_itching",
        "system": "dermatology",
        "terms": ["skin rash", "itching", "itchy rash", "skin irritation"],
    },
    {
        "id": "urinary_symptoms",
        "system": "urology",
        "terms": ["burning urination", "painful urination", "urine smell", "bladder discomfort"],
    },
    {
        "id": "toothache",
        "system": "dental",
        "terms": ["toothache", "tooth ache", "tooth ace", "tooth pain", "teeth pain", "dental pain", "cavity pain"],
    },
    {
        "id": "dental_abscess",
        "system": "dental",
        "red_flag": True,
        "terms": ["tooth abscess", "dental abscess", "gum swelling", "face swelling tooth pain", "pus from tooth", "trouble swallowing tooth pain"],
    },
    {
        "id": "ent_symptoms",
        "system": "ent",
        "terms": ["ear pain", "earache", "sore throat", "throat pain", "sinus pressure", "blocked nose", "runny nose", "tonsil pain"],
    },
    {
        "id": "ent_red_flag",
        "system": "ent",
        "red_flag": True,
        "terms": ["trouble breathing throat swelling", "heavy nosebleed", "sudden hearing loss", "severe vertigo"],
    },
    {
        "id": "eye_symptoms",
        "system": "ophthalmology",
        "terms": ["eye pain", "red eye", "eye redness", "eye discharge", "conjunctivitis", "blurred vision", "light sensitivity"],
    },
    {
        "id": "eye_red_flag",
        "system": "ophthalmology",
        "red_flag": True,
        "terms": ["vision loss", "chemical in eye", "eye injury", "cannot see", "sudden blurred vision"],
    },
    {
        "id": "obgyn_symptoms",
        "system": "obgyn",
        "terms": ["pregnancy", "pregnant", "period pain", "missed period", "heavy period", "pelvic pain", "vaginal discharge", "white discharge"],
    },
    {
        "id": "obgyn_red_flag",
        "system": "obgyn",
        "red_flag": True,
        "terms": ["pregnancy bleeding", "pregnant bleeding", "severe pelvic pain", "heavy bleeding dizziness"],
    },
    {
        "id": "pediatric_symptoms",
        "system": "pediatrics",
        "terms": ["child fever", "baby fever", "infant fever", "newborn fever", "child vomiting", "baby loose motion", "child rash"],
    },
    {
        "id": "pediatric_red_flag",
        "system": "pediatrics",
        "red_flag": True,
        "terms": ["baby not feeding", "child breathing fast", "blue lips child", "baby under 3 months fever", "child very drowsy"],
    },
    {
        "id": "fever_body_ache",
        "system": "general",
        "terms": ["fever", "body ache", "fatigue", "weakness", "tiredness"],
    },
]


def normalize(text):
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9\s]", " ", str(text).lower().replace("_", " "))).strip()


def mean_pool(model_output, attention_mask):
    token_embeddings = model_output[0]
    mask = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * mask, 1) / torch.clamp(mask.sum(1), min=1e-9)


class LocalMedicalIntake:
    def __init__(self):
        if not MODEL_DIR.exists():
            raise RuntimeError(f"Local model not found at {MODEL_DIR}. Run tools/download-local-embedding-model.py first.")
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
        self.model = AutoModel.from_pretrained(MODEL_DIR)
        self.model.eval()
        phrases = ["; ".join(concept["terms"]) for concept in CONCEPTS]
        self.concept_embeddings = self.embed(phrases)

    def embed(self, texts):
        encoded = self.tokenizer(texts, padding=True, truncation=True, max_length=128, return_tensors="pt")
        with torch.no_grad():
            output = self.model(**encoded)
        embeddings = mean_pool(output, encoded["attention_mask"])
        return F.normalize(embeddings, p=2, dim=1)

    def parse(self, symptoms):
        text = normalize(symptoms)
        if not text:
            return fallback_response()

        query = self.embed([text])
        sims = torch.matmul(query, self.concept_embeddings.T)[0].tolist()
        matches = []
        for idx, concept in enumerate(CONCEPTS):
            lexical = any(normalize(term) in text for term in concept["terms"])
            score = sims[idx] + (0.25 if lexical else 0)
            threshold = 0.56 if not concept.get("red_flag") else 0.68
            if lexical or score >= threshold:
                matches.append((score, concept, lexical))

        matches.sort(key=lambda item: item[0], reverse=True)
        selected = matches[:6]
        if not selected:
            return fallback_response()

        system_scores = {}
        for score, concept, lexical in selected:
            system_scores[concept["system"]] = system_scores.get(concept["system"], 0.0) + score

        system = max(system_scores.items(), key=lambda item: item[1])[0]
        red_flags = [concept["id"] for score, concept, lexical in selected if concept.get("red_flag") and (lexical or score >= 0.82)]
        non_general_systems = {concept["system"] for _, concept, _ in selected if concept["system"] != "general"}
        if len(non_general_systems) >= 3 and not red_flags:
            system = "general"
        concepts = [concept["id"] for _, concept, _ in selected]
        urgency = self.urgency_for(concepts, red_flags, selected)
        specialty = SPECIALTY_BY_SYSTEM.get(system, "GeneralMedicine")
        confidence = min(0.94, max(0.35, selected[0][0]))

        return {
            "understood_symptoms": [concept["terms"][0] for _, concept, _ in selected],
            "concepts": concepts,
            "body_system": system,
            "recommended_specialty": specialty,
            "urgency": urgency,
            "red_flags": red_flags,
            "confidence": round(float(confidence), 3),
            "reason": f"Local multilingual symptom matcher found {', '.join(concepts[:3])}.",
            "source": "local-huggingface-embedding",
        }

    def urgency_for(self, concepts, red_flags, selected):
        if red_flags:
            return "emergency"
        concept_set = set(concepts)
        if {"vomiting", "diarrhea"}.issubset(concept_set) or {"diarrhea", "abdominal_pain"}.issubset(concept_set):
            return "soon"
        if {"lower_back_pain", "functional_limitation"}.issubset(concept_set):
            return "soon"
        if "shortness_of_breath" in concept_set and "chest_pressure" in concept_set:
            return "soon"
        return "soon" if any(score >= 0.62 for score, _, _ in selected) else "routine"


def fallback_response():
    return {
        "understood_symptoms": [],
        "concepts": [],
        "body_system": "general",
        "recommended_specialty": "GeneralMedicine",
        "urgency": "soon",
        "red_flags": [],
        "confidence": 0.25,
        "reason": "Local symptom matcher was uncertain, so General Physician is the safer first step.",
        "source": "local-huggingface-embedding",
    }


def main():
    parser = LocalMedicalIntake()
    print(json.dumps({"ready": True}), flush=True)
    for line in sys.stdin:
        try:
            request = json.loads(line)
            response = parser.parse(request.get("symptoms", ""))
        except Exception as exc:
            response = {"error": str(exc)}
        print(json.dumps(response), flush=True)


if __name__ == "__main__":
    main()
