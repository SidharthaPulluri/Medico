const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const testsDir = __dirname;
const root = path.resolve(testsDir, "..");
const privateDir = path.join(testsDir, "private_data", "mimic-iv-ed");
const triagePath = findExisting([
  path.join(privateDir, "triage.csv"),
  path.join(privateDir, "triage.csv.gz"),
  path.join(privateDir, "ed", "triage.csv"),
  path.join(privateDir, "ed", "triage.csv.gz"),
]);
const outputPath = path.join(testsDir, "benchmark_mimic_ed.csv");

function findExisting(candidates) {
  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
}

function readMaybeGzip(filePath) {
  const data = fs.readFileSync(filePath);
  return filePath.endsWith(".gz") ? zlib.gunzipSync(data).toString("utf8") : data.toString("utf8");
}

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records.map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index] || ""])));
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

function writeCsv(rows, outPath) {
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  fs.writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[_/-]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase));
}

function numeric(value) {
  const n = Number(String(value || "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function severityFromAcuity(row) {
  const acuity = numeric(row.acuity);
  if (acuity === 1 || acuity === 2) return "emergency";
  if (acuity === 3) return "soon";
  if (acuity === 4 || acuity === 5) return "routine";

  const o2sat = numeric(row.o2sat);
  const sbp = numeric(row.sbp);
  const heartrate = numeric(row.heartrate);
  const resprate = numeric(row.resprate);
  if ((o2sat !== null && o2sat < 92) || (sbp !== null && sbp < 90) || (heartrate !== null && heartrate > 130) || (resprate !== null && resprate > 30)) {
    return "emergency";
  }
  return "soon";
}

function routeFromChiefComplaint(row) {
  const text = normalize(row.chiefcomplaint || row.chief_complaint || "");
  const route = { condition: "", specialty: "GeneralMedicine" };

  if (includesAny(text, ["chest pain", "palpit", "syncope", "cardiac", "heart"])) {
    route.condition = includesAny(text, ["chest pain"]) ? "myocardial_infarction" : "arrhythmia";
    route.specialty = "Cardiology";
  } else if (includesAny(text, ["shortness of breath", "sob", "cough", "wheez", "asthma", "pneumonia"])) {
    route.condition = "respiratory_symptoms";
    route.specialty = "Pulmonology";
  } else if (includesAny(text, ["abdominal", "abd pain", "nausea", "vomit", "diarrhea", "rectal bleed", "gi bleed"])) {
    route.condition = includesAny(text, ["bleed", "blood"]) ? "gi_bleeding" : "viral_gastroenteritis";
    route.specialty = "Gastroenterology";
  } else if (includesAny(text, ["headache", "seizure", "stroke", "weakness", "dizzy", "vertigo", "altered mental", "ams"])) {
    route.condition = includesAny(text, ["stroke", "weakness", "altered mental", "ams", "seizure"]) ? "stroke" : "migraine";
    route.specialty = "Neurology";
  } else if (includesAny(text, ["back pain", "neck pain", "fall", "injury", "trauma", "fracture", "ankle", "knee", "shoulder", "hip"])) {
    route.condition = includesAny(text, ["back pain"]) ? "cauda_equina_red_flag" : "fracture";
    route.specialty = "Orthopedics";
  } else if (includesAny(text, ["suicid", "psych", "depression", "anxiety", "panic", "hallucination"])) {
    route.condition = includesAny(text, ["suicid"]) ? "suicidal_ideation" : "anxiety_panic";
    route.specialty = "Psychiatry";
  } else if (includesAny(text, ["rash", "skin", "wound", "cellulitis", "abscess", "burn"])) {
    route.condition = "skin_rash_or_infection";
    route.specialty = "Dermatology";
  } else if (includesAny(text, ["urinary", "urine", "flank", "hematuria", "dysuria"])) {
    route.condition = "urinary_symptoms";
    route.specialty = "Urology";
  } else if (includesAny(text, ["ear", "throat", "sinus", "nasal", "nose", "epistaxis"])) {
    route.condition = "ent_infection";
    route.specialty = "ENT";
  } else if (includesAny(text, ["eye", "vision", "visual"])) {
    route.condition = "eye_infection_or_irritation";
    route.specialty = "Ophthalmology";
  } else if (includesAny(text, ["tooth", "dental"])) {
    route.condition = "toothache";
    route.specialty = "Dentistry";
  } else if (includesAny(text, ["pregnan", "vaginal", "pelvic", "ob", "gyn"])) {
    route.condition = "gynecology_symptoms";
    route.specialty = "Obstetrics and Gynaecology";
  } else if (includesAny(text, ["child", "infant", "baby", "pediatric", "paediatric"])) {
    route.condition = "pediatric_symptoms";
    route.specialty = "Pediatrics";
  }

  return route;
}

if (!triagePath) {
  console.error(`Missing MIMIC-IV-ED triage file.

Expected one of:
  ${path.relative(root, path.join(privateDir, "triage.csv"))}
  ${path.relative(root, path.join(privateDir, "triage.csv.gz"))}
  ${path.relative(root, path.join(privateDir, "ed", "triage.csv"))}
  ${path.relative(root, path.join(privateDir, "ed", "triage.csv.gz"))}

Download MIMIC-IV-ED from PhysioNet after credentialing and place the file there.
`);
  process.exit(1);
}

const rows = parseCsv(readMaybeGzip(triagePath));
const out = [];
let caseId = 1;
for (const row of rows) {
  const chiefComplaint = String(row.chiefcomplaint || row.chief_complaint || "").trim();
  if (!chiefComplaint || chiefComplaint === "___") continue;
  const route = routeFromChiefComplaint(row);
  const severity = severityFromAcuity(row);
  out.push({
    case_id: String(caseId),
    symptoms: chiefComplaint,
    follow_up_answers: "",
    severity: severity === "emergency" ? "8" : severity === "soon" ? "6" : "4",
    onset: severity === "emergency" ? "hours" : "days",
    age_group: "adult",
    expected_condition: route.condition,
    expected_condition_alt: "",
    expected_specialty: route.specialty,
    expected_severity: severity,
    reviewer_labeled: "no",
    source: "mimic_iv_ed_triage_local",
  });
  caseId += 1;
}

if (!out.length) {
  console.error("No usable MIMIC-IV-ED triage rows found.");
  process.exit(1);
}

writeCsv(out, outputPath);
console.log(`MIMIC-IV-ED triage source: ${path.relative(root, triagePath)}`);
console.log(`Converted rows: ${out.length}`);
console.log(`Wrote ${path.relative(root, outputPath)}`);
