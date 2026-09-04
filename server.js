const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFileSync, spawn } = require("child_process");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const GEMINI_MODEL = "gemini-2.0-flash-lite";
let localIntakeWorker = null;
let localIntakeReady = null;
let localIntakeBuffer = "";
const localIntakeQueue = [];

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "POST" && url.pathname === "/api/medical-intake") {
    await handleMedicalIntake(req, res);
    return;
  }
  if (req.method === "GET" && url.pathname === "/api/config.js") {
    sendConfig(req, res);
    return;
  }
  serveFile(req, res, url);
}

function serveFile(req, res, parsedUrl) {
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === "/") pathname = "/index.html";

  if (pathname === "/config.js") {
    sendConfig(req, res);
    return;
  }

  const filePath = path.resolve(root, `.${pathname}`);
  if (!filePath.startsWith(root)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, "Not found");
      return;
    }

    send(res, 200, data, contentTypes[path.extname(filePath)] || "application/octet-stream");
  });
}

function sendConfig(req, res) {
  const key = getMapsApiKey();
  send(
    res,
    200,
    `window.CAREMATCH_CONFIG = ${JSON.stringify({ mapsApiKey: key })};`,
    "application/javascript; charset=utf-8",
  );
}

function getMapsApiKey() {
  return getEnvSecret(["Maps_api", "MAPS_API"]);
}

function getGeminiApiKey() {
  return getEnvSecret(["Gemini_Api", "GEMINI_API", "GEMINI_API_KEY"]);
}

function getEnvSecret(names) {
  const inherited = names.map((name) => process.env[name]).find(Boolean);
  if (inherited) return inherited;
  if (process.platform !== "win32") return "";

  const command = names
    .flatMap((name) => [
      `[Environment]::GetEnvironmentVariable('${name}','User')`,
      `[Environment]::GetEnvironmentVariable('${name}','Machine')`,
    ])
    .join("; ");
  try {
    return execFileSync("powershell.exe", ["-NoProfile", "-Command", command], {
      encoding: "utf8",
      windowsHide: true,
    })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean) || "";
  } catch {
    return "";
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 20_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

async function handleMedicalIntake(req, res) {
  const key = getGeminiApiKey();
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    send(res, 400, JSON.stringify({ error: error.message }), "application/json; charset=utf-8");
    return;
  }

  const symptoms = String(payload.symptoms || "").trim().slice(0, 2000);
  if (symptoms.length < 3) {
    send(res, 400, JSON.stringify({ error: "Symptoms are required." }), "application/json; charset=utf-8");
    return;
  }

  let geminiError = "";
  if (key) {
    try {
      const result = await callGeminiMedicalParser(key, symptoms);
      send(res, 200, JSON.stringify({ ...result, source: "gemini" }), "application/json; charset=utf-8");
      return;
    } catch (error) {
      geminiError = error.message;
    }
  }

  try {
    const result = await callLocalMedicalParser(symptoms);
    send(
      res,
      200,
      JSON.stringify({
        ...result,
        fallback_reason: key ? `Gemini unavailable: ${geminiError}` : "Gemini_Api is not configured on the server.",
      }),
      "application/json; charset=utf-8",
    );
  } catch (error) {
    send(
      res,
      502,
      JSON.stringify({
        error: "Medical parser failed.",
        detail: key ? `Gemini: ${geminiError}; local fallback: ${error.message}` : error.message,
      }),
      "application/json; charset=utf-8",
    );
  }
}

function ensureLocalIntakeWorker() {
  if (localIntakeWorker && !localIntakeWorker.killed) return localIntakeReady;

  localIntakeBuffer = "";
  try {
    localIntakeWorker = spawn("python", [path.join(root, "tools", "local-medical-intake-worker.py")], {
      cwd: root,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch (error) {
    localIntakeWorker = null;
    localIntakeReady = Promise.reject(error);
    return localIntakeReady;
  }

  localIntakeReady = new Promise((resolve, reject) => {
    const startupTimer = setTimeout(() => reject(new Error("Local model worker startup timed out.")), 30000);
    localIntakeWorker.stdout.on("data", (chunk) => {
      localIntakeBuffer += chunk.toString();
      let newlineIndex = localIntakeBuffer.indexOf("\n");
      while (newlineIndex >= 0) {
        const line = localIntakeBuffer.slice(0, newlineIndex).trim();
        localIntakeBuffer = localIntakeBuffer.slice(newlineIndex + 1);
        if (line) handleLocalWorkerLine(line, resolve, startupTimer);
        newlineIndex = localIntakeBuffer.indexOf("\n");
      }
    });
    localIntakeWorker.stderr.on("data", (chunk) => {
      console.log(`Local intake worker: ${chunk.toString().trim()}`);
    });
    localIntakeWorker.on("exit", () => {
      localIntakeWorker = null;
      while (localIntakeQueue.length) {
        localIntakeQueue.shift().reject(new Error("Local intake worker exited."));
      }
    });
    localIntakeWorker.on("error", (error) => {
      localIntakeWorker = null;
      while (localIntakeQueue.length) {
        localIntakeQueue.shift().reject(error);
      }
      reject(error);
    });
  });

  return localIntakeReady;
}

function handleLocalWorkerLine(line, readyResolve, startupTimer) {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return;
  }
  if (message.ready) {
    clearTimeout(startupTimer);
    readyResolve();
    return;
  }
  const pending = localIntakeQueue.shift();
  if (!pending) return;
  if (message.error) pending.reject(new Error(message.error));
  else pending.resolve(sanitizeMedicalIntake(message));
}

async function callLocalMedicalParser(symptoms) {
  await ensureLocalIntakeWorker();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Local model worker request timed out."));
    }, 12000);
    localIntakeQueue.push({
      resolve: (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      reject: (error) => {
        clearTimeout(timer);
        reject(error);
      },
    });
    localIntakeWorker.stdin.write(`${JSON.stringify({ symptoms })}\n`);
  });
}

