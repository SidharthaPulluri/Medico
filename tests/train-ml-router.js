const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const inputPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.join(__dirname, "benchmark_real_dev.csv");
const outputPath = process.argv[3] ? path.resolve(process.cwd(), process.argv[3]) : path.join(root, "ml-router-model.js");

const specialtyToCategory = {
  Neurology: "neuro",
  Cardiology: "heart",
  Orthopedics: "bone",
  Psychiatry: "mental",
  Gastroenterology: "stomach",
  Dentistry: "dental",
  ENT: "ent",
  Ophthalmology: "eye",
  Dermatology: "skin",
  Pulmonology: "lung",
  Urology: "urinary",
  "Obstetrics and Gynaecology": "women",
  Pediatrics: "child",
  GeneralMedicine: "general",
};

const stopwords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "by",
  "can",
  "for",
  "from",
  "have",
  "has",
  "i",
  "in",
  "is",
  "it",
  "may",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "with",
  "you",
  "your",
]);

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

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[_/-]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokensFor(text) {
  const words = normalizeText(text)
    .split(" ")
    .filter((word) => word.length >= 3 && !stopwords.has(word));
  const tokens = [...words];
  for (let index = 0; index < words.length - 1; index += 1) {
    tokens.push(`${words[index]} ${words[index + 1]}`);
  }
  return tokens;
}

function increment(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

if (!fs.existsSync(inputPath)) {
  console.error(`Missing training CSV: ${inputPath}`);
  console.error("Run tests/download-public-datasets.ps1 and node tests/build-real-benchmark.js first.");
  process.exit(1);
}

const rows = parseCsv(fs.readFileSync(inputPath, "utf8"));
const docFreq = new Map();
const trainingRows = [];

for (const row of rows) {
  const category = specialtyToCategory[row.expected_specialty];
  if (!category || !row.symptoms) continue;
  const uniqueTokens = new Set(tokensFor(row.symptoms));
  if (!uniqueTokens.size) continue;
  trainingRows.push({ category, tokens: [...uniqueTokens] });
  for (const token of uniqueTokens) increment(docFreq, token);
}

const vocab = [...docFreq.entries()]
  .filter(([, count]) => count >= 2)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 2500)
  .map(([token]) => token);
const vocabSet = new Set(vocab);

const classes = {};
for (const category of Object.values(specialtyToCategory)) {
  classes[category] = { docs: 0, totalTokens: 0, tokens: {} };
}

for (const row of trainingRows) {
  const cls = classes[row.category];
  cls.docs += 1;
  for (const token of row.tokens) {
    if (!vocabSet.has(token)) continue;
    cls.tokens[token] = (cls.tokens[token] || 0) + 1;
    cls.totalTokens += 1;
  }
}

const model = {
  version: 1,
  kind: "multinomial-naive-bayes-router",
  trainedAt: new Date().toISOString(),
  source: path.relative(root, inputPath).replaceAll("\\", "/"),
  categories: Object.values(specialtyToCategory),
  totalDocs: trainingRows.length,
  vocab,
  classes,
};

const js = `window.CAREMATCH_ML_MODEL = ${JSON.stringify(model)};\n`;
fs.writeFileSync(outputPath, js, "utf8");

console.log(`Training rows: ${trainingRows.length}`);
console.log(`Vocabulary size: ${vocab.length}`);
console.log(`Wrote ${outputPath}`);
