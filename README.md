# CareMatch India Doctor Recommendation Prototype

CareMatch India is a browser-based medical navigation prototype. It asks for symptoms, severity, onset, and follow-up risk factors, then recommends a care level, doctor specialty, and sample hospital/doctor options optimized for Indian city workflows and INR self-pay estimates.

Important: this is not a diagnosis tool and does not recommend medicine. Provider costs and quality scores are sample data and should be replaced with verified hospital directory, pricing, insurance, TPA, and availability APIs before real-world use.

Emergency note for India: the Government of India ERSS program uses 112 as the unified emergency number, and ambulance support may also be available through 108 depending on state and provider coverage.

## Run

If you want live Google Places results from the `Maps_api` system environment variable, run:

```powershell
node server.js
```

Then open:

```text
http://localhost:4173
```

Opening `index.html` directly still works, but it cannot read system environment variables.

For the optional Gemini medical language parser, set the `Gemini_Api` system or user environment variable and run through `node server.js`. The key stays server-side. If Gemini is unavailable or quota-limited, CareMatch falls back to the local ML/rules router.

For the local Hugging Face fallback parser, download the model once:

```powershell
python tools\download-local-embedding-model.py
```

This saves `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` under `models/`. The server warms a local Python worker on startup and uses it when Gemini is unavailable, especially for messy English, Hinglish, and transliterated symptoms such as `vaantulu, virechanaalu, kadupu noppi`.

## Features

- Free-text symptom entry followed by inferred, dynamic symptom questions.
- Routing confidence and explanation-first output.
- Top possible-cause ranking for evaluation, shown as differential context rather than a diagnosis.
- Severity and red-flag triage logic.
- Doctor specialty recommendation.
- General Physician fallback for unclear, mixed, or outside-scope symptoms.
- Locality/PIN-code based Google Maps discovery links for nearby hospitals, doctors, and clinics.
- Care route cards with estimated India cost range and clear Maps actions for ratings, distance, phone, reviews, and directions.
- Sorting by best Maps fit, cost-conscious route, or higher-quality route.
- Print-friendly recommendation summary.

## Evaluation

Run the local benchmark:

```powershell
node tests\run-evaluation.js
```

The seed benchmark is in `tests/benchmark_cases.csv`. Expand it toward the 500-2000 case range before treating metrics as meaningful.

To evaluate against downloaded public symptom data:

```powershell
powershell -ExecutionPolicy Bypass -File tests\download-public-datasets.ps1
node tests\build-real-benchmark.js
node tests\train-ml-router.js
node tests\run-evaluation.js tests\benchmark_real_dev.csv
node tests\run-evaluation.js tests\benchmark_real_hidden_test.csv
```

The public datasets include many diseases outside this prototype's current routing scope. The real-data builder maps recognizable rows into CareMatch's supported differential labels and leaves broad General Medicine rows unmapped; the evaluator reports separate condition-scored and specialty-scored denominators for that reason.

`tests/train-ml-router.js` trains a small dependency-free Naive Bayes body-system router from the dev split and writes `ml-router-model.js`. The browser app uses it only as a routing signal with a confidence-gated General Physician fallback; emergency escalation still comes from deterministic red-flag rules.

## Google Maps integration

Without an API key, this prototype opens Google Maps search and directions links based on the user's locality or current coordinates.

To show actual live place listings inside the app, paste a Google Maps JavaScript API key into the app's `Google Maps API key` field. The key must have Maps JavaScript API and Places API enabled. For production, move this behind a backend proxy or restrict the key carefully in Google Cloud Console.
