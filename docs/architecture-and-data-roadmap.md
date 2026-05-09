# CareMatch Architecture and Data Roadmap

## Recommended Stack

| Component | Recommended Source |
| --- | --- |
| Symptom classification | Kaggle symptom datasets, SymCAT |
| Severity prediction | MIMIC-IV, NHAMCS, rule-based red flags |
| Follow-up questions | MedQuAD |
| Medical reasoning | PubMedQA |
| Hospital recommendation | Google Places API |
| Synthetic testing | Synthea |
| Symptom normalization | SNOMED CT |

## First Real Version

Use this progression before attempting full clinical AI:

1. Kaggle symptom datasets for baseline disease/specialty mappings.
2. Synthea synthetic patient journeys for safe conversation-flow testing.
3. Google Places API for real nearby hospital/doctor discovery.
4. Rule-based emergency detection for stroke, cardiac, suicidal ideation, severe breathing issues, GI bleed, trauma, and sepsis-like symptoms.
5. ML only for ranking likely differentials, not for overriding emergency rules.

## Safer Pipeline

The system should not jump straight from symptoms to a single disease label. The safer architecture is:

```text
Symptoms
→ Body system
→ Severity
→ Differential diagnosis
→ Specialty
→ Nearby hospital ranking
```

This is safer, easier to debug, easier to test, and closer to real triage workflows.

## Product Focus

CareMatch should behave like a smart intake nurse, not like a final diagnosis engine.

The most important follow-up questions are routing questions:

- Is one side weaker?
- Any speech difficulty?
- Did symptoms start suddenly?
- Any chest tightness?
- Can you breathe normally?
- Are you unsafe or alone?

These questions improve urgency detection, specialty selection, and ER escalation. That matters more than naming a disease exactly.

## Flagship Metrics

Prioritize these metrics before disease-label accuracy:

1. Specialty routing accuracy.
2. Emergency recall.
3. Under-triage rate.
4. Dangerous misrouting rate.
5. Question efficiency.
6. Explanation quality.

Disease ranking should remain a differential diagnosis aid, not the primary user-facing claim.

## Data Use Notes

- Do not train directly on raw disease labels only.
- Normalize symptoms before classification, ideally with SNOMED CT concepts.
- Separate emergency rule tests from disease-ranking tests.
- Treat Google Places data as dynamic provider discovery, not as medical validation.
- Require human review from clinicians before using real patient-facing language.

## Current Prototype Status

- Free-text symptoms map to body system.
- Follow-up questions refine severity and possible conditions.
- Possible conditions are ranked as differentials, not definitive diagnosis.
- Google Places can be used for live nearby provider discovery when `Maps_api` is configured.
- `tests/run-evaluation.js` provides the first offline benchmark harness.
