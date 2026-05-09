# CareMatch routing data workflow

This app should learn from symptom text and routed specialties, not from diagnosis labels directly.

## Current useful sources

1. `tests/benchmark_cases.csv`
   - Small reviewed benchmark.
   - Best place to add high-value edge cases.

2. `tests/public_data/Symptom2Disease.csv`
   - Natural-language symptom descriptions.
   - Mapped from disease label to CareMatch specialty in `tests/build-real-benchmark.js`.

3. Optional Indian symptom-disease CSV
   - Place one of these filenames in `tests/public_data/`:

```text
tests/public_data/indian_healthcare_symptom_disease.csv
tests/public_data/Indian_Healthcare_Symptom_Disease_Mapping.csv
tests/public_data/IndianHealthcareSymptomDiseaseMapping.csv
```

The builder tries to read common columns such as:

```text
symptoms
Symptoms
text
description
complaint
chief_complaint
disease
Disease
diagnosis
condition
```

## Manual cases

Use `tests/manual_cases_template.csv` as the format for collecting real user-style phrases.

Recommended columns:

```csv
symptoms,expected_specialty,expected_severity,notes
```

Examples:

```csv
"tooth ace",Dentistry,soon,"typo for tooth ache"
"kadupu noppi loose motions",Gastroenterology,soon,"Telugu transliteration"
"baby fever not feeding very drowsy",Pediatrics,emergency,"child red flag"
```

When a case should become part of the locked benchmark, add it to `tests/benchmark_cases.csv` with a condition id.

## Rebuild and retrain

```powershell
node tests\build-real-benchmark.js
node tests\train-ml-router.js tests\benchmark_real_dev.csv ml-router-model.js
node tests\run-evaluation.js tests\benchmark_real_hidden_test.csv
node tests\run-evaluation.js tests\benchmark_cases.csv
```

## Route philosophy

- Use deterministic rules for red flags.
- Use the small ML router for specialty/body-system hints.
- Keep General Physician as the fallback for mixed, vague, or unsupported symptoms.
- Treat disease labels as training hints only; the app should recommend a doctor type, not diagnose.
