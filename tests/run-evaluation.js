const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "app.js");
const benchmarkPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(__dirname, "benchmark_cases.csv");

const severityRank = { routine: 1, soon: 2, emergency: 3 };

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

function makeDom() {
  const handlers = new Map();
  const elements = new Map();
  const classList = () => ({
    names: new Set(["hidden"]),
    add(name) {
      this.names.add(name);
    },
    remove(name) {
      this.names.delete(name);
    },
    contains(name) {
      return this.names.has(name);
    },
  });

  function el(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        value: defaults[id] || "",
        innerHTML: "",
        textContent: "",
        className: "",
        classList: classList(),
        addEventListener(type, fn) {
          handlers.set(`${id}:${type}`, fn);
        },
        reset() {},
      });
    }
    return elements.get(id);
  }

  const defaults = {
    severity: "4",
    onset: "days",
    ageGroup: "adult",
    location: "504272",
    budget: "balanced",
    distancePreference: "nearby",
    sortProviders: "fit",
    mapsApiKey: "",
  };

  return {
    context: {
      document: {
        getElementById: el,
        createElement() {
          return { style: {} };
        },
        body: { appendChild() {} },
        head: { appendChild() {} },
      },
      window: { CAREMATCH_CONFIG: {}, print() {} },
      navigator: {},
      localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
      console,
    },
    el,
    handlers,
  };
}

function predictCase(testCase) {
  const { context, el, handlers } = makeDom();
  vm.createContext(context);
  const modelPath = path.join(root, "ml-router-model.js");
  if (fs.existsSync(modelPath)) {
    vm.runInContext(fs.readFileSync(modelPath, "utf8"), context);
  }
  vm.runInContext(fs.readFileSync(appPath, "utf8"), context);

  el("symptomInput").value = testCase.symptoms;
  el("severity").value = testCase.severity;
  el("onset").value = testCase.onset;
  el("ageGroup").value = testCase.age_group;
  context.startGuidedQa();

  const answers = new Set(testCase.follow_up_answers.split(";").filter(Boolean));
  const questionHandler = handlers.get("dynamicQuestions:change");
  for (const answer of answers) {
    questionHandler?.({ target: { name: "question", value: answer, checked: true } });
  }

  const assessment = context.assess();
  const emergencyConfidence =
    assessment.routingConfidence === "high" ? 0.9 : assessment.routingConfidence === "medium" ? 0.65 : 0.35;
  return {
    conditionIds: assessment.differentials.map((condition) => condition.id),
    specialty: assessment.category.specialty,
    severity: assessment.level,
    emergencyConfidence,
  };
}

function evaluate(cases) {
  const totals = {
    count: cases.length,
    conditionCases: 0,
    specialtyCases: 0,
    top1: 0,
    top3: 0,
    specialty: 0,
    severity: 0,
    emergencyCases: 0,
    emergencyDetected: 0,
    underTriaged: 0,
    dangerousMisroutes: 0,
    overTriaged: 0,
  };
  const misses = [];
  const calibration = [];

  for (const testCase of cases) {
    const prediction = predictCase(testCase);
    const acceptableConditions = [testCase.expected_condition, testCase.expected_condition_alt].filter(Boolean);
    const conditionScored = acceptableConditions.length > 0;
    const top1 = conditionScored && acceptableConditions.includes(prediction.conditionIds[0]);
    const top3 = conditionScored && prediction.conditionIds.slice(0, 3).some((id) => acceptableConditions.includes(id));
    const specialtyScored = Boolean(testCase.expected_specialty);
    const specialty = specialtyScored && prediction.specialty.toLowerCase() === testCase.expected_specialty.toLowerCase();
    const severity = prediction.severity === testCase.expected_severity;
    const expectedEmergency = testCase.expected_severity === "emergency";

    if (conditionScored) totals.conditionCases += 1;
    if (specialtyScored) totals.specialtyCases += 1;
    if (top1) totals.top1 += 1;
    if (top3) totals.top3 += 1;
    if (specialty) totals.specialty += 1;
    if (severity) totals.severity += 1;
    if (expectedEmergency) {
      totals.emergencyCases += 1;
      if (prediction.severity === "emergency") totals.emergencyDetected += 1;
    }
    if (severityRank[prediction.severity] < severityRank[testCase.expected_severity]) totals.underTriaged += 1;
    if (severityRank[prediction.severity] > severityRank[testCase.expected_severity]) totals.overTriaged += 1;
    if (expectedEmergency && prediction.severity !== "emergency") totals.dangerousMisroutes += 1;
    calibration.push({ y: expectedEmergency ? 1 : 0, p: prediction.emergencyConfidence });

    if ((conditionScored && !top3) || (specialtyScored && !specialty) || !severity) {
      misses.push({
        case_id: testCase.case_id,
        expected: `${acceptableConditions.join("|") || "unmapped"}/${testCase.expected_specialty}/${testCase.expected_severity}`,
        predicted: `${prediction.conditionIds.slice(0, 3).join("|")}/${prediction.specialty}/${prediction.severity}`,
      });
    }
  }

  return { totals, misses, calibration };
}

