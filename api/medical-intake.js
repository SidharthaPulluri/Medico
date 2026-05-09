const GEMINI_MODEL = "gemini-2.0-flash-lite";

function getGeminiApiKey() {
  return process.env.Gemini_Api || process.env.GEMINI_API || process.env.GEMINI_API_KEY || "";
}

function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);

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
    source: "gemini",
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  const symptoms = String(payload.symptoms || "").trim().slice(0, 2000);
  if (symptoms.length < 3) {
    res.status(400).json({ error: "Symptoms are required." });
    return;
  }

  const key = getGeminiApiKey();
  if (!key) {
    res.status(200).json({
      understood_symptoms: [],
      concepts: [],
      body_system: "general",
      recommended_specialty: "GeneralMedicine",
      urgency: "soon",
      red_flags: [],
      confidence: 0,
      reason: "Gemini_Api is not configured on the deployed server. Local browser routing is being used.",
      source: "rules-only",
    });
    return;
  }

  try {
    res.status(200).json(await callGeminiMedicalParser(key, symptoms));
  } catch (error) {
    res.status(502).json({
      error: "Medical parser failed.",
      detail: error.message,
    });
  }
};
