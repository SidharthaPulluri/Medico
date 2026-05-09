const fs = require("fs");
const path = require("path");

const testsDir = __dirname;
const dataDir = path.join(testsDir, "public_data");
const trainPath = path.join(dataDir, "symptom_train.csv");
const testPath = path.join(dataDir, "symptom_test.csv");
const symptom2DiseasePath = path.join(dataDir, "Symptom2Disease.csv");
const optionalIndianDatasetPaths = [
  path.join(dataDir, "indian_healthcare_symptom_disease.csv"),
  path.join(dataDir, "Indian_Healthcare_Symptom_Disease_Mapping.csv"),
  path.join(dataDir, "IndianHealthcareSymptomDiseaseMapping.csv"),
];
const outputAll = path.join(testsDir, "benchmark_real_all.csv");
const outputDev = path.join(testsDir, "benchmark_real_dev.csv");
const outputHidden = path.join(testsDir, "benchmark_real_hidden_test.csv");

let randomState = 0x5eed1234;

function seededRandom() {
  randomState = (randomState * 1664525 + 1013904223) >>> 0;
  return randomState / 0x100000000;
}

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
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
  for (const row of rows) lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  fs.writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
}

function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(seededRandom() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function normalizeClinicalText(text) {
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

function inferRoute(label, symptoms) {
  const text = normalizeClinicalText(`${label} ${symptoms}`);
  const normalizedLabel = normalizeClinicalText(label);
  const route = {
    condition: "",
    specialty: "GeneralMedicine",
    severity: "soon",
  };

  const directLabelRoutes = {
    psoriasis: { condition: "skin_rash_or_infection", specialty: "Dermatology", severity: "soon" },
    acne: { condition: "skin_rash_or_infection", specialty: "Dermatology", severity: "soon" },
    "fungal infection": { condition: "skin_rash_or_infection", specialty: "Dermatology", severity: "soon" },
    impetigo: { condition: "skin_rash_or_infection", specialty: "Dermatology", severity: "soon" },
    "bronchial asthma": { condition: "respiratory_symptoms", specialty: "Pulmonology", severity: "soon" },
    pneumonia: { condition: "respiratory_symptoms", specialty: "Pulmonology", severity: "soon" },
    "urinary tract infection": { condition: "urinary_symptoms", specialty: "Urology", severity: "soon" },
    migraine: { condition: "migraine", specialty: "Neurology", severity: "soon" },
    arthritis: { condition: "fracture", specialty: "Orthopedics", severity: "soon" },
    "cervical spondylosis": { condition: "fracture", specialty: "Orthopedics", severity: "soon" },
    "gastroesophageal reflux disease": { condition: "viral_gastroenteritis", specialty: "Gastroenterology", severity: "soon" },
    "peptic ulcer disease": { condition: "viral_gastroenteritis", specialty: "Gastroenterology", severity: "soon" },
    jaundice: { condition: "viral_gastroenteritis", specialty: "Gastroenterology", severity: "soon" },
    "dimorphic hemorrhoids": { condition: "gi_bleeding", specialty: "Gastroenterology", severity: "soon" },
    diabetes: { condition: "", specialty: "GeneralMedicine", severity: "soon" },
    hypertension: { condition: "arrhythmia", specialty: "Cardiology", severity: "soon" },
    "varicose veins": { condition: "", specialty: "GeneralMedicine", severity: "soon" },
    allergy: { condition: "ent_infection", specialty: "ENT", severity: "soon" },
    "common cold": { condition: "ent_infection", specialty: "ENT", severity: "soon" },
    "drug reaction": { condition: "skin_rash_or_infection", specialty: "Dermatology", severity: "soon" },
    "chicken pox": { condition: "skin_rash_or_infection", specialty: "Dermatology", severity: "soon" },
    dengue: { condition: "", specialty: "GeneralMedicine", severity: "soon" },
    malaria: { condition: "", specialty: "GeneralMedicine", severity: "soon" },
    typhoid: { condition: "", specialty: "GeneralMedicine", severity: "soon" },
    "dental caries": { condition: "toothache", specialty: "Dentistry", severity: "soon" },
    toothache: { condition: "toothache", specialty: "Dentistry", severity: "soon" },
    "tooth abscess": { condition: "dental_abscess_red_flag", specialty: "Dentistry", severity: "emergency" },
    sinusitis: { condition: "ent_infection", specialty: "ENT", severity: "soon" },
    tonsillitis: { condition: "ent_infection", specialty: "ENT", severity: "soon" },
    otitis: { condition: "ent_infection", specialty: "ENT", severity: "soon" },
    conjunctivitis: { condition: "eye_infection_or_irritation", specialty: "Ophthalmology", severity: "soon" },
    "kidney stone": { condition: "urinary_symptoms", specialty: "Urology", severity: "soon" },
    pcos: { condition: "gynecology_symptoms", specialty: "Obstetrics and Gynaecology", severity: "soon" },
    pregnancy: { condition: "gynecology_symptoms", specialty: "Obstetrics and Gynaecology", severity: "soon" },
  };

  if (directLabelRoutes[normalizedLabel]) {
    Object.assign(route, directLabelRoutes[normalizedLabel]);
  }

  const emergencyHints = [
    "stroke",
    "heart attack",
    "myocardial",
    "cardiogenic shock",
    "sepsis",
    "seizure",
    "suicid",
    "self harm",
    "trauma",
    "loss of consciousness",
    "coma",
    "anaphylaxis",
    "stomach bleeding",
  ];

  if (
    includesAny(text, ["suicid", "self harm", "hurt myself", "unsafe"]) ||
    (includesAny(text, ["hallucination", "hearing voices"]) && includesAny(text, ["depression", "confusion"]))
  ) {
    route.condition = "suicidal_ideation";
    route.specialty = "Psychiatry";
    route.severity = "emergency";
  } else if (includesAny(text, ["panic", "anxiety", "depression", "psych", "not sleeping", "insomnia", "hallucination"])) {
    route.condition = "anxiety_panic";
    route.specialty = "Psychiatry";
  } else if (
    includesAny(text, ["weakness of one body side", "altered sensorium", "slurred speech", "facial droop", "paralysis", "stroke"]) ||
    (text.includes("sudden") && includesAny(text, ["one side", "facial", "speech", "vision loss"]))
  ) {
    route.condition = "stroke";
    route.specialty = "Neurology";
    route.severity = "emergency";
  } else if (
    includesAny(text, ["migraine", "light sensitivity", "photophobia"]) ||
    (text.includes("headache") && includesAny(text, ["blurred vision", "spinning movements", "loss of balance"]))
  ) {
    route.condition = "migraine";
    route.specialty = "Neurology";
  } else if (
    includesAny(text, ["heart attack", "myocardial", "cardiogenic shock"]) ||
    (text.includes("chest pain") && includesAny(text, ["sweating", "sweat", "breathlessness", "shortness of breath", "jaw", "left arm"]))
  ) {
    route.condition = "myocardial_infarction";
    route.specialty = "Cardiology";
    route.severity = "emergency";
  } else if (includesAny(text, ["palpitation", "heart racing", "irregular heartbeat", "tachycardia"])) {
    route.condition = "arrhythmia";
    route.specialty = "Cardiology";
  } else if (includesAny(text, ["heart disease", "cardiac", "breathlessness", "shortness of breath"]) && !includesAny(text, ["stomach", "acidity", "reflux"])) {
    route.condition = "arrhythmia";
    route.specialty = "Cardiology";
  } else if (
    includesAny(text, ["blood in stool", "black stool", "blood vomit", "bloody", "stomach bleeding"]) ||
    (text.includes("blood") && includesAny(text, ["stool", "vomit", "abdomen", "stomach", "rectal"]))
  ) {
    route.condition = "gi_bleeding";
    route.specialty = "Gastroenterology";
    route.severity = "emergency";
  } else if (includesAny(text, ["vomit", "nausea", "diarrhea", "diarrhoea", "loose motion", "abdominal pain", "stomach pain", "belly pain", "dehydration", "acidity", "reflux"])) {
    route.condition = "viral_gastroenteritis";
    route.specialty = "Gastroenterology";
  } else if (includesAny(text, ["muscle cramp", "muscle spasm", "muscle tight", "leg cramp"])) {
    route.condition = "muscle_spasm";
    route.specialty = "Neurology";
  } else if (includesAny(text, ["back pain"]) && includesAny(text, ["bladder", "bowel", "saddle", "leg numb", "numbness"])) {
    route.condition = "cauda_equina_red_flag";
    route.specialty = "Orthopedics";
    route.severity = "emergency";
  } else if (includesAny(text, ["fracture", "broken", "fall", "accident", "injury", "joint pain", "bone", "sprain"])) {
    route.condition = "fracture";
    route.specialty = "Orthopedics";
  } else if (includesAny(text, ["rash", "itching", "itchy", "skin", "acne", "pimple", "boil", "pus", "scalp", "nail"])) {
    route.condition = "skin_rash_or_infection";
    route.specialty = "Dermatology";
  } else if (includesAny(text, ["cough", "wheezing", "asthma", "pneumonia", "phlegm", "mucus"])) {
    route.condition = "respiratory_symptoms";
    route.specialty = "Pulmonology";
  } else if (includesAny(text, ["urinary", "urination", "urine", "bladder discomfort", "burning micturition"])) {
    route.condition = "urinary_symptoms";
    route.specialty = "Urology";
  } else if (includesAny(text, ["sneezing", "runny nose", "congestion", "throat", "sinus", "allergy"])) {
    route.condition = "ent_infection";
    route.specialty = "ENT";
  } else if (includesAny(text, ["tooth", "teeth", "dental", "gum", "cavity"])) {
    route.condition = includesAny(text, ["swelling", "abscess", "pus", "fever"]) ? "dental_abscess_red_flag" : "toothache";
    route.specialty = "Dentistry";
    route.severity = route.condition === "dental_abscess_red_flag" ? "emergency" : "soon";
  } else if (includesAny(text, ["eye", "vision", "conjunctivitis", "redness of eyes", "blurred vision"])) {
    route.condition = includesAny(text, ["vision loss", "injury", "chemical"]) ? "eye_emergency_red_flag" : "eye_infection_or_irritation";
    route.specialty = "Ophthalmology";
    route.severity = route.condition === "eye_emergency_red_flag" ? "emergency" : "soon";
  } else if (includesAny(text, ["pregnancy", "pregnant", "period", "menstrual", "pelvic", "vaginal", "pcos"])) {
    route.condition = includesAny(text, ["bleeding", "severe pelvic"]) ? "obgyn_red_flag" : "gynecology_symptoms";
    route.specialty = "Obstetrics and Gynaecology";
    route.severity = route.condition === "obgyn_red_flag" ? "emergency" : "soon";
  } else if (includesAny(text, ["baby", "infant", "newborn", "child fever", "paediatric", "pediatric"])) {
    route.condition = includesAny(text, ["not feeding", "drowsy", "breathing", "blue lips"]) ? "pediatric_red_flag" : "pediatric_symptoms";
    route.specialty = "Pediatrics";
    route.severity = route.condition === "pediatric_red_flag" ? "emergency" : "soon";
  }

  if (emergencyHints.some((hint) => text.includes(hint))) {
    route.severity = "emergency";
  }

  return route;
}

function extractSymptoms(row) {
  const candidates = ["symptoms", "Symptom", "text", "input", "description", "Symptoms", "symptom_description", "complaint", "chief_complaint"];
  for (const key of candidates) {
    if (row[key] && row[key].trim()) return row[key].trim();
  }
  const symptomCols = Object.keys(row).filter((k) => k.toLowerCase().includes("symptom"));
  if (symptomCols.length) return symptomCols.map((k) => row[k]).filter(Boolean).join(", ");
  return "";
}

function extractLabel(row) {
  const candidates = ["disease", "label", "prognosis", "Disease", "target", "diagnosis", "condition", "Disease_Name"];
  for (const key of candidates) {
    if (row[key] && row[key].trim()) return row[key].trim();
  }
  const last = Object.values(row).find((v) => typeof v === "string" && v.trim().length > 1);
  return last || "unknown_condition";
}

function toBenchmarkRows(rows, startId = 1) {
  const out = [];
  let id = startId;
  for (const row of rows) {
    const symptoms = extractSymptoms(row);
    const label = extractLabel(row).toLowerCase().replace(/\s+/g, "_");
    if (!symptoms) continue;
    const route = inferRoute(label, symptoms);
    out.push({
      case_id: String(id),
      symptoms,
      follow_up_answers: "",
      severity: route.severity === "emergency" ? "8" : "6",
      onset: route.severity === "emergency" ? "hours" : "days",
      age_group: "adult",
      expected_condition: route.condition,
      expected_condition_alt: "",
      expected_specialty: route.specialty,
      expected_severity: route.severity,
      reviewer_labeled: "no",
      source: row.__source || "internet_symptom_disease_dataset",
    });
    id += 1;
  }
  return out;
}

function stratifiedSplit(rows, ratio = 0.7) {
  const bySpecialty = new Map();
  for (const row of rows) {
    if (!bySpecialty.has(row.expected_specialty)) bySpecialty.set(row.expected_specialty, []);
    bySpecialty.get(row.expected_specialty).push(row);
  }
  const dev = [];
  const hidden = [];
  for (const list of bySpecialty.values()) {
    const shuffled = shuffle(list);
    const cut = Math.max(1, Math.floor(shuffled.length * ratio));
    dev.push(...shuffled.slice(0, cut));
    hidden.push(...shuffled.slice(cut));
  }
  return { dev: shuffle(dev), hidden: shuffle(hidden) };
}

if (!fs.existsSync(trainPath) || !fs.existsSync(testPath)) {
  console.error("Missing source CSV files. Run tests/download-public-datasets.ps1 first.");
  process.exit(1);
}

const train = parseCsv(fs.readFileSync(trainPath, "utf8"));
const test = parseCsv(fs.readFileSync(testPath, "utf8"));
let sourceRows = [...train, ...test].map((row) => ({ ...row, __source: "internet_symptom_disease_dataset" }));
if (fs.existsSync(symptom2DiseasePath)) {
  const symptom2DiseaseRows = parseCsv(fs.readFileSync(symptom2DiseasePath, "utf8")).map((row) => ({
    ...row,
    __source: "symptom2disease",
  }));
  sourceRows = [...sourceRows, ...symptom2DiseaseRows];
}
for (const indianPath of optionalIndianDatasetPaths) {
  if (!fs.existsSync(indianPath)) continue;
  const indianRows = parseCsv(fs.readFileSync(indianPath, "utf8")).map((row) => ({
    ...row,
    __source: path.basename(indianPath, path.extname(indianPath)),
  }));
  sourceRows = [...sourceRows, ...indianRows];
}
const combined = toBenchmarkRows(sourceRows, 1);

if (combined.length < 500) {
  console.error(`Only ${combined.length} usable rows found. Need at least 500 for this benchmark.`);
  process.exit(1);
}

const { dev, hidden } = stratifiedSplit(combined, 0.7);
writeCsv(combined, outputAll);
writeCsv(dev, outputDev);
writeCsv(hidden, outputHidden);

console.log(`Converted real dataset rows: ${combined.length}`);
console.log(`Dev set rows: ${dev.length}`);
console.log(`Hidden test rows: ${hidden.length}`);