function calibrationMetrics(points) {
  if (!points.length) return { brier: 0, ece: 0 };
  const brier = points.reduce((sum, point) => sum + (point.p - point.y) ** 2, 0) / points.length;

  const bins = [0, 0.2, 0.4, 0.6, 0.8, 1.01];
  let ece = 0;
  for (let i = 0; i < bins.length - 1; i += 1) {
    const lo = bins[i];
    const hi = bins[i + 1];
    const inBin = points.filter((point) => point.p >= lo && point.p < hi);
    if (!inBin.length) continue;
    const avgP = inBin.reduce((sum, point) => sum + point.p, 0) / inBin.length;
    const avgY = inBin.reduce((sum, point) => sum + point.y, 0) / inBin.length;
    ece += (inBin.length / points.length) * Math.abs(avgP - avgY);
  }
  return { brier, ece };
}

function pct(value, total) {
  return total ? `${((value / total) * 100).toFixed(1)}%` : "n/a";
}

const cases = parseCsv(fs.readFileSync(benchmarkPath, "utf8"));
const { totals, misses, calibration } = evaluate(cases);
const calib = calibrationMetrics(calibration);

console.log("CareMatch Evaluation");
console.log(`Dataset: ${benchmarkPath}`);
console.log(`Cases: ${totals.count}`);
console.log(`Condition-scored cases: ${totals.conditionCases}`);
console.log(`Top-1 condition accuracy: ${pct(totals.top1, totals.conditionCases)}`);
console.log(`Top-3 condition accuracy: ${pct(totals.top3, totals.conditionCases)}`);
console.log(`Specialty-scored cases: ${totals.specialtyCases}`);
console.log(`Specialty accuracy: ${pct(totals.specialty, totals.specialtyCases)}`);
console.log(`Severity accuracy: ${pct(totals.severity, totals.count)}`);
console.log(`Emergency recall: ${pct(totals.emergencyDetected, totals.emergencyCases)}`);
console.log(`Under-triage rate: ${pct(totals.underTriaged, totals.count)}`);
console.log(`Over-triage rate: ${pct(totals.overTriaged, totals.count)}`);
console.log(`Dangerous misrouting rate: ${pct(totals.dangerousMisroutes, totals.count)}`);
console.log(`Emergency confidence Brier score: ${calib.brier.toFixed(3)}`);
console.log(`Emergency confidence ECE: ${calib.ece.toFixed(3)}`);

if (misses.length) {
  console.log("\nMisses / review queue:");
  for (const miss of misses.slice(0, 20)) {
    console.log(`- Case ${miss.case_id}: expected ${miss.expected}; predicted ${miss.predicted}`);
  }
}
