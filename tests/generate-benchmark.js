const fs = require("fs");
const path = require("path");

const outDir = __dirname;
const allPath = path.join(outDir, "benchmark_all.csv");
const devPath = path.join(outDir, "benchmark_dev.csv");
const hiddenPath = path.join(outDir, "benchmark_hidden_test.csv");

const conditionTemplates = [
  {
    condition: "stroke",
    specialty: "Neurology",
    severity: "emergency",
    stems: [
      "sudden one side weakness facial droop",
      "left side weak speech unclear",
      "sudden numbness arm leg with face asymmetry",
    ],
    followups: ["speech;oneSide;sudden", "oneSide;vision;sudden"],
  },
  {
    condition: "migraine",
    specialty: "Neurology",
    severity: "soon",
    stems: [
      "one sided headache nausea light sensitivity",
      "recurrent migraine like headache with aura",
      "throbbing headache and photophobia",
    ],
    followups: ["vision", ""],
  },
  {
    condition: "myocardial_infarction",
    specialty: "Cardiology",
    severity: "emergency",
    stems: [
      "chest pain sweating left arm pain",
      "heavy chest pressure with breathlessness",
      "chest tightness jaw pain clammy skin",
    ],
    followups: ["sweat;exertion;suddenChest", "sweat;historyHeart;breathingOk"],
  },
  {
    condition: "arrhythmia",
    specialty: "Cardiology",
    severity: "soon",
    stems: [
      "palpitations irregular heartbeat at night",
      "heart racing episodes with mild breathlessness",
      "fluttering heartbeat for two days",
    ],
    followups: ["historyHeart", ""],
  },
  {
    condition: "fracture",
    specialty: "Orthopedics",
    severity: "soon",
    stems: [
      "fall injury severe wrist pain cannot move",
      "twisted ankle after accident difficult walking",
      "possible broken bone after bike crash",
    ],
    followups: ["trauma;walkingNow", "trauma"],
  },
  {
    condition: "cauda_equina_red_flag",
    specialty: "Orthopedics",
    severity: "emergency",
    stems: [
      "back pain leg numbness bladder control loss",
      "severe lower back pain with bowel trouble",
      "spine pain with saddle numbness and bladder issue",
    ],
    followups: ["bladder", "bladder;walkingNow"],
  },
  {
    condition: "anxiety_panic",
    specialty: "Psychiatry",
    severity: "routine",
    stems: [
      "panic anxiety fear heartbeat fast",
      "anxious episodes with poor sleep",
      "stress panic symptoms but settles later",
    ],
    followups: ["noSleep", ""],
  },
  {
    condition: "suicidal_ideation",
    specialty: "Psychiatry",
    severity: "emergency",
    stems: [
      "thoughts of self harm unsafe feeling",
      "hearing voices and may hurt myself",
      "suicidal thoughts with confusion",
    ],
    followups: ["unsafe;hallucination;alone", "unsafe;alone"],
  },
  {
    condition: "viral_gastroenteritis",
    specialty: "Gastroenterology",
    severity: "soon",
    stems: [
      "bloated stomach loosemotions vomiting",
      "stomach cramps diarrhea and nausea",
      "loose motions with belly pain and dehydration",
    ],
    followups: ["feverGI", ""],
  },
  {
    condition: "gi_bleeding",
    specialty: "Gastroenterology",
    severity: "emergency",
    stems: [
      "blood in stool black stool weakness",
      "blood vomit severe abdominal pain",
      "dark stool dehydration and belly rigidity",
    ],
    followups: ["rigid", "rigid;feverGI"],
  },
];

const overlapPhrases = [
  "with mild headache",
  "and little dizziness",
  "plus body weakness",
  "also hot breath",
  "cant sleep well",
  "since yesterday night",
];

const noisyTransforms = [
  (text) => text.replaceAll(" ", ""),
  (text) => text.replace("stomach", "stomac"),
  (text) => text.replace("breath", "breth"),
  (text) => text.replace("loose motions", "loosemotions"),
  (text) => text.replace("cannot", "cant"),
  (text) => text.replace("with", "w/"),
];

function randomChoice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function maybeNoisy(text) {
  let out = text;
  if (Math.random() < 0.35) out = `${out} ${randomChoice(overlapPhrases)}`;
  if (Math.random() < 0.22) out = randomChoice(noisyTransforms)(out);
  return out;
}

function maybeAmbiguous(template, symptoms) {
  const ambiguousMap = {
    migraine: "stroke",
    anxiety_panic: "myocardial_infarction",
    viral_gastroenteritis: "gi_bleeding",
    arrhythmia: "myocardial_infarction",
  };
  if (Math.random() < 0.2 && ambiguousMap[template.condition]) {
    return ambiguousMap[template.condition];
  }
  return "";
}

function makeCase(caseId, template) {
  const symptoms = maybeNoisy(randomChoice(template.stems));
  const ambiguous = maybeAmbiguous(template, symptoms);
  const onset = template.severity === "emergency" ? randomChoice(["minutes", "hours"]) : randomChoice(["days", "weeks", "hours"]);
  const age = template.severity === "emergency" ? randomChoice(["adult", "older"]) : randomChoice(["adult", "child", "older"]);
  const severityNumeric = template.severity === "emergency" ? randomChoice(["8", "9"]) : template.severity === "soon" ? randomChoice(["5", "6", "7"]) : randomChoice(["3", "4"]);

  return {
    case_id: String(caseId),
    symptoms,
    follow_up_answers: randomChoice(template.followups),
    severity: severityNumeric,
    onset,
    age_group: age,
    expected_condition: template.condition,
    expected_condition_alt: ambiguous,
    expected_specialty: template.specialty,
    expected_severity: template.severity,
    reviewer_labeled: Math.random() < 0.12 ? "yes" : "no",
  };
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

function toCsv(rows) {
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  return `${lines.join("\n")}\n`;
}

function splitDevHidden(rows, devRatio = 0.7) {
  const byCondition = new Map();
  for (const row of rows) {
    if (!byCondition.has(row.expected_condition)) byCondition.set(row.expected_condition, []);
    byCondition.get(row.expected_condition).push(row);
  }
  const dev = [];
  const hidden = [];
  for (const list of byCondition.values()) {
    const shuffled = shuffle(list);
    const cut = Math.max(1, Math.floor(shuffled.length * devRatio));
    dev.push(...shuffled.slice(0, cut));
    hidden.push(...shuffled.slice(cut));
  }
  return { dev: shuffle(dev), hidden: shuffle(hidden) };
}

const targetCount = 620;
const rows = [];
let caseId = 1;
while (rows.length < targetCount) {
  for (const template of conditionTemplates) {
    rows.push(makeCase(caseId, template));
    caseId += 1;
    if (rows.length >= targetCount) break;
  }
}

const allRows = shuffle(rows);
const { dev, hidden } = splitDevHidden(allRows, 0.7);

fs.writeFileSync(allPath, toCsv(allRows), "utf8");
fs.writeFileSync(devPath, toCsv(dev), "utf8");
fs.writeFileSync(hiddenPath, toCsv(hidden), "utf8");

console.log(`Generated ${allRows.length} total cases`);
console.log(`Dev set: ${dev.length}`);
console.log(`Hidden test set: ${hidden.length}`);