async function callGeminiMedicalParser(key, symptoms) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`;
  const prompt = `
You are a medical intake language parser for a doctor-routing app in India.
Do not diagnose, prescribe medicine, or provide treatment advice.
Convert messy user symptom text into strict JSON for routing.

Allowed specialties:
GeneralMedicine, Orthopedics, Neurology, Cardiology, Gastroenterology, Psychiatry, Dermatology, ENT, Dentistry, Ophthalmology, Pulmonology, Urology, Obstetrics and Gynaecology, Pediatrics

Allowed urgency values:
routine, soon, emergency

Return only JSON with this shape:
{
  "understood_symptoms": ["plain English symptom phrases"],
  "concepts": ["snake_case_symptom_or_red_flag_concepts"],
  "body_system": "short body system",
  "recommended_specialty": "one allowed specialty",
  "urgency": "routine|soon|emergency",
  "red_flags": ["snake_case_red_flags"],
  "confidence": 0.0,
  "reason": "one short routing reason"
}

Prefer GeneralMedicine when symptoms are vague or mixed.
Emergency only for clear red flags such as stroke-like symptoms, severe chest pain with sweating/left arm/jaw pain, severe breathing trouble, self-harm, seizure, GI bleeding, major trauma, or back pain with bladder/bowel/saddle numbness.

User symptoms: ${JSON.stringify(symptoms)}
`.trim();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    }),
    signal: AbortSignal.timeout(8000),
  });

  const body = await response.text();
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${body.slice(0, 300)}`);

  const data = JSON.parse(body);
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  if (!text) throw new Error("Gemini returned no parser text.");

  return sanitizeMedicalIntake(JSON.parse(text));
}

function sanitizeMedicalIntake(raw) {
  const allowedSpecialties = new Set([
    "GeneralMedicine",
    "Orthopedics",
    "Neurology",
    "Cardiology",
    "Gastroenterology",
    "Psychiatry",
    "Dermatology",
    "ENT",
    "Dentistry",
    "Ophthalmology",
    "Pulmonology",
    "Urology",
    "Obstetrics and Gynaecology",
    "Pediatrics",
  ]);
  const allowedUrgency = new Set(["routine", "soon", "emergency"]);

  return {
    understood_symptoms: Array.isArray(raw.understood_symptoms) ? raw.understood_symptoms.slice(0, 12).map(String) : [],
    concepts: Array.isArray(raw.concepts) ? raw.concepts.slice(0, 20).map((item) => String(item).toLowerCase()) : [],
    body_system: String(raw.body_system || "general").slice(0, 60),
    recommended_specialty: allowedSpecialties.has(raw.recommended_specialty) ? raw.recommended_specialty : "GeneralMedicine",
    urgency: allowedUrgency.has(raw.urgency) ? raw.urgency : "soon",
    red_flags: Array.isArray(raw.red_flags) ? raw.red_flags.slice(0, 12).map((item) => String(item).toLowerCase()) : [],
    confidence: Math.max(0, Math.min(1, Number(raw.confidence) || 0)),
    reason: String(raw.reason || "Routed from symptom language understanding.").slice(0, 240),
    source: String(raw.source || "medical-parser").slice(0, 80),
  };
}

http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    send(res, 500, `Server error: ${error.message}`);
  });
}).listen(port, () => {
  console.log(`CareMatch India running at http://localhost:${port}`);
  if (!getMapsApiKey()) {
    console.log("Maps_api is not set. Live Google Places mode will be disabled.");
  }
  if (!getGeminiApiKey()) {
    console.log("Gemini_Api is not set. Medical language parser will use local routing only.");
  }
  ensureLocalIntakeWorker()
    .then(() => console.log("Local Hugging Face medical parser is ready."))
    .catch((error) => console.log(`Local Hugging Face medical parser unavailable: ${error.message}`));
});
