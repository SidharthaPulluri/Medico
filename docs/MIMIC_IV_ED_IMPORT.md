# MIMIC-IV-ED local import

MIMIC-IV and MIMIC-IV-ED are credentialed PhysioNet datasets. Do not commit the raw files or derived MIMIC-trained model files to this repository.

## Access

Use the MIMIC-IV-ED module, not the general ICU module, for this app's severity router. The useful table is `triage`, which includes:

- `chiefcomplaint`
- `temperature`
- `heartrate`
- `resprate`
- `o2sat`
- `sbp`
- `dbp`
- `pain`
- `acuity`

In MIMIC-IV-ED, `acuity` is an integer where `1` is highest severity and `5` is lowest severity.

## File placement

After PhysioNet credentialing and DUA approval, download MIMIC-IV-ED and place one of these files locally:

```text
tests/private_data/mimic-iv-ed/triage.csv
tests/private_data/mimic-iv-ed/triage.csv.gz
tests/private_data/mimic-iv-ed/ed/triage.csv
tests/private_data/mimic-iv-ed/ed/triage.csv.gz
```

`tests/private_data/` is ignored by git.

## Build a local MIMIC benchmark

```powershell
node tests\build-mimic-ed-benchmark.js
```

This writes:

```text
tests/benchmark_mimic_ed.csv
```

That file is also ignored by git because it is derived from credentialed data.

## Train a local-only MIMIC-derived model

```powershell
node tests\train-ml-router.js tests\benchmark_mimic_ed.csv ml-router-model.mimic-local.js
```

Do not publish `ml-router-model.mimic-local.js`. PhysioNet guidance treats datasets or models derived from MIMIC as sensitive and subject to the source agreement.

## Mapping used

Severity:

- `acuity` 1-2 -> `emergency`
- `acuity` 3 -> `soon`
- `acuity` 4-5 -> `routine`
- missing acuity can still become `emergency` from vital-sign red flags

Specialty:

The importer maps `chiefcomplaint` keywords into CareMatch routes such as Cardiology, Pulmonology, Gastroenterology, Neurology, Orthopedics, Psychiatry, Dermatology, Urology, ENT, Ophthalmology, Dentistry, OBGYN, Pediatrics, and General Medicine.
