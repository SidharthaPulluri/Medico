const categories = [
  {
    id: "neuro",
    name: "Brain & nerves",
    hint: "Weakness, paralysis, seizure, dizziness",
    specialty: "Neurology",
    symptoms: [
      { id: "paralysis", label: "Sudden weakness or slight paralysis", weight: 5, redFlag: true },
      { id: "facial-droop", label: "Facial droop or one-sided numbness", weight: 5, redFlag: true },
      { id: "seizure", label: "Seizure or fainting with confusion", weight: 5, redFlag: true },
      { id: "headache", label: "Severe unusual headache", weight: 4, redFlag: true },
      { id: "cramps", label: "Muscle cramps or spasms", weight: 2 },
      { id: "mood", label: "Mood swings or personality changes", weight: 2 },
      { id: "dizziness", label: "Dizziness or balance trouble", weight: 3 },
    ],
    questions: [
      { id: "sudden", label: "Did these symptoms start suddenly?", risk: 4 },
      { id: "speech", label: "Trouble speaking or understanding words", risk: 4 },
      { id: "vision", label: "New vision loss or double vision", risk: 3 },
      { id: "oneSide", label: "Symptoms are stronger on one side of the body", risk: 4 },
      { id: "breathingOk", label: "Can you breathe normally right now?", risk: 0, inverseRisk: 4 },
    ],
  },
  {
    id: "heart",
    name: "Heart & chest",
    hint: "Chest pain, palpitations, breathlessness",
    specialty: "Cardiology",
    symptoms: [
      { id: "chest-pain", label: "Chest pain or pressure", weight: 5, redFlag: true },
      { id: "breath", label: "Shortness of breath", weight: 4, redFlag: true },
      { id: "palpitations", label: "Irregular heartbeat or palpitations", weight: 3 },
      { id: "swelling", label: "Leg swelling with fatigue", weight: 3 },
      { id: "jaw-arm", label: "Pain spreading to jaw or arm", weight: 5, redFlag: true },
    ],
    questions: [
      { id: "suddenChest", label: "Did chest symptoms start suddenly?", risk: 3 },
      { id: "sweat", label: "Cold sweat, nausea, or clammy skin", risk: 3 },
      { id: "exertion", label: "Worse during walking, stairs, or exertion", risk: 2 },
      { id: "historyHeart", label: "Known heart disease or high blood pressure", risk: 2 },
      { id: "breathingOk", label: "Can you breathe normally right now?", risk: 0, inverseRisk: 4 },
    ],
  },
  {
    id: "bone",
    name: "Bones & muscles",
    hint: "Joint pain, injury, back pain",
    specialty: "Orthopedics",
    symptoms: [
      { id: "fracture", label: "Possible fracture or major injury", weight: 4, redFlag: true },
      { id: "back-pain", label: "Back pain", weight: 2 },
      { id: "joint", label: "Joint pain or swelling", weight: 2 },
      { id: "walking", label: "Unable to walk normally", weight: 3 },
      { id: "numb-leg", label: "Numbness with back pain", weight: 4, redFlag: true },
    ],
    questions: [
      { id: "trauma", label: "Pain started after fall, crash, or heavy impact", risk: 3 },
      { id: "feverBone", label: "Fever with joint or back pain", risk: 3 },
      { id: "bladder", label: "Loss of bladder or bowel control", risk: 5 },
      { id: "walkingNow", label: "Can you stand or walk safely?", risk: 0, inverseRisk: 3 },
    ],
  },
  {
    id: "mental",
    name: "Mood & behavior",
    hint: "Anxiety, mood swings, sleep changes",
    specialty: "Psychiatry",
    symptoms: [
      { id: "mood-swings", label: "Mood swings", weight: 2 },
      { id: "panic", label: "Panic attacks", weight: 3 },
      { id: "sleep", label: "Major sleep change", weight: 2 },
      { id: "confusion", label: "Confusion or disorientation", weight: 4, redFlag: true },
      { id: "self-harm", label: "Thoughts of self-harm", weight: 5, redFlag: true },
    ],
    questions: [
      { id: "unsafe", label: "You may hurt yourself or someone else", risk: 5 },
      { id: "hallucination", label: "Hearing or seeing things others do not", risk: 4 },
      { id: "noSleep", label: "Very little sleep for 2 or more nights", risk: 2 },
      { id: "alone", label: "Are you alone without someone who can help right now?", risk: 2 },
    ],
  },
  {
    id: "stomach",
    name: "Stomach & digestion",
    hint: "Abdominal pain, vomiting, bowel changes",
    specialty: "Gastroenterology",
    symptoms: [
      { id: "abdomen", label: "Abdominal pain", weight: 2 },
      { id: "vomit", label: "Repeated vomiting", weight: 3 },
      { id: "blood", label: "Blood in vomit or stool", weight: 5, redFlag: true },
      { id: "dehydration", label: "Signs of dehydration", weight: 4, redFlag: true },
      { id: "diarrhea", label: "Diarrhea lasting more than a day", weight: 2 },
    ],
    questions: [
      { id: "rigid", label: "Hard belly or severe pain when touched", risk: 4 },
      { id: "pregnant", label: "Pregnant or could be pregnant", risk: 3 },
      { id: "feverGI", label: "High fever with stomach symptoms", risk: 3 },
      { id: "breathingOk", label: "Can you breathe normally right now?", risk: 0, inverseRisk: 4 },
    ],
  },
  {
    id: "dental",
    name: "Teeth & gums",
    hint: "Toothache, gum swelling, jaw pain",
    specialty: "Dentistry",
    displaySpecialty: "Dentist",
    symptoms: [
      { id: "toothache", label: "Tooth pain or toothache", weight: 4 },
      { id: "gum-swelling", label: "Gum, cheek, or jaw swelling", weight: 4, redFlag: true },
      { id: "chewing-pain", label: "Pain while chewing or biting", weight: 3 },
      { id: "mouth-odor", label: "Bad taste, pus, or foul mouth odor", weight: 3 },
      { id: "dental-trauma", label: "Broken tooth or dental injury", weight: 4, redFlag: true },
    ],
    questions: [
      { id: "faceSwelling", label: "Face, cheek, jaw, or neck is swelling", risk: 4 },
      { id: "dentalFever", label: "Fever with tooth or gum pain", risk: 3 },
      { id: "swallowBreathing", label: "Trouble swallowing or breathing", risk: 5 },
      { id: "cannotOpenMouth", label: "Cannot open mouth normally", risk: 3 },
    ],
  },
  {
    id: "ent",
    name: "Ear, nose & throat",
    hint: "Ear pain, sore throat, sinus, nosebleed",
    specialty: "ENT",
    symptoms: [
      { id: "ear-pain", label: "Ear pain, blocked ear, or discharge", weight: 3 },
      { id: "sore-throat", label: "Sore throat or painful swallowing", weight: 3 },
      { id: "sinus", label: "Sinus pressure, blocked nose, or runny nose", weight: 2 },
      { id: "nosebleed", label: "Repeated or heavy nosebleed", weight: 4, redFlag: true },
      { id: "hearing-loss", label: "Sudden hearing loss or severe dizziness", weight: 5, redFlag: true },
    ],
    questions: [
      { id: "entBreathing", label: "Trouble breathing, choking, or throat swelling", risk: 5 },
      { id: "entFever", label: "High fever with throat, ear, or sinus symptoms", risk: 3 },
      { id: "entBleeding", label: "Nosebleed is heavy or will not stop", risk: 4 },
      { id: "entSuddenHearing", label: "Sudden hearing loss or severe spinning dizziness", risk: 4 },
    ],
  },
  {
    id: "eye",
    name: "Eyes & vision",
    hint: "Eye pain, redness, vision changes",
    specialty: "Ophthalmology",
    symptoms: [
      { id: "eye-pain", label: "Eye pain or severe irritation", weight: 3 },
      { id: "red-eye", label: "Red eye, discharge, or sticky eyelids", weight: 2 },
      { id: "vision-loss", label: "New vision loss, blurred vision, or double vision", weight: 5, redFlag: true },
      { id: "eye-injury", label: "Eye injury or chemical exposure", weight: 5, redFlag: true },
      { id: "light-sensitivity", label: "Light sensitivity with eye pain", weight: 4 },
    ],
    questions: [
      { id: "suddenVisionLoss", label: "Vision changed suddenly", risk: 5 },
      { id: "eyeTrauma", label: "Chemical, dust, sharp object, or injury to the eye", risk: 5 },
      { id: "severeEyePain", label: "Severe eye pain, headache, or vomiting", risk: 4 },
    ],
  },
  {
    id: "skin",
    name: "Skin, hair & nails",
    hint: "Rash, itching, acne, skin infection",
    specialty: "Dermatology",
    symptoms: [
      { id: "rash", label: "Rash, itching, or skin allergy", weight: 3 },
      { id: "skin-infection", label: "Painful swelling, pus, boil, or wound infection", weight: 4 },
      { id: "acne", label: "Acne, pimples, or blackheads", weight: 2 },
      { id: "hair-nail", label: "Hair loss, nail changes, or scalp symptoms", weight: 2 },
      { id: "burn", label: "Burn, blistering, or rapidly spreading skin redness", weight: 5, redFlag: true },
    ],
    questions: [
      { id: "skinFever", label: "Fever with skin redness, swelling, wound, or pus", risk: 4 },
      { id: "rapidRash", label: "Rash is spreading quickly or involves eyes/mouth", risk: 4 },
      { id: "burnLarge", label: "Burn is large, deep, chemical, or on face/genitals", risk: 5 },
    ],
  },
  {
    id: "lung",
    name: "Lungs & breathing",
    hint: "Cough, wheezing, asthma, breathlessness",
    specialty: "Pulmonology",
    symptoms: [
      { id: "cough", label: "Cough, phlegm, or chest congestion", weight: 2 },
      { id: "wheezing", label: "Wheezing or asthma-like breathing", weight: 3 },
      { id: "breathlessness", label: "Shortness of breath", weight: 5, redFlag: true },
      { id: "cough-blood", label: "Coughing blood", weight: 5, redFlag: true },
      { id: "high-fever-cough", label: "High fever with cough or breathing symptoms", weight: 4 },
    ],
    questions: [
      { id: "breathingSevere", label: "Breathing is difficult at rest or lips look blue", risk: 5 },
      { id: "bloodCough", label: "Blood is coming with cough", risk: 5 },
      { id: "oxygenHistory", label: "Known asthma/COPD or low oxygen history", risk: 3 },
    ],
  },
  {
    id: "urinary",
    name: "Urinary & kidney",
    hint: "Burning urine, blood in urine, kidney stone pain",
    specialty: "Urology",
    symptoms: [
      { id: "burning-urine", label: "Burning or painful urination", weight: 3 },
      { id: "blood-urine", label: "Blood in urine", weight: 5, redFlag: true },
      { id: "flank-pain", label: "Side/flank pain or suspected kidney stone", weight: 4 },
      { id: "urine-retention", label: "Cannot pass urine", weight: 5, redFlag: true },
      { id: "urine-frequency", label: "Frequent urination or bladder discomfort", weight: 2 },
    ],
    questions: [
      { id: "cannotUrinate", label: "Unable to pass urine despite urge", risk: 5 },
      { id: "urineFever", label: "Fever with urine symptoms or side pain", risk: 4 },
      { id: "visibleBloodUrine", label: "Visible blood in urine", risk: 4 },
    ],
  },
  {
    id: "women",
    name: "Women’s health",
    hint: "Pregnancy, periods, pelvic pain, vaginal symptoms",
    specialty: "Obstetrics and Gynaecology",
    displaySpecialty: "Gynecologist / Obstetrician",
    symptoms: [
      { id: "pregnancy", label: "Pregnancy-related concern", weight: 4 },
      { id: "pelvic-pain", label: "Pelvic or lower abdominal pain", weight: 3 },
      { id: "period-problem", label: "Irregular, missed, heavy, or painful periods", weight: 3 },
      { id: "vaginal-discharge", label: "Vaginal discharge, itching, or odor", weight: 3 },
      { id: "pregnancy-bleeding", label: "Bleeding during pregnancy", weight: 5, redFlag: true },
    ],
    questions: [
      { id: "pregnantBleeding", label: "Pregnant or possibly pregnant with bleeding/pain", risk: 5 },
      { id: "severePelvicPain", label: "Severe pelvic pain, fainting, or shoulder-tip pain", risk: 5 },
      { id: "heavyBleeding", label: "Bleeding is very heavy or causing dizziness", risk: 4 },
    ],
  },
  {
    id: "child",
    name: "Child health",
    hint: "Infant/child fever, feeding, breathing, dehydration",
    specialty: "Pediatrics",
    displaySpecialty: "Pediatrician",
    symptoms: [
      { id: "child-fever", label: "Fever in baby or child", weight: 3 },
      { id: "child-breathing", label: "Child breathing fast or struggling", weight: 5, redFlag: true },
      { id: "child-dehydration", label: "Poor feeding, very sleepy, or dehydration", weight: 5, redFlag: true },
      { id: "child-rash", label: "Child rash with fever", weight: 4 },
      { id: "child-vomit-diarrhea", label: "Vomiting or diarrhea in child", weight: 3 },
    ],
    questions: [
      { id: "babyYoung", label: "Baby is under 3 months with fever", risk: 5 },
      { id: "childBreathingHard", label: "Child has chest indrawing, blue lips, or severe breathing trouble", risk: 5 },
      { id: "childNotDrinking", label: "Child is not drinking, very drowsy, or passing very little urine", risk: 4 },
    ],
  },
  {
    id: "general",
    name: "General health review",
    hint: "Unclear, mixed, or outside-scope symptoms",
    specialty: "GeneralMedicine",
    displaySpecialty: "General Physician",
    symptoms: [{ id: "general-review", label: "Unclear or mixed symptoms", weight: 1 }],
    questions: [
      { id: "worse", label: "Symptoms are getting worse or spreading", risk: 2 },
      { id: "feverGeneral", label: "Fever, weakness, or body aches are present", risk: 2 },
      { id: "breathingOk", label: "Can you breathe normally right now?", risk: 0, inverseRisk: 4 },
    ],
  },
];

const providers = [
  {
    name: "Hyderabad Family Health Clinic",
    city: "Hyderabad, Telangana",
    level: "routine",
    specialties: ["Primary Care", "Neurology", "Psychiatry", "Gastroenterology"],
    doctor: "Dr. Kavya Reddy",
    doctorQuality: 4.4,
    hospitalQuality: 4.1,
    costLow: 500,
    costHigh: 1200,
    wait: "Same day to 2 days",
    note: "Affordable first consultation for mild symptoms, basic tests, and referrals.",
  },
  {
    name: "Hyderabad Neuro Care Center",
    city: "Hyderabad, Telangana",
    level: "soon",
    specialties: ["Neurology"],
    doctor: "Dr. Arjun Varma",
    doctorQuality: 4.7,
    hospitalQuality: 4.3,
    costLow: 900,
    costHigh: 2500,
    wait: "24-72 hours",
    note: "Focused neurology visit for cramps, weakness, migraine, numbness, and balance concerns.",
  },
  {
    name: "Hyderabad Multi-Speciality Emergency Hospital",
    city: "Hyderabad, Telangana",
    level: "emergency",
    specialties: ["Emergency Medicine", "Neurology", "Cardiology"],
    doctor: "Emergency and neuro duty team",
    doctorQuality: 4.6,
    hospitalQuality: 4.6,
    costLow: 8000,
    costHigh: 65000,
    wait: "Emergency triage now",
    note: "Best fit for sudden paralysis, facial droop, severe headache, seizure, or stroke-like symptoms.",
  },
  {
    name: "Bengaluru Primary Care Plus",
    city: "Bengaluru, Karnataka",
    level: "routine",
    specialties: ["Primary Care", "Orthopedics", "Gastroenterology"],
    doctor: "Dr. Nisha Rao",
    doctorQuality: 4.4,
    hospitalQuality: 4.2,
    costLow: 600,
    costHigh: 1500,
    wait: "Same day to 3 days",
    note: "Cost-conscious option for mild symptoms and referrals.",
  },
  {
    name: "Bengaluru Heart & Neuro Institute",
    city: "Bengaluru, Karnataka",
    level: "soon",
    specialties: ["Cardiology", "Neurology"],
    doctor: "Dr. Sameer Iyer",
    doctorQuality: 4.7,
    hospitalQuality: 4.5,
    costLow: 1200,
    costHigh: 3500,
    wait: "1-3 days",
    note: "Useful when symptoms suggest nerve or heart involvement but are not immediately dangerous.",
  },
  {
    name: "Bengaluru Tertiary Emergency Hospital",
    city: "Bengaluru, Karnataka",
    level: "emergency",
    specialties: ["Emergency Medicine", "Cardiology", "Neurology", "Orthopedics"],
    doctor: "Emergency duty team",
    doctorQuality: 4.6,
    hospitalQuality: 4.7,
    costLow: 9000,
    costHigh: 80000,
    wait: "Emergency triage now",
    note: "Higher-cost hospital care for red-flag symptoms and severe sudden onset.",
  },
  {
    name: "Mumbai Specialist OPD Network",
    city: "Mumbai, Maharashtra",
    level: "soon",
    specialties: ["Neurology", "Psychiatry", "Gastroenterology"],
    doctor: "Dr. Priya Shah",
    doctorQuality: 4.8,
    hospitalQuality: 4.4,
    costLow: 1500,
    costHigh: 4500,
    wait: "24-72 hours",
    note: "Specialist clinic for moderate neurologic, mood, and digestive concerns.",
  },
  {
    name: "Mumbai Advanced Emergency Hospital",
    city: "Mumbai, Maharashtra",
    level: "emergency",
    specialties: ["Emergency Medicine", "Neurology", "Cardiology", "Psychiatry"],
    doctor: "Emergency duty team",
    doctorQuality: 4.7,
    hospitalQuality: 4.7,
    costLow: 12000,
    costHigh: 95000,
    wait: "Emergency triage now",
    note: "Appropriate for severe or rapidly worsening symptoms.",
  },
  {
    name: "Delhi NCR Mental Health & Family Clinic",
    city: "Delhi NCR",
    level: "routine",
    specialties: ["Primary Care", "Psychiatry"],
    doctor: "Dr. Meera Kapoor",
    doctorQuality: 4.5,
    hospitalQuality: 4.2,
    costLow: 700,
    costHigh: 2200,
    wait: "Same day to 3 days",
    note: "Mild mood, sleep, and general health concerns with referral support.",
  },
  {
    name: "Delhi NCR Emergency & Neuro Center",
    city: "Delhi NCR",
    level: "emergency",
    specialties: ["Emergency Medicine", "Neurology"],
    doctor: "Emergency and neuro duty team",
    doctorQuality: 4.8,
    hospitalQuality: 4.8,
    costLow: 10000,
    costHigh: 90000,
    wait: "Emergency triage now",
    note: "High-acuity option for stroke-like or seizure symptoms in the sample dataset.",
  },
  {
    name: "Chennai Ortho & General Clinic",
    city: "Chennai, Tamil Nadu",
    level: "routine",
    specialties: ["Primary Care", "Orthopedics"],
    doctor: "Dr. S. Krishnan",
    doctorQuality: 4.3,
    hospitalQuality: 4.0,
    costLow: 500,
    costHigh: 1300,
    wait: "Same day to 3 days",
    note: "Practical option for mild injuries, joint pain, back pain, and referral planning.",
  },
  {
    name: "Chennai Emergency Trauma Hospital",
    city: "Chennai, Tamil Nadu",
    level: "emergency",
    specialties: ["Emergency Medicine", "Neurology", "Orthopedics"],
    doctor: "Emergency and trauma duty team",
    doctorQuality: 4.5,
    hospitalQuality: 4.6,
    costLow: 7000,
    costHigh: 70000,
    wait: "Emergency triage now",
    note: "For severe sudden neurologic symptoms, injury, or dangerous red flags.",
  },
  {
    name: "Pune Digestive & Family Clinic",
    city: "Pune, Maharashtra",
    level: "routine",
    specialties: ["Primary Care", "Gastroenterology"],
    doctor: "Dr. Aditi Kulkarni",
    doctorQuality: 4.5,
    hospitalQuality: 4.2,
    costLow: 600,
    costHigh: 1800,
    wait: "Same day to 3 days",
    note: "Good first stop for mild stomach symptoms, dehydration checks, and referrals.",
  },
  {
    name: "Pune Multi-Speciality Urgent Care",
    city: "Pune, Maharashtra",
    level: "soon",
    specialties: ["Gastroenterology", "Cardiology", "Orthopedics", "Neurology"],
    doctor: "Dr. Rahul Deshmukh",
    doctorQuality: 4.5,
    hospitalQuality: 4.3,
    costLow: 1000,
    costHigh: 3200,
    wait: "24-72 hours",
    note: "Moderate symptoms that need faster review than a routine appointment.",
  },
  {
    name: "Kolkata Community Specialist Clinic",
    city: "Kolkata, West Bengal",
    level: "routine",
    specialties: ["Primary Care", "Psychiatry", "Gastroenterology", "Orthopedics"],
    doctor: "Dr. Ananya Sen",
    doctorQuality: 4.4,
    hospitalQuality: 4.1,
    costLow: 450,
    costHigh: 1400,
    wait: "Same day to 3 days",
    note: "Lower-cost consultation route for mild symptoms and referral decisions.",
  },
  {
    name: "Kolkata Neuro Cardiac Emergency Unit",
    city: "Kolkata, West Bengal",
    level: "emergency",
    specialties: ["Emergency Medicine", "Neurology", "Cardiology"],
    doctor: "Emergency duty team",
    doctorQuality: 4.5,
    hospitalQuality: 4.5,
    costLow: 7000,
    costHigh: 65000,
    wait: "Emergency triage now",
    note: "Emergency path for stroke-like signs, severe chest symptoms, or rapidly worsening symptoms.",
  },
];

const state = {
  categoryId: "neuro",
  selectedSymptoms: new Set(),
  selectedQuestions: new Set(),
  lastAssessment: null,
  medicalIntake: null,
};

const byId = (id) => document.getElementById(id);

const form = byId("assessmentForm");
const symptomInput = byId("symptomInput");
const analysisPanel = byId("analysisPanel");
const detectedArea = byId("detectedArea");
const detectedReason = byId("detectedReason");
const categoryReview = byId("categoryReview");
const suggestedSymptomsField = byId("suggestedSymptomsField");
const symptomOptions = byId("symptomOptions");
const dynamicQuestions = byId("dynamicQuestions");
const severity = byId("severity");
const severityValue = byId("severityValue");
const results = byId("results");
const emptyState = byId("emptyState");
const providerList = byId("providerList");
const sortProviders = byId("sortProviders");
const placesStatus = byId("placesStatus");
const mapsApiKey = byId("mapsApiKey");
const distancePreference = byId("distancePreference");
const addressInput = byId("addressInput");
const applyAddressBtn = byId("applyAddressBtn");
const distanceRange = byId("distanceRange");
const distanceLabelOutput = byId("distanceLabel");
const symptomScreen = byId("symptomScreen");
const questionScreen = byId("questionScreen");
const resultsScreen = byId("resultsScreen");
let mapsLoadPromise = null;
let placesService = null;
let geocoder = null;
let distanceMatrixService = null;

const keywordBank = {
  neuro: {
    general: ["paralysis", "weakness", "weakness of one body side", "altered sensorium", "numb", "numbness", "cramp", "cramps", "spasm", "seizure", "fit", "faint", "dizzy", "dizziness", "balance", "headache", "migraine", "speech", "vision", "mood swing", "one side", "facial"],
    symptoms: {
      paralysis: ["paralysis", "weakness of one body side", "weakness", "weak", "cannot move", "can't move", "limb heavy"],
      "facial-droop": ["face droop", "facial droop", "mouth droop", "one side face"],
      seizure: ["seizure", "fits", "fit", "convulsion", "faint with confusion"],
      headache: ["severe headache", "worst headache", "migraine", "head pain"],
      cramps: ["cramp", "cramps", "spasm", "muscle tight"],
      mood: ["mood", "mood swing", "irritability", "personality"],
      dizziness: ["dizzy", "dizziness", "balance", "vertigo"],
    },
  },
  heart: {
    general: ["chest", "heart", "palpitation", "breath", "breathing", "jaw", "arm pain", "sweat", "pressure"],
    symptoms: {
      "chest-pain": ["chest pain", "chest pressure", "heavy chest", "tight chest"],
      breath: ["shortness of breath", "breathless", "breathing problem", "can't breathe"],
      palpitations: ["palpitation", "heart racing", "irregular heartbeat"],
      swelling: ["leg swelling", "swollen legs", "ankle swelling"],
      "jaw-arm": ["jaw pain", "left arm", "arm pain", "shoulder pain with chest"],
    },
  },
  bone: {
    general: ["bone", "joint", "back", "backpain", "back ache", "lowerback", "fracture", "fall", "injury", "walk", "walking", "stand", "standing", "sit", "sitting", "bend", "bending", "trauma", "sprain"],
    symptoms: {
      fracture: ["fracture", "broken", "major injury", "fall", "accident"],
      "back-pain": ["back pain", "backpain", "back ache", "lower back", "lowerback", "spine", "cannot bend", "can't bend", "cant bend"],
      joint: ["joint", "knee", "shoulder", "ankle", "swelling joint"],
      walking: ["can't walk", "cannot walk", "cant walk", "cannot stand", "can't stand", "cant stand", "cannot sit", "can't sit", "cant sit", "limping", "unable to walk"],
      "numb-leg": ["leg numb", "numbness with back", "sciatica"],
    },
  },
  mental: {
    general: ["mood", "anxiety", "panic", "sleep", "confusion", "self harm", "depression", "hallucination", "behavior"],
    symptoms: {
      "mood-swings": ["mood swing", "mood", "anger", "irritable"],
      panic: ["panic", "anxiety attack", "fear", "heart racing from anxiety"],
      sleep: ["sleep", "insomnia", "not sleeping", "too much sleep"],
      confusion: ["confusion", "confused", "disoriented", "not making sense"],
      "self-harm": ["self harm", "suicide", "kill myself", "hurt myself"],
    },
  },
  stomach: {
    general: [
      "stomach",
      "abdomen",
      "vomit",
      "vomiting",
      "diarrhea",
      "loose motion",
      "loose motions",
      "loosemotion",
      "loosemotions",
      "virechanam",
      "virechanalu",
      "virechanaalu",
      "virechana",
      "bloated",
      "bloating",
      "gas",
      "blood stool",
      "blood in stool",
      "black stool",
      "dehydration",
      "belly",
      "kadupu",
      "kadupu noppi",
      "hot breath",
    ],
    symptoms: {
      abdomen: ["stomach pain", "abdominal pain", "belly pain", "abdomen", "stomach cramp", "stomach cramps", "bloated stomach", "bloating", "gas", "kadupu", "kadupu noppi"],
      vomit: ["vomit", "vomiting", "throwing up", "vaantulu", "vantulu", "vanti", "vomiting sensation"],
      blood: ["blood in stool", "blood vomit", "black stool", "bloody"],
      dehydration: ["dehydration", "very thirsty", "dry mouth", "not urinating", "hot breath"],
      diarrhea: ["diarrhea", "diarrhoea", "loose motion", "loose motions", "loosemotion", "loosemotions", "loose stools", "virechanam", "virechanalu", "virechanaalu", "virechana"],
    },
  },
  dental: {
    general: ["tooth", "teeth", "toothache", "tooth ache", "tooth ace", "tooth pain", "dental", "dentist", "gum", "gums", "jaw pain", "mouth pain", "cavity", "abscess", "wisdom tooth", "chewing pain"],
    symptoms: {
      toothache: ["toothache", "tooth ache", "tooth ace", "tooth pain", "teeth pain", "dental pain", "cavity pain"],
      "gum-swelling": ["gum swelling", "swollen gum", "swollen gums", "cheek swelling", "jaw swelling", "face swelling", "dental abscess", "tooth abscess", "abscess"],
      "chewing-pain": ["chewing pain", "pain while chewing", "pain biting", "biting pain", "hot cold tooth pain", "sensitive tooth"],
      "mouth-odor": ["bad taste", "foul taste", "pus", "mouth odor", "bad smell mouth", "foul mouth"],
      "dental-trauma": ["broken tooth", "tooth broken", "cracked tooth", "dental injury", "tooth injury"],
    },
  },
  ent: {
    general: ["ear", "ear pain", "earache", "ear ache", "blocked ear", "hearing", "throat", "sore throat", "tonsil", "tonsils", "sinus", "nose", "runny nose", "blocked nose", "nose bleed", "nosebleed", "vertigo"],
    symptoms: {
      "ear-pain": ["ear pain", "earache", "ear ache", "blocked ear", "ear discharge", "ear pus"],
      "sore-throat": ["sore throat", "throat pain", "painful swallowing", "tonsil", "tonsils", "voice change", "hoarse voice"],
      sinus: ["sinus", "sinus pressure", "blocked nose", "runny nose", "nasal congestion", "nose blocked"],
      nosebleed: ["nosebleed", "nose bleed", "bleeding nose", "blood from nose"],
      "hearing-loss": ["hearing loss", "cannot hear", "can't hear", "sudden hearing", "severe vertigo", "spinning dizziness"],
    },
  },
  eye: {
    general: ["eye", "eyes", "vision", "red eye", "eye pain", "blurred vision", "double vision", "conjunctivitis", "sticky eye", "light sensitivity"],
    symptoms: {
      "eye-pain": ["eye pain", "pain in eye", "eye irritation", "burning eye"],
      "red-eye": ["red eye", "red eyes", "eye redness", "eye discharge", "sticky eye", "conjunctivitis"],
      "vision-loss": ["vision loss", "blurred vision", "blurry vision", "double vision", "cannot see", "can't see"],
      "eye-injury": ["eye injury", "chemical in eye", "dust in eye", "hit in eye", "foreign body eye"],
      "light-sensitivity": ["light sensitivity", "photophobia", "eye pain light"],
    },
  },
  skin: {
    general: ["skin", "rash", "itching", "itchy", "allergy", "boil", "pus", "wound", "acne", "pimple", "blackhead", "hair loss", "nail", "burn", "blister"],
    symptoms: {
      rash: ["skin rash", "rash", "itching", "itchy", "allergy", "hives"],
      "skin-infection": ["boil", "pus", "wound infection", "skin infection", "painful swelling"],
      acne: ["acne", "pimple", "pimples", "blackheads"],
      "hair-nail": ["hair loss", "scalp", "dandruff", "nail change", "nail infection"],
      burn: ["burn", "blister", "chemical burn", "skin peeling"],
    },
  },
  lung: {
    general: ["cough", "phlegm", "wheezing", "asthma", "breathless", "breathlessness", "shortness of breath", "breathing problem", "chest congestion", "blood cough"],
    symptoms: {
      cough: ["cough", "phlegm", "mucus", "chest congestion"],
      wheezing: ["wheezing", "asthma", "whistling breath"],
      breathlessness: ["shortness of breath", "breathless", "breathlessness", "breathing problem", "can't breathe", "cannot breathe"],
      "cough-blood": ["coughing blood", "blood in cough", "blood cough", "hemoptysis"],
      "high-fever-cough": ["high fever cough", "fever with cough", "fever breathing"],
    },
  },
  urinary: {
    general: ["urine", "urination", "pee", "burning urine", "painful urination", "blood urine", "kidney stone", "flank pain", "bladder"],
    symptoms: {
      "burning-urine": ["burning urination", "burning urine", "painful urination", "pain while peeing", "pee burning"],
      "blood-urine": ["blood in urine", "blood urine", "red urine"],
      "flank-pain": ["flank pain", "side pain", "kidney stone", "stone pain"],
      "urine-retention": ["cannot pass urine", "can't pass urine", "unable to urinate", "urine blocked"],
      "urine-frequency": ["frequent urination", "urine frequency", "bladder discomfort", "continuous feel of urine"],
    },
  },
  women: {
    general: ["pregnant", "pregnancy", "period", "periods", "menstrual", "vaginal", "pelvic", "pcos", "white discharge", "heavy bleeding", "missed period"],
    symptoms: {
      pregnancy: ["pregnant", "pregnancy", "antenatal", "morning sickness"],
      "pelvic-pain": ["pelvic pain", "lower abdominal pain women", "lower belly pain female"],
      "period-problem": ["period pain", "periods", "irregular period", "missed period", "heavy period", "menstrual"],
      "vaginal-discharge": ["vaginal discharge", "white discharge", "vaginal itching", "vaginal odor"],
      "pregnancy-bleeding": ["bleeding during pregnancy", "pregnant bleeding", "pregnancy bleeding"],
    },
  },
  child: {
    general: ["child", "baby", "infant", "newborn", "toddler", "kid", "kids", "pediatric", "paediatric", "poor feeding", "child fever"],
    symptoms: {
      "child-fever": ["child fever", "baby fever", "infant fever", "newborn fever", "kid fever"],
      "child-breathing": ["child breathing", "baby breathing", "baby breathing fast", "breathing fast", "chest indrawing", "blue lips child"],
      "child-dehydration": ["poor feeding", "not feeding", "baby not feeding", "child dehydrated", "very drowsy", "very drowsy child"],
      "child-rash": ["child rash", "baby rash", "rash with fever child"],
      "child-vomit-diarrhea": ["child vomiting", "baby vomiting", "child diarrhea", "baby loose motion"],
    },
  },
  general: {
    general: ["fever", "fatigue", "tired", "weakness", "cold", "body ache", "body aches"],
    symptoms: {
      "general-review": ["fever", "fatigue", "tired", "weakness", "cold", "body ache", "body aches"],
    },
  },
};

const conditionBank = [
  {
    id: "stroke",
    name: "Stroke / TIA red flag",
    categoryId: "neuro",
    specialty: "Neurology",
    severity: "emergency",
    symptoms: ["paralysis", "facial-droop", "dizziness"],
    questions: ["speech", "vision", "oneSide"],
    phrases: ["paralysis", "weakness of one body side", "altered sensorium", "one side", "facial droop", "speech", "vision loss", "stroke"],
  },
  {
    id: "migraine",
    name: "Migraine",
    categoryId: "neuro",
    specialty: "Neurology",
    severity: "soon",
    symptoms: ["headache", "dizziness"],
    questions: ["vision"],
    phrases: ["migraine", "light sensitivity", "nausea", "one sided headache", "headache"],
  },
  {
    id: "muscle_spasm",
    name: "Muscle cramps / spasm",
    categoryId: "neuro",
    specialty: "Neurology",
    severity: "routine",
    symptoms: ["cramps"],
    questions: [],
    phrases: ["cramp", "spasm", "muscle tight"],
  },
  {
    id: "myocardial_infarction",
    name: "Heart attack red flag",
    categoryId: "heart",
    specialty: "Cardiology",
    severity: "emergency",
    symptoms: ["chest-pain", "breath", "jaw-arm"],
    questions: ["sweat", "exertion", "historyHeart"],
    phrases: ["chest pain", "sweating", "left arm", "jaw", "heart attack"],
  },
  {
    id: "arrhythmia",
    name: "Palpitations / arrhythmia",
    categoryId: "heart",
    specialty: "Cardiology",
    severity: "soon",
    symptoms: ["palpitations", "breath"],
    questions: ["historyHeart"],
    phrases: ["palpitation", "heart racing", "irregular heartbeat"],
  },
  {
    id: "fracture",
    name: "Fracture or trauma",
    categoryId: "bone",
    specialty: "Orthopedics",
    severity: "soon",
    symptoms: ["fracture", "walking"],
    questions: ["trauma"],
    phrases: ["fracture", "broken", "fall", "accident"],
  },
  {
    id: "cauda_equina_red_flag",
    name: "Spine emergency red flag",
    categoryId: "bone",
    specialty: "Orthopedics",
    severity: "emergency",
    symptoms: ["back-pain", "numb-leg"],
    questions: ["bladder"],
    phrases: ["back pain", "bladder", "bowel", "leg numb"],
  },
  {
    id: "anxiety_panic",
    name: "Anxiety / panic episode",
    categoryId: "mental",
    specialty: "Psychiatry",
    severity: "routine",
    symptoms: ["panic", "sleep"],
    questions: ["noSleep"],
    phrases: ["panic", "anxiety", "fear", "sleep"],
  },
  {
    id: "suicidal_ideation",
    name: "Self-harm crisis red flag",
    categoryId: "mental",
    specialty: "Psychiatry",
    severity: "emergency",
    symptoms: ["self-harm", "confusion"],
    questions: ["unsafe", "hallucination"],
    phrases: ["self harm", "suicide", "hurt myself", "unsafe"],
  },
  {
    id: "viral_gastroenteritis",
    name: "Viral gastroenteritis / stomach infection",
    categoryId: "stomach",
    specialty: "Gastroenterology",
    severity: "routine",
    symptoms: ["abdomen", "vomit", "diarrhea"],
    questions: ["feverGI"],
    phrases: ["vomiting", "vaantulu", "vantulu", "virechanam", "virechanalu", "virechanaalu", "diarrhea", "diarrhoea", "stomach pain", "kadupu noppi", "loose motion", "loose motions", "loosemotions", "bloated", "bloating", "hot breath"],
  },
  {
    id: "gi_bleeding",
    name: "Gastrointestinal bleeding red flag",
    categoryId: "stomach",
    specialty: "Gastroenterology",
    severity: "emergency",
    symptoms: ["blood", "dehydration"],
    questions: ["rigid"],
    phrases: ["blood", "black stool", "blood vomit", "dehydration"],
  },
  {
    id: "toothache",
    name: "Toothache / dental pain",
    categoryId: "dental",
    specialty: "Dentistry",
    severity: "soon",
    symptoms: ["toothache", "chewing-pain"],
    questions: [],
    phrases: ["toothache", "tooth ache", "tooth ace", "tooth pain", "teeth pain", "cavity pain", "dental pain"],
  },
  {
    id: "dental_abscess_red_flag",
    name: "Dental abscess red flag",
    categoryId: "dental",
    specialty: "Dentistry",
    severity: "emergency",
    symptoms: ["gum-swelling", "mouth-odor"],
    questions: ["faceSwelling", "dentalFever", "swallowBreathing", "cannotOpenMouth"],
    phrases: ["tooth abscess", "dental abscess", "face swelling tooth", "gum swelling fever", "trouble swallowing tooth", "pus tooth"],
  },
  {
    id: "ent_infection",
    name: "ENT infection / irritation",
    categoryId: "ent",
    specialty: "ENT",
    severity: "soon",
    symptoms: ["ear-pain", "sore-throat", "sinus"],
    questions: ["entFever"],
    phrases: ["ear pain", "earache", "sore throat", "throat pain", "sinus", "blocked nose", "tonsil"],
  },
  {
    id: "ent_red_flag",
    name: "ENT red flag",
    categoryId: "ent",
    specialty: "ENT",
    severity: "emergency",
    symptoms: ["nosebleed", "hearing-loss"],
    questions: ["entBreathing", "entBleeding", "entSuddenHearing"],
    phrases: ["trouble breathing throat", "heavy nosebleed", "sudden hearing loss", "severe vertigo"],
  },
  {
    id: "eye_infection_or_irritation",
    name: "Eye infection / irritation",
    categoryId: "eye",
    specialty: "Ophthalmology",
    severity: "soon",
    symptoms: ["eye-pain", "red-eye", "light-sensitivity"],
    questions: [],
    phrases: ["red eye", "eye pain", "eye redness", "eye discharge", "conjunctivitis", "light sensitivity"],
  },
  {
    id: "eye_emergency_red_flag",
    name: "Eye emergency red flag",
    categoryId: "eye",
    specialty: "Ophthalmology",
    severity: "emergency",
    symptoms: ["vision-loss", "eye-injury"],
    questions: ["suddenVisionLoss", "eyeTrauma", "severeEyePain"],
    phrases: ["vision loss", "chemical in eye", "eye injury", "cannot see", "sudden blurred vision"],
  },
  {
    id: "skin_rash_or_infection",
    name: "Skin rash / infection",
    categoryId: "skin",
    specialty: "Dermatology",
    severity: "soon",
    symptoms: ["rash", "skin-infection", "acne", "hair-nail"],
    questions: ["skinFever"],
    phrases: ["skin rash", "itching", "boil", "pus", "acne", "pimples", "hair loss", "nail infection"],
  },
  {
    id: "skin_burn_red_flag",
    name: "Burn / rapidly spreading skin red flag",
    categoryId: "skin",
    specialty: "Dermatology",
    severity: "emergency",
    symptoms: ["burn"],
    questions: ["rapidRash", "burnLarge"],
    phrases: ["large burn", "chemical burn", "rapid rash", "rash in mouth", "skin peeling fever"],
  },
  {
    id: "respiratory_symptoms",
    name: "Cough / wheeze / breathing symptoms",
    categoryId: "lung",
    specialty: "Pulmonology",
    severity: "soon",
    symptoms: ["cough", "wheezing", "high-fever-cough"],
    questions: ["oxygenHistory"],
    phrases: ["cough", "wheezing", "asthma", "phlegm", "fever with cough", "chest congestion"],
  },
  {
    id: "respiratory_red_flag",
    name: "Breathing emergency red flag",
    categoryId: "lung",
    specialty: "Pulmonology",
    severity: "emergency",
    symptoms: ["breathlessness", "cough-blood"],
    questions: ["breathingSevere", "bloodCough"],
    phrases: ["shortness of breath", "cannot breathe", "coughing blood", "blue lips", "breathing difficult at rest"],
  },
  {
    id: "urinary_symptoms",
    name: "Urinary symptoms / possible UTI",
    categoryId: "urinary",
    specialty: "Urology",
    severity: "soon",
    symptoms: ["burning-urine", "flank-pain", "urine-frequency"],
    questions: ["urineFever"],
    phrases: ["burning urination", "painful urination", "kidney stone", "flank pain", "frequent urination"],
  },
  {
    id: "urinary_red_flag",
    name: "Urinary red flag",
    categoryId: "urinary",
    specialty: "Urology",
    severity: "emergency",
    symptoms: ["blood-urine", "urine-retention"],
    questions: ["cannotUrinate", "visibleBloodUrine"],
    phrases: ["cannot pass urine", "blood in urine", "unable to urinate", "urine blocked"],
  },
  {
    id: "gynecology_symptoms",
    name: "Gynecology / pregnancy concern",
    categoryId: "women",
    specialty: "Obstetrics and Gynaecology",
    severity: "soon",
    symptoms: ["pregnancy", "pelvic-pain", "period-problem", "vaginal-discharge"],
    questions: [],
    phrases: ["pregnancy", "period pain", "missed period", "pelvic pain", "vaginal discharge", "white discharge"],
  },
  {
    id: "obgyn_red_flag",
    name: "Pregnancy or pelvic red flag",
    categoryId: "women",
    specialty: "Obstetrics and Gynaecology",
    severity: "emergency",
    symptoms: ["pregnancy-bleeding"],
    questions: ["pregnantBleeding", "severePelvicPain", "heavyBleeding"],
    phrases: ["pregnancy bleeding", "pregnant bleeding", "severe pelvic pain", "heavy bleeding dizzy"],
  },
  {
    id: "pediatric_symptoms",
    name: "Child health concern",
    categoryId: "child",
    specialty: "Pediatrics",
    severity: "soon",
    symptoms: ["child-fever", "child-rash", "child-vomit-diarrhea"],
    questions: [],
    phrases: ["child fever", "baby fever", "child vomiting", "baby loose motion", "child rash"],
  },
  {
    id: "pediatric_red_flag",
    name: "Child emergency red flag",
    categoryId: "child",
    specialty: "Pediatrics",
    severity: "emergency",
    symptoms: ["child-breathing", "child-dehydration"],
    questions: ["babyYoung", "childBreathingHard", "childNotDrinking"],
    phrases: ["baby not feeding", "child breathing fast", "blue lips child", "baby under 3 months fever", "child very drowsy"],
  },
];

function money(low, high, city) {
  return `Rs. ${low.toLocaleString("en-IN")}-Rs. ${high.toLocaleString("en-IN")}`;
}

function activeCategory() {
  return categories.find((category) => category.id === state.categoryId) ?? categories[0];
}

function renderCategories() {
  categoryReview.innerHTML = categories
    .map(
      (category) => `
        <option value="${category.id}" ${category.id === state.categoryId ? "selected" : ""}>${category.name}</option>
      `,
    )
    .join("");
}

function renderGuidedQuestions() {
  const category = activeCategory();
  analysisPanel.classList.remove("hidden");
  suggestedSymptomsField.classList.remove("hidden");
  dynamicQuestions.classList.remove("hidden");
  const specialtyLabel = category.displaySpecialty || category.specialty;
  detectedArea.textContent = category.name;
  detectedReason.textContent =
    state.medicalIntake
      ? `${state.medicalIntake.reason} Parsed symptoms: ${state.medicalIntake.understood_symptoms.slice(0, 4).join(", ") || "not listed"}.`
      : 
    category.id === "general"
      ? "Your symptoms look mixed, unclear, or outside this prototype's specialty scope. A general physician is the safest first step unless red flags appear."
      : `I matched your description to ${specialtyLabel.toLowerCase()} clues. Please confirm what is present so the recommendation can rank care safely.`;
  renderCategories();

  symptomOptions.innerHTML = category.symptoms
    .map(
      (symptom) => `
        <label class="symptom-item">
          <input type="checkbox" name="symptom" value="${symptom.id}" ${state.selectedSymptoms.has(symptom.id) ? "checked" : ""} />
          <span>${symptom.label}${symptom.redFlag ? "<small>Potential red flag</small>" : ""}</span>
        </label>
      `,
    )
    .join("");

  dynamicQuestions.innerHTML = `
    <legend>Follow-up questions</legend>
    ${category.questions
      .map(
        (question) => `
          <label class="question-item">
            <input type="checkbox" name="question" value="${question.id}" ${state.selectedQuestions.has(question.id) ? "checked" : ""} />
            <span>${question.label}</span>
          </label>
        `,
      )
      .join("")}
  `;
}

function inferFromText(text) {
  const normalized = normalizeText(text);
  const mlPrediction = predictMlCategory(normalized);
  const safetyCategory = safetyRoutingCategory(normalized);
  const scores = categories.map((category) => {
    const bank = keywordBank[category.id];
    const generalWeight = category.id === "general" ? 1 : 2;
    const symptomWeight = category.id === "general" ? 1 : 3;
    const generalScore = bank.general.reduce((score, word) => score + (normalized.includes(word) ? generalWeight : 0), 0);
    const symptomScore = Object.values(bank.symptoms)
      .flat()
      .reduce((score, word) => score + (normalized.includes(word) ? symptomWeight : 0), 0);
    const mlScore = mlPrediction?.categoryId === category.id && mlPrediction.confidence >= 0.2 ? 4 + mlPrediction.confidence * 8 : 0;
    return { category, score: generalScore + symptomScore + mlScore, ruleScore: generalScore + symptomScore, mlScore };
  });
  scores.sort((a, b) => b.score - a.score);

  const topRule = scores.reduce((best, score) => (score.ruleScore > best.ruleScore ? score : best), scores[0]);
  const best = safetyCategory || chooseRoutingCategory(scores, mlPrediction, topRule);
  const matchedSymptoms = best.symptoms
    .filter((symptom) => (keywordBank[best.id].symptoms[symptom.id] || []).some((word) => normalized.includes(word)))
    .map((symptom) => symptom.id);

  return {
    categoryId: best.id,
    matchedSymptoms,
    confidence: scores[0].score,
    mlCategoryId: mlPrediction?.categoryId || "",
    mlConfidence: mlPrediction?.confidence || 0,
  };
}

function chooseRoutingCategory(scores, mlPrediction, topRule) {
  const general = categories.find((category) => category.id === "general");
  const [best, second] = scores;
  const isWeakMlOnly =
    topRule.ruleScore === 0 &&
    mlPrediction &&
    best.category.id === mlPrediction.categoryId &&
    mlPrediction.confidence < 0.55;
  const isWeakMixedSignal =
    topRule.ruleScore > 0 &&
    best.ruleScore <= 2 &&
    best.mlScore > 0 &&
    second &&
    best.score - second.score < 2;

  if (!best || best.score <= 0 || isWeakMlOnly || isWeakMixedSignal) return general;
  return best.category;
}

function safetyRoutingCategory(normalizedText) {
  const category = (id) => categories.find((item) => item.id === id);
  if (!normalizedText) return null;
  if (normalizedText.includes("self harm") || normalizedText.includes("suicide") || normalizedText.includes("hurt myself")) return category("mental");
  if (
    normalizedText.includes("weakness of one body side") ||
    normalizedText.includes("facial droop") ||
    normalizedText.includes("slurred speech") ||
    normalizedText.includes("altered sensorium") ||
    (normalizedText.includes("one side") && (normalizedText.includes("weak") || normalizedText.includes("numb") || normalizedText.includes("speech")))
  ) {
    return category("neuro");
  }
  if (
    (normalizedText.includes("chest pain") || normalizedText.includes("chest pressure") || normalizedText.includes("chest tight")) &&
    (normalizedText.includes("sweat") || normalizedText.includes("breath") || normalizedText.includes("jaw") || normalizedText.includes("left arm"))
  ) {
    return category("heart");
  }
  if (
    normalizedText.includes("blood in stool") ||
    normalizedText.includes("black stool") ||
    normalizedText.includes("blood vomit") ||
    normalizedText.includes("stomach bleeding")
  ) {
    return category("stomach");
  }
  if ((normalizedText.includes("back pain") || normalizedText.includes("backpain") || normalizedText.includes("lower back") || normalizedText.includes("spine pain")) && (normalizedText.includes("bladder") || normalizedText.includes("bowel") || normalizedText.includes("saddle"))) {
    return category("bone");
  }
  return null;
}

function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function textTokens(text) {
  const stopwords = new Set(["a", "an", "and", "are", "as", "at", "be", "been", "by", "can", "for", "from", "have", "has", "i", "in", "is", "it", "may", "of", "on", "or", "that", "the", "this", "to", "with", "you", "your"]);
  const words = normalizeText(text)
    .split(" ")
    .filter((word) => word.length >= 3 && !stopwords.has(word));
  const tokens = [...words];
  for (let index = 0; index < words.length - 1; index += 1) tokens.push(`${words[index]} ${words[index + 1]}`);
  return tokens;
}

function predictMlCategory(normalizedText) {
  const model = window.CAREMATCH_ML_MODEL;
  if (!model?.classes || !model?.vocab?.length || !normalizedText) return null;

  const vocab = new Set(model.vocab);
  const tokens = textTokens(normalizedText).filter((token) => vocab.has(token));
  if (!tokens.length) return null;

  const vocabSize = model.vocab.length;
  const classScores = model.categories.map((categoryId) => {
    const cls = model.classes[categoryId];
    const prior = Math.log((cls.docs + 1) / (model.totalDocs + model.categories.length));
    const tokenScore = tokens.reduce((sum, token) => {
      const count = cls.tokens[token] || 0;
      return sum + Math.log((count + 1) / (cls.totalTokens + vocabSize));
    }, 0);
    return { categoryId, score: prior + tokenScore };
  });

  classScores.sort((a, b) => b.score - a.score);
  const [best, second] = classScores;
  const confidence = second ? Math.min(1, Math.max(0, (best.score - second.score) / 8)) : 0;
  return { categoryId: best.categoryId, confidence };
}

async function fetchMedicalIntake(text) {
  if (!text || window.location.protocol === "file:") return null;
  const response = await fetch("/api/medical-intake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms: text }),
  });
  if (!response.ok) return null;
  return response.json();
}

function categoryIdFromSpecialty(specialty) {
  const map = {
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
  return map[specialty] || "";
}

function applyMedicalIntake(intake) {
  if (!intake) return;
  const categoryId = categoryIdFromSpecialty(intake.recommended_specialty);
  if (categoryId && (categoryId !== "general" || state.selectedSymptoms.size === 0)) state.categoryId = categoryId;

  const conceptText = normalizeText([...(intake.concepts || []), ...(intake.understood_symptoms || []), ...(intake.red_flags || [])].join(" "));
  const addSymptom = (id) => state.selectedSymptoms.add(id);
  const addQuestion = (id) => state.selectedQuestions.add(id);

  if (state.categoryId === "bone") {
    if (conceptText.includes("back") || conceptText.includes("spine") || conceptText.includes("bend")) addSymptom("back-pain");
    if (conceptText.includes("walk") || conceptText.includes("stand") || conceptText.includes("sit") || conceptText.includes("limitation")) addSymptom("walking");
    if (conceptText.includes("numb") || conceptText.includes("sciatica")) addSymptom("numb-leg");
    if (conceptText.includes("bladder") || conceptText.includes("bowel") || conceptText.includes("saddle")) addQuestion("bladder");
  }
  if (state.categoryId === "heart") {
    if (conceptText.includes("chest")) addSymptom("chest-pain");
    if (conceptText.includes("breath")) addSymptom("breath");
    if (conceptText.includes("palpitation") || conceptText.includes("racing")) addSymptom("palpitations");
    if (conceptText.includes("arm") || conceptText.includes("jaw")) addSymptom("jaw-arm");
    if (conceptText.includes("sweat") || conceptText.includes("clammy")) addQuestion("sweat");
  }
  if (state.categoryId === "neuro") {
    if (conceptText.includes("weak") || conceptText.includes("paralysis")) addSymptom("paralysis");
    if (conceptText.includes("face")) addSymptom("facial-droop");
    if (conceptText.includes("seizure")) addSymptom("seizure");
    if (conceptText.includes("headache") || conceptText.includes("migraine")) addSymptom("headache");
    if (conceptText.includes("speech")) addQuestion("speech");
    if (conceptText.includes("one side")) addQuestion("oneSide");
  }
  if (state.categoryId === "stomach") {
    if (conceptText.includes("abdomen") || conceptText.includes("stomach") || conceptText.includes("belly")) addSymptom("abdomen");
    if (conceptText.includes("vomit") || conceptText.includes("nausea")) addSymptom("vomit");
    if (conceptText.includes("diarrhea") || conceptText.includes("loose")) addSymptom("diarrhea");
    if (conceptText.includes("blood") || conceptText.includes("black stool")) addSymptom("blood");
    if (conceptText.includes("dehydrat")) addSymptom("dehydration");
  }
  if (state.categoryId === "mental") {
    if (conceptText.includes("panic") || conceptText.includes("anxiety")) addSymptom("panic");
    if (conceptText.includes("sleep")) addSymptom("sleep");
    if (conceptText.includes("confusion") || conceptText.includes("disorient")) addSymptom("confusion");
    if (conceptText.includes("self harm") || conceptText.includes("suicide") || conceptText.includes("unsafe")) addSymptom("self-harm");
  }
  if (state.categoryId === "dental") {
    if (conceptText.includes("tooth") || conceptText.includes("dental") || conceptText.includes("cavity")) addSymptom("toothache");
    if (conceptText.includes("gum") || conceptText.includes("swelling") || conceptText.includes("abscess")) addSymptom("gum-swelling");
    if (conceptText.includes("chew") || conceptText.includes("biting")) addSymptom("chewing-pain");
    if (conceptText.includes("pus") || conceptText.includes("foul")) addSymptom("mouth-odor");
    if (conceptText.includes("swallow") || conceptText.includes("breath")) addQuestion("swallowBreathing");
  }
  if (state.categoryId === "ent") {
    if (conceptText.includes("ear")) addSymptom("ear-pain");
    if (conceptText.includes("throat") || conceptText.includes("tonsil")) addSymptom("sore-throat");
    if (conceptText.includes("sinus") || conceptText.includes("nose")) addSymptom("sinus");
    if (conceptText.includes("nosebleed") || conceptText.includes("blood from nose")) addSymptom("nosebleed");
    if (conceptText.includes("hearing") || conceptText.includes("vertigo")) addSymptom("hearing-loss");
  }
  if (state.categoryId === "eye") {
    if (conceptText.includes("eye pain")) addSymptom("eye-pain");
    if (conceptText.includes("red eye") || conceptText.includes("conjunctivitis") || conceptText.includes("discharge")) addSymptom("red-eye");
    if (conceptText.includes("vision") || conceptText.includes("cannot see")) addSymptom("vision-loss");
    if (conceptText.includes("injury") || conceptText.includes("chemical")) addSymptom("eye-injury");
  }
  if (state.categoryId === "skin") {
    if (conceptText.includes("rash") || conceptText.includes("itch")) addSymptom("rash");
    if (conceptText.includes("boil") || conceptText.includes("pus") || conceptText.includes("infection")) addSymptom("skin-infection");
    if (conceptText.includes("acne") || conceptText.includes("pimple")) addSymptom("acne");
    if (conceptText.includes("burn") || conceptText.includes("blister")) addSymptom("burn");
  }
  if (state.categoryId === "lung") {
    if (conceptText.includes("cough") || conceptText.includes("phlegm")) addSymptom("cough");
    if (conceptText.includes("wheez") || conceptText.includes("asthma")) addSymptom("wheezing");
    if (conceptText.includes("breath")) addSymptom("breathlessness");
    if (conceptText.includes("blood")) addSymptom("cough-blood");
  }
  if (state.categoryId === "urinary") {
    if (conceptText.includes("burning") || conceptText.includes("painful urination")) addSymptom("burning-urine");
    if (conceptText.includes("blood")) addSymptom("blood-urine");
    if (conceptText.includes("stone") || conceptText.includes("flank")) addSymptom("flank-pain");
    if (conceptText.includes("cannot pass urine") || conceptText.includes("retention")) addSymptom("urine-retention");
  }
  if (state.categoryId === "women") {
    if (conceptText.includes("pregnan")) addSymptom("pregnancy");
    if (conceptText.includes("pelvic")) addSymptom("pelvic-pain");
    if (conceptText.includes("period") || conceptText.includes("menstrual")) addSymptom("period-problem");
    if (conceptText.includes("discharge")) addSymptom("vaginal-discharge");
    if (conceptText.includes("bleeding")) addSymptom("pregnancy-bleeding");
  }
  if (state.categoryId === "child") {
    if (conceptText.includes("fever")) addSymptom("child-fever");
    if (conceptText.includes("breath")) addSymptom("child-breathing");
    if (conceptText.includes("feeding") || conceptText.includes("drowsy") || conceptText.includes("dehydrat")) addSymptom("child-dehydration");
    if (conceptText.includes("rash")) addSymptom("child-rash");
    if (conceptText.includes("vomit") || conceptText.includes("diarrhea") || conceptText.includes("loose")) addSymptom("child-vomit-diarrhea");
  }

  if (intake.urgency === "emergency") {
    byId("severity").value = "8";
    byId("onset").value = "hours";
  } else if (intake.urgency === "routine") {
    byId("severity").value = "4";
  } else {
    byId("severity").value = "6";
  }
  severityValue.textContent = byId("severity").value;
}

function startGuidedQa(intake = null) {
  const text = symptomInput.value.trim();
  const inference = inferFromText(text);
  state.medicalIntake = intake;
  state.categoryId = inference.categoryId;
  state.selectedSymptoms = new Set(inference.matchedSymptoms);
  state.selectedQuestions.clear();
  applyMedicalIntake(intake);

  if (!text) {
    renderGuidedQuestions();
    detectedReason.textContent = "Start by typing symptoms. I selected the most safety-sensitive area until more detail is available.";
    return;
  }

  renderGuidedQuestions();
}

function showScreen(name) {
  const screens = {
    symptoms: symptomScreen,
    questions: questionScreen,
    results: resultsScreen,
  };
  Object.values(screens).forEach((screen) => screen?.classList.remove("active"));
  screens[name]?.classList.add("active");

  byId("progressSymptoms")?.classList.toggle("active", name === "symptoms");
  byId("progressQuestions")?.classList.toggle("active", name === "questions");
  byId("progressResults")?.classList.toggle("active", name === "results");
  window.scrollTo?.({ top: 0, behavior: "smooth" });
}

function inferHiddenRoutingDefaults() {
  const text = normalizeText(symptomInput.value || "");
  const selectedQuestionIds = selectedQuestionObjects().map((question) => question.id);
  const selectedSymptomIds = selectedSymptomObjects().map((symptom) => symptom.id);
  const sudden = text.includes("sudden") || selectedQuestionIds.includes("sudden") || selectedQuestionIds.includes("suddenChest");
  const emergencySignal =
    selectedSymptomObjects().some((symptom) => symptom.redFlag) ||
    selectedQuestionObjects().some((question) => question.risk >= 4 || question.inverseRisk >= 4);
  const functionalLimitSignal =
    selectedSymptomIds.includes("walking") ||
    selectedQuestionIds.includes("walkingNow");
  const directedSpecialtySignal = state.categoryId !== "general" && selectedSymptomIds.length > 0;

  byId("onset").value = sudden ? "hours" : "days";
  byId("severity").value =
    emergencySignal ? "8" : functionalLimitSignal || directedSpecialtySignal || selectedSymptomIds.length + selectedQuestionIds.length >= 3 ? "5" : "4";
  severityValue.textContent = byId("severity").value;
  byId("ageGroup").value = "adult";
  byId("budget").value = "balanced";
  distancePreference.value = emergencySignal ? "nearby" : "balanced";
  syncDistanceBar();
}

function selectedSymptomObjects() {
  return activeCategory().symptoms.filter((symptom) => state.selectedSymptoms.has(symptom.id));
}

function selectedQuestionObjects() {
  return activeCategory().questions.filter((question) => state.selectedQuestions.has(question.id));
}

function assess() {
  const category = activeCategory();
  const selectedSymptoms = selectedSymptomObjects();
  const selectedQuestions = selectedQuestionObjects();
  const severityScore = Number(severity.value);
  const onset = byId("onset").value;
  const ageGroup = byId("ageGroup").value;

  const symptomRisk = selectedSymptoms.reduce((sum, symptom) => sum + symptom.weight, 0);
  const questionRisk = selectedQuestions.reduce((sum, question) => sum + question.risk + (question.inverseRisk || 0), 0);
  const hasRedFlag = selectedSymptoms.some((symptom) => symptom.redFlag) || selectedQuestions.some((question) => question.risk >= 5);
  const sudden = onset === "minutes" || onset === "hours";
  const ageBoost = ageGroup === "older" ? 2 : ageGroup === "child" ? 1 : 0;
  const riskScore = symptomRisk + questionRisk + severityScore + ageBoost + (sudden ? 2 : 0);

  let level = "routine";
  if ((hasRedFlag && sudden) || severityScore >= 8 || riskScore >= 18) {
    level = "emergency";
  } else if (hasRedFlag || severityScore >= 5 || riskScore >= 10) {
    level = "soon";
  }

  const careText = {
    emergency: {
      title: "Emergency care recommended now",
      body:
        "Your answers include red-flag or high-severity features. In India, call 112 for emergency help or 108 for ambulance support where available, or go to the nearest emergency department now.",
    },
    soon: {
      title: "Specialist or urgent clinic within 24-72 hours",
      body:
        "Your symptoms deserve timely medical review. A specialist or urgent clinic is a better match than a routine appointment, especially if symptoms worsen.",
    },
    routine: {
      title: "Routine clinic or primary care is a reasonable first step",
      body:
        "Your answers look lower-acuity in this prototype. Start with primary care or a cost-conscious specialist, and seek urgent care if new severe symptoms appear.",
    },
  };

  const categorySpecialty = category.displaySpecialty || category.specialty;
  const backupSpecialty = level === "routine" ? "Primary Care / General Physician" : "Emergency Medicine";

  const assessment = {
    category,
    selectedSymptoms,
    selectedQuestions,
    severityScore,
    onset,
    ageGroup,
    riskScore,
    level,
    specialty: level === "emergency" ? "Emergency Medicine + " + categorySpecialty : categorySpecialty,
    backupSpecialty,
    care: careText[level],
  };
  assessment.differentials = predictDifferentials(assessment);
  assessment.routingReasons = routingReasons(assessment);
  assessment.routingConfidence = routingConfidence(assessment);
  return assessment;
}

function routingReasons(assessment) {
  const reasons = [];
  const symptomLabels = assessment.selectedSymptoms.map((symptom) => symptom.label.toLowerCase());
  const questionLabels = assessment.selectedQuestions.map((question) => question.label.toLowerCase());

  if (assessment.level === "emergency") reasons.push("Emergency level selected because red-flag or high-severity answers were present.");
  if (assessment.category.id === "neuro") reasons.push("Neurology route because symptoms involve weakness, numbness, seizure, headache, balance, or one-sided changes.");
  if (assessment.category.id === "heart") reasons.push("Cardiology route because symptoms involve chest pressure, breathlessness, palpitations, or exertional worsening.");
  if (assessment.category.id === "bone") reasons.push("Orthopedics route because symptoms involve injury, joint/back pain, walking difficulty, or limb trauma.");
  if (assessment.category.id === "mental") reasons.push("Psychiatry route because symptoms involve mood, panic, confusion, unsafe thoughts, or sleep/behavior changes.");
  if (assessment.category.id === "stomach") reasons.push("Gastroenterology route because symptoms involve abdominal pain, vomiting, diarrhea, blood, or dehydration.");
  if (assessment.category.id === "dental") reasons.push("Dentist route because symptoms involve tooth, gum, chewing pain, dental injury, or possible dental infection.");
  if (assessment.category.id === "ent") reasons.push("ENT route because symptoms involve ear, nose, throat, sinus, hearing, voice, or nosebleed concerns.");
  if (assessment.category.id === "eye") reasons.push("Ophthalmology route because symptoms involve eye pain, redness, injury, or vision changes.");
  if (assessment.category.id === "skin") reasons.push("Dermatology route because symptoms involve rash, itching, acne, hair/nail changes, burns, or skin infection.");
  if (assessment.category.id === "lung") reasons.push("Pulmonology route because symptoms involve cough, wheezing, asthma-like symptoms, or breathing difficulty.");
  if (assessment.category.id === "urinary") reasons.push("Urology route because symptoms involve urination, bladder, blood in urine, kidney stone pain, or urine retention.");
  if (assessment.category.id === "women") reasons.push("Gynecology/obstetrics route because symptoms involve pregnancy, periods, pelvic pain, or vaginal symptoms.");
  if (assessment.category.id === "child") reasons.push("Pediatrics route because the symptoms are described for a baby or child.");
  if (assessment.category.id === "general") reasons.push("General physician route because symptoms are unclear, mixed, or outside this prototype's specialty scope.");
  if (symptomLabels.some((label) => label.includes("sudden") || label.includes("paralysis") || label.includes("facial"))) {
    reasons.push("Fast escalation because sudden weakness/facial or one-sided symptoms can be time-sensitive.");
  }
  if (questionLabels.some((label) => label.includes("breathe normally"))) {
    reasons.push("Breathing concern increases urgency regardless of the suspected body system.");
  }

  return reasons.slice(0, 4);
}

function routingConfidence(assessment) {
  const signalCount = assessment.selectedSymptoms.length + assessment.selectedQuestions.length;
  if (assessment.level === "emergency" && assessment.riskScore >= 14) return "high";
  if (signalCount >= 4 || assessment.riskScore >= 10) return "medium";
  return "low";
}

function predictDifferentials(assessment) {
  const text = normalizeText(symptomInput.value || "");
  const selectedSymptomIds = new Set(assessment.selectedSymptoms.map((symptom) => symptom.id));
  const selectedQuestionIds = new Set(assessment.selectedQuestions.map((question) => question.id));
  const severityBoost = { routine: 0, soon: 2, emergency: 4 };

  return conditionBank
    .map((condition) => {
      const categoryScore = condition.categoryId === assessment.category.id ? 8 : -4;
      const symptomScore = condition.symptoms.reduce((sum, id) => sum + (selectedSymptomIds.has(id) ? 5 : 0), 0);
      const questionScore = condition.questions.reduce((sum, id) => sum + (selectedQuestionIds.has(id) ? 4 : 0), 0);
      const phraseScore = condition.phrases.reduce((sum, phrase) => sum + (text.includes(phrase) ? 3 : 0), 0);
      const severityScore = condition.severity === assessment.level ? severityBoost[assessment.level] : 0;
      return {
        ...condition,
        score: categoryScore + symptomScore + questionScore + phraseScore + severityScore,
      };
    })
    .filter((condition) => condition.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function providerFit(provider, assessment) {
  const city = byId("location").value;
  const budget = byId("budget").value;
  const levelRank = { routine: 1, soon: 2, emergency: 3 };
  const neededRank = levelRank[assessment.level];
  const providerRank = levelRank[provider.level];
  const specialtyFit =
    provider.specialties.includes(assessment.category.specialty) ||
    provider.specialties.includes("Emergency Medicine") ||
    provider.specialties.includes("Primary Care");
  const locationFit = city === "any" || provider.city === city;
  const levelFit = assessment.level === provider.level ? 24 : providerRank > neededRank ? 8 : -8;
  const quality = provider.doctorQuality * 8 + provider.hospitalQuality * 5;
  const costWeight = budget === "budget" ? 1200 : budget === "quality" ? 3200 : 2000;
  const qualityBoost = budget === "quality" ? provider.hospitalQuality * 8 : 0;
  const costPenalty = provider.costLow / costWeight;

  return (specialtyFit ? 22 : 0) + (locationFit ? 16 : -10) + levelFit + quality + qualityBoost - costPenalty;
}

function matchingProviders(assessment) {
  const city = byId("location").value;
  let matched = providers
    .filter((provider) => city === "any" || provider.city === city)
    .filter((provider) => levelEligible(provider.level, assessment.level))
    .filter(
      (provider) =>
        provider.specialties.includes(assessment.category.specialty) ||
        provider.specialties.includes("Emergency Medicine") ||
        provider.specialties.includes("Primary Care"),
    );

  if (!matched.length) {
    matched = providers
      .filter((provider) => levelEligible(provider.level, assessment.level))
      .filter((provider) =>
        provider.specialties.includes(assessment.category.specialty) ||
        provider.specialties.includes("Emergency Medicine") ||
        provider.specialties.includes("Primary Care"),
      );
  }

  matched = matched.map((provider) => ({ ...provider, fit: providerFit(provider, assessment) }));
  return sortMatched(matched).slice(0, 5);
}

function levelEligible(providerLevel, neededLevel) {
  if (neededLevel === "emergency") return providerLevel === "emergency";
  if (neededLevel === "soon") return providerLevel === "soon" || providerLevel === "routine";
  return providerLevel === "routine";
}

function sortMatched(list) {
  const sort = sortProviders.value;
  return [...list].sort((a, b) => {
    if (sort === "cost") return a.costLow - b.costLow;
    if (sort === "rating") return b.doctorQuality - a.doctorQuality;
    return b.fit - a.fit;
  });
}

function renderResults(assessment) {
  state.lastAssessment = assessment;
  emptyState.classList.add("hidden");
  results.classList.remove("hidden");

  const triageCard = byId("triageCard");
  triageCard.className = `triage-card ${assessment.level}`;
  triageCard.innerHTML = `
    <h3>${assessment.care.title}</h3>
    <p>${assessment.care.body}</p>
  `;

  byId("summaryGrid").innerHTML = `
    <div class="summary-card"><span>Care level</span><strong>${assessment.level}</strong></div>
    <div class="summary-card"><span>Best specialty</span><strong>${assessment.specialty}</strong></div>
  `;

  byId("explainCard").innerHTML = `
    <strong>Why this route?</strong>
    <ul>${assessment.routingReasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>
    <p>Possible causes considered: ${escapeHtml(assessment.differentials.map((condition) => condition.name).join(", ") || "clinician review needed")}.</p>
  `;

  const key = mapsApiKey.value.trim();
  if (key) {
    localStorage.setItem("carematch:mapsApiKey", key);
    placesStatus.textContent = "Loading live Google Places results...";
    providerList.innerHTML = "";
    renderLivePlaces(assessment, key).catch((error) => {
      placesStatus.textContent = `Live Google Places failed, so fallback Maps searches are shown. ${error.message}`;
      renderMapsFallback(assessment);
    });
    return;
  }

  placesStatus.textContent =
    "Fallback mode: these are Google Maps search links, not live place listings. Add a Google Maps JavaScript API key to show actual nearby hospitals and doctors here.";
  renderMapsFallback(assessment);
  localStorage.setItem("carematch:lastAssessment", JSON.stringify(assessmentSnapshot()));
}

function renderMapsFallback(assessment) {
  const matches = mapsRecommendations(assessment);
  providerList.innerHTML = matches
    .map(
      (item) => `
      <article class="provider-card">
        <div>
          <h4>${item.title}</h4>
          <p><strong>${item.query}</strong></p>
          <p>${item.note}</p>
          <div class="meta-row">
            <span class="tag">${item.level} care</span>
            <span class="tag">${item.radius}</span>
            <span class="tag">${item.tier}</span>
            <span class="tag">${item.specialty}</span>
          </div>
          <div class="map-actions">
            <a class="map-link" href="${item.searchUrl}" target="_self">Open Google Maps list</a>
            <a class="map-link" href="${item.directionsUrl}" target="_self">Open directions search</a>
          </div>
        </div>
        <div class="provider-score">
          <span class="score">${item.priority}</span>
          <span class="cost">${item.cost}</span>
          <span class="fine-print">Use Google Maps ratings, distance, open hours, call button, and recent reviews before choosing.</span>
        </div>
      </article>
    `,
    )
    .join("");
}

async function renderLivePlaces(assessment, key) {
  await ensureGoogleMaps(key);
  const routes = mapsRecommendations(assessment);
  const origin = await resolveSearchOrigin();
  const placeGroups = await Promise.all(routes.map((route) => textSearchPlaces(route, origin)));
  const places = await sortPlacesByDistance(dedupePlaces(placeGroups.flat()), origin).then((items) => items.slice(0, 9));

  if (!places.length) {
    throw new Error("No live Places results came back for this location.");
  }

  placesStatus.textContent = origin
    ? `Live Google Places mode: results are searched near ${origin.label} and ranked using map distance when available. Always call and verify availability before travelling.`
    : "Live Google Places mode: names, ratings, addresses, and open status are coming from Google Places. Always call and verify availability before travelling.";
  providerList.innerHTML = places
    .map(
      (place, index) => `
      <article class="provider-card">
        <div>
          <h4>${escapeHtml(place.name)}</h4>
          <p><strong>${escapeHtml(place.routeTitle)}</strong></p>
          <p>${escapeHtml(place.address || "Address not available from Places result.")}</p>
          <div class="meta-row">
            <span class="tag">${escapeHtml(place.level)} care</span>
            <span class="tag">${escapeHtml(place.specialty)}</span>
            <span class="tag">${escapeHtml(place.distanceText || "distance unavailable")}</span>
            <span class="tag">${place.openNow}</span>
            <span class="tag">${place.reviewText}</span>
          </div>
          <div class="map-actions">
            <a class="map-link" href="${place.mapsUrl}" target="_self">Open Google Maps</a>
            <a class="map-link" href="${place.directionsUrl}" target="_self">Directions</a>
          </div>
        </div>
        <div class="provider-score">
          <span class="score">#${index + 1}</span>
          <span class="cost">${escapeHtml(place.estimatedCost)}</span>
          <span class="fine-print">Google rating: ${place.ratingText}. ${escapeHtml(place.distanceNote || "Confirm emergency/OPD availability by phone.")}</span>
        </div>
      </article>
    `,
    )
    .join("");
  localStorage.setItem("carematch:lastAssessment", JSON.stringify(assessmentSnapshot()));
}

function ensureGoogleMaps(key) {
  if (window.google?.maps?.places) {
    setupPlacesService();
    return Promise.resolve();
  }
  if (mapsLoadPromise) return mapsLoadPromise;

  mapsLoadPromise = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("Google Maps took too long to load."));
    }, 7000);
    window.__carematchMapsReady = () => {
      window.clearTimeout(timeout);
      setupPlacesService();
      resolve();
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&callback=__carematchMapsReady`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error("Could not load Google Maps JavaScript API. Check the key, billing, Places API, and browser/network access."));
    };
    document.head.appendChild(script);
  });

  return mapsLoadPromise;
}

function setupPlacesService() {
  if (placesService) return;
  const holder = document.createElement("div");
  holder.style.display = "none";
  document.body.appendChild(holder);
  placesService = new google.maps.places.PlacesService(holder);
  geocoder = new google.maps.Geocoder();
  distanceMatrixService = new google.maps.DistanceMatrixService();
}

function searchRadiusMeters() {
  const preference = distancePreference.value;
  if (preference === "wide") return 25000;
  if (preference === "balanced") return 10000;
  return 5000;
}

async function resolveSearchOrigin() {
  const place = normalizedPlace();
  if (place.coords) return { label: "your current location", coords: place.coords };
  if (!geocoder) return null;

  return new Promise((resolve) => {
    geocoder.geocode({ address: place.label, region: "in" }, (results, status) => {
      if (status !== "OK" || !results?.[0]?.geometry?.location) {
        resolve(null);
        return;
      }
      const result = results[0];
      const location = result.geometry.location;
      resolve({
        label: result.formatted_address || place.label,
        coords: { lat: location.lat(), lng: location.lng() },
      });
    });
  });
}

function textSearchPlaces(route, origin) {
  return new Promise((resolve) => {
    const request = {
      query: origin ? route.baseQuery : route.query,
      region: "in",
    };

    if (origin) {
      request.location = new google.maps.LatLng(origin.coords.lat, origin.coords.lng);
      request.radius = searchRadiusMeters();
    }

    placesService.textSearch(request, (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
        resolve([]);
        return;
      }
      const indiaResults = results.filter(isIndiaPlace);
      const scopedResults = indiaResults.length ? indiaResults : results.filter((place) => !isClearlyOutsideIndia(place));
      resolve(
        scopedResults.slice(0, 5).map((place) => ({
          id: place.place_id,
          placeId: place.place_id,
          name: place.name || "Unnamed place",
          address: place.formatted_address || place.vicinity || "",
          types: place.types || [],
          coords: place.geometry?.location
            ? { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
            : null,
          rating: place.rating,
          reviews: place.user_ratings_total,
          openNow: place.opening_hours?.open_now === true ? "Open now" : place.opening_hours?.open_now === false ? "May be closed" : "Hours unknown",
          level: route.level,
          specialty: route.specialty,
          routeTitle: route.title,
          routeQuery: route.baseQuery || route.query,
          estimatedCost: route.cost,
          fitRank: route.fitRank,
          mapsUrl: googlePlaceSearchUrl(place),
          directionsUrl: googlePlaceDirectionsUrl(place),
        })),
      );
    });
  });
}

function straightLineDistanceMeters(from, to) {
  const earthRadiusMeters = 6371000;
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const deltaLat = ((to.lat - from.lat) * Math.PI) / 180;
  const deltaLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distanceText(meters, approximate = false) {
  if (!Number.isFinite(meters)) return "distance unavailable";
  const value = meters >= 10000 ? `${Math.round(meters / 1000)} km` : `${(meters / 1000).toFixed(1)} km`;
  return approximate ? `about ${value}` : value;
}

function fallbackDistanceSort(places, origin) {
  return places.map((place) => {
    const meters = place.coords ? straightLineDistanceMeters(origin.coords, place.coords) : Number.POSITIVE_INFINITY;
    return {
      ...place,
      distanceMeters: meters,
      distanceText: distanceText(meters, true),
      distanceNote: "Approximate straight-line distance shown. Confirm travel time and availability before going.",
    };
  });
}

async function sortPlacesByDistance(places, origin) {
  if (!origin || !places.length) return places;

  const placesWithCoords = places.filter((place) => place.coords);
  const placesWithoutCoords = places.filter((place) => !place.coords);
  let measuredPlaces = [];

  if (distanceMatrixService && placesWithCoords.length) {
    measuredPlaces = await new Promise((resolve) => {
      distanceMatrixService.getDistanceMatrix(
        {
          origins: [new google.maps.LatLng(origin.coords.lat, origin.coords.lng)],
          destinations: placesWithCoords.slice(0, 25).map((place) => new google.maps.LatLng(place.coords.lat, place.coords.lng)),
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status !== "OK") {
            resolve([]);
            return;
          }

          const elements = response?.rows?.[0]?.elements || [];
          resolve(
            placesWithCoords.map((place, index) => {
              const element = elements[index];
              const meters =
                element?.status === "OK" && element.distance?.value
                  ? element.distance.value
                  : straightLineDistanceMeters(origin.coords, place.coords);
              const approximate = element?.status !== "OK" || !element.distance?.value;
              return {
                ...place,
                distanceMeters: meters,
                distanceText: distanceText(meters, approximate),
                distanceNote: approximate
                  ? "Approximate straight-line distance shown. Confirm travel time and availability before going."
                  : `Driving distance from ${origin.label}. Confirm emergency/OPD availability by phone.`,
              };
            }),
          );
        },
      );
    });
  }

  if (!measuredPlaces.length) measuredPlaces = fallbackDistanceSort(placesWithCoords, origin);
  const allPlaces = [...measuredPlaces, ...placesWithoutCoords];
  const radiusMeters = searchRadiusMeters();
  const preference = distancePreference.value;
  const rankedPlaces = sortRankedPlaces(allPlaces, preference);
  const inRadiusPlaces = rankedPlaces.filter((place) => Number.isFinite(place.distanceMeters) && place.distanceMeters <= radiusMeters);
  const outsideRadiusPlaces = rankedPlaces.filter((place) => !inRadiusPlaces.includes(place));
  const candidatePlaces = inRadiusPlaces.length
    ? [...inRadiusPlaces, ...outsideRadiusPlaces].slice(0, 9)
    : rankedPlaces.slice(0, 9);

  return candidatePlaces;
}

function sortRankedPlaces(places, preference) {
  return [...places].sort((a, b) => {
    const distanceA = a.distanceMeters ?? Number.POSITIVE_INFINITY;
    const distanceB = b.distanceMeters ?? Number.POSITIVE_INFINITY;
    if (preference === "nearby") {
      const distanceDelta = distanceA - distanceB;
      if (Math.abs(distanceDelta) > 50) return distanceDelta;
      return livePlaceQualityScore(b) - livePlaceQualityScore(a);
    }

    const qualityA = livePlaceQualityScore(a);
    const qualityB = livePlaceQualityScore(b);
    if (preference === "balanced") return qualityB - distanceB / 1200 - (qualityA - distanceA / 1200);
    return qualityB - distanceB / 3500 - (qualityA - distanceA / 3500);
  });
}

const specialtySearchAliases = {
  Dentistry: ["dental", "dentist", "tooth", "oral", "orthodont", "endodont"],
  ENT: ["ent", "ear", "nose", "throat", "hearing", "sinus"],
  Ophthalmology: ["eye", "ophthalm", "vision", "retina", "optical"],
  Dermatology: ["skin", "derma", "cosmetology", "hair"],
  Pulmonology: ["chest", "lung", "pulmon", "respiratory", "asthma"],
  Urology: ["uro", "urology", "kidney", "urinary"],
  Pediatrics: ["child", "children", "pediatric", "paediatric", "kids"],
  "Obstetrics and Gynaecology": ["gyn", "gynaec", "gynec", "obstetric", "maternity", "women"],
  Gastroenterology: ["gastro", "digestive", "liver", "endoscopy", "stomach"],
  Cardiology: ["cardio", "heart", "cardiac"],
  Neurology: ["neuro", "brain", "spine"],
  Orthopedics: ["ortho", "bone", "joint", "spine", "trauma"],
  Psychiatry: ["psychiat", "mental", "psychology", "counselling"],
  "Emergency Medicine": ["emergency", "casualty", "trauma", "24 hours"],
  GeneralMedicine: ["general", "family", "clinic", "physician", "multi"],
};

function livePlaceQualityScore(place) {
  const rating = place.rating || 0;
  const reviewScore = Math.min(place.reviews || 0, 1000) / 35;
  const openScore = place.openNow === "Open now" ? 5 : place.openNow === "May be closed" ? -3 : 0;
  return (place.fitRank || 0) + rating * 9 + reviewScore + openScore + specialtyMatchScore(place) + placeTypeScore(place);
}

function specialtyMatchScore(place) {
  const aliases = specialtySearchAliases[place.specialty] || [];
  const text = normalizeText(`${place.name || ""} ${place.address || ""} ${place.routeQuery || ""}`);
  const matches = aliases.filter((alias) => text.includes(alias)).length;
  if (matches >= 2) return 18;
  if (matches === 1) return 10;
  if (place.specialty !== "GeneralMedicine" && text.includes("multi")) return 3;
  return place.specialty === "GeneralMedicine" ? 6 : -6;
}

function placeTypeScore(place) {
  const types = new Set(place.types || []);
  let score = 0;
  if (types.has("hospital")) score += 8;
  if (types.has("doctor")) score += 7;
  if (types.has("dentist")) score += 10;
  if (types.has("health")) score += 4;
  if (types.has("pharmacy")) score -= 12;
  if (types.has("physiotherapist")) score -= 8;
  return score;
}

function dedupePlaces(places) {
  const seen = new Set();
  return places
    .filter((place) => {
      const key = place.id || `${place.name}-${place.address}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      return livePlaceQualityScore(b) - livePlaceQualityScore(a);
    })
    .map((place) => ({
      ...place,
      ratingText: place.rating ? `${place.rating.toFixed(1)}/5` : "not listed",
      reviewText: place.reviews ? `${place.reviews.toLocaleString("en-IN")} reviews` : "reviews not listed",
    }));
}

function googlePlaceSearchUrl(place) {
  const query = `${place.name || ""} ${place.formatted_address || place.vicinity || ""}`.trim();
  const idPart = place.placeId || place.place_id ? `&query_place_id=${encodeURIComponent(place.placeId || place.place_id)}` : "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}${idPart}`;
}

function googlePlaceDirectionsUrl(place) {
  const query = `${place.name || ""} ${place.formatted_address || place.vicinity || ""}`.trim();
  const idPart = place.placeId || place.place_id ? `&destination_place_id=${encodeURIComponent(place.placeId || place.place_id)}` : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}${idPart}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mapsRecommendations(assessment) {
  const place = normalizedPlace();
  const locationPhrase = place.coords ? `${place.coords.lat},${place.coords.lng}` : place.label;
  const specialty = assessment.category.id === "general" ? "General Physician" : assessment.category.specialty;
  const routes = routeTemplates(assessment, specialty);
  const sort = sortProviders.value;

  const sortedRoutes = [...routes].sort((a, b) => {
    if (sort === "cost") return a.costRank - b.costRank;
    if (sort === "rating") return b.qualityRank - a.qualityRank;
    return b.fitRank - a.fitRank;
  });

  return sortedRoutes.map((route, index) => {
    const query = `${route.query} ${distancePhrase()} ${locationPhrase}`;
    return {
      ...route,
      priority: `#${index + 1}`,
      baseQuery: route.query,
      query,
      searchUrl: googleMapsSearchUrl(query),
      directionsUrl: googleMapsDirectionsUrl(query),
    };
  });
}

function distancePhrase() {
  const preference = distancePreference.value;
  if (preference === "wide") return "in and around";
  if (preference === "balanced") return "near";
  return "closest to";
}

const distanceModes = [
  { value: "nearby", label: "Closest" },
  { value: "balanced", label: "Balanced" },
  { value: "wide", label: "Wider area" },
];

function syncDistanceBar() {
  const index = Math.max(0, distanceModes.findIndex((mode) => mode.value === distancePreference.value));
  const safeIndex = index === -1 ? 0 : index;
  distanceRange.value = String(safeIndex);
  distanceLabelOutput.value = distanceModes[safeIndex].label;
  distanceLabelOutput.textContent = distanceModes[safeIndex].label;
}

function setDistancePreferenceFromBar() {
  const mode = distanceModes[Number(distanceRange.value)] || distanceModes[0];
  distancePreference.value = mode.value;
  syncDistanceBar();
  if (state.lastAssessment) renderResults(state.lastAssessment);
}

function routeTemplates(assessment, specialty) {
  if (assessment.level === "emergency") {
    return [
      {
        title: "Nearest emergency hospital for red-flag symptoms",
        query: emergencyQuery(assessment),
        note: "Use this first for sudden paralysis, facial droop, severe chest pain, seizure, breathing trouble, or confusion. Do not wait for an OPD appointment.",
        level: "emergency",
        radius: distanceLabel("Nearest open ER"),
        tier: "Emergency / casualty",
        specialty: "Emergency Medicine",
        cost: emergencyCostRange(),
        fitRank: 100,
        costRank: 3,
        qualityRank: 95,
      },
      {
        title: `${specialty} emergency-capable hospital`,
        query: `${specialty} emergency hospital`,
        note: "Best when Maps shows a real emergency department plus the needed specialty. Check open status and call before travelling if possible.",
        level: "emergency",
        radius: distanceLabel("Nearby tertiary care"),
        tier: "Specialist emergency hospital",
        specialty,
        cost: emergencyCostRange(),
        fitRank: 92,
        costRank: 4,
        qualityRank: 100,
      },
      {
        title: "Government or medical college emergency option",
        query: `government hospital emergency ${specialty}`,
        note: "Often lower-cost and high-volume. Useful when budget matters, but compare distance and crowding on Maps.",
        level: "emergency",
        radius: distanceLabel("Public hospital search"),
        tier: "Lower-cost emergency",
        specialty: "Emergency Medicine",
        cost: "Rs. 0-Rs. 15,000+",
        fitRank: 82,
        costRank: 1,
        qualityRank: 75,
      },
    ];
  }

  if (assessment.category.id === "general") {
    return [
      {
        title: "General physician near you",
        query: "general physician clinic",
        note: "Best first stop when symptoms are mixed, unclear, or outside a single specialty pattern. Ask for an examination and referral if needed.",
        level: assessment.level,
        radius: distanceLabel("Within your locality"),
        tier: "Primary care",
        specialty: "General Physician",
        cost: "Rs. 300-Rs. 1,500",
        fitRank: 98,
        costRank: 1,
        qualityRank: 82,
      },
      {
        title: "Multi-speciality clinic with general medicine",
        query: "general medicine multi speciality clinic",
        note: "Useful if symptoms involve several body systems or may need basic tests before choosing a specialist.",
        level: assessment.level,
        radius: distanceLabel("Nearby clinic search"),
        tier: "General medicine OPD",
        specialty: "General Medicine",
        cost: "Rs. 800-Rs. 3,000",
        fitRank: 90,
        costRank: 2,
        qualityRank: 86,
      },
      {
        title: "Low-cost clinic or government PHC",
        query: "government primary health centre clinic",
        note: "Useful when cost is the main concern and symptoms are not obvious emergency signs. Check timings and reviews on Maps.",
        level: assessment.level,
        radius: distanceLabel("Public clinic search"),
        tier: "Budget clinic",
        specialty: "Primary Care",
        cost: "Rs. 0-Rs. 500",
        fitRank: 78,
        costRank: 0,
        qualityRank: 64,
      },
    ];
  }

  if (assessment.level === "soon") {
    return [
      {
        title: `${specialty} specialist near you`,
        query: `${specialty} doctor`,
        note: "Open the Maps list and compare doctor ratings, recent reviews, clinic distance, appointment hours, and call availability.",
        level: "soon",
        radius: distanceLabel("Within your locality"),
        tier: "Specialist OPD",
        specialty,
        cost: specialistCostRange(),
        fitRank: 96,
        costRank: 3,
        qualityRank: 92,
      },
      {
        title: "Urgent care or multi-speciality clinic",
        query: `urgent care clinic ${specialty}`,
        note: "Good for symptoms that should be seen in 24-72 hours but are not obvious emergency signs.",
        level: "soon",
        radius: distanceLabel("Nearby clinic search"),
        tier: "Urgent clinic",
        specialty,
        cost: "Rs. 800-Rs. 4,000",
        fitRank: 88,
        costRank: 2,
        qualityRank: 82,
      },
      {
        title: "Cost-conscious specialist route",
        query: `government hospital ${specialty} OPD`,
        note: "Better for lower consultation cost. Check OPD days, token timing, and crowd levels before going.",
        level: "soon",
        radius: distanceLabel("Public OPD search"),
        tier: "Government OPD",
        specialty,
        cost: "Rs. 0-Rs. 1,000",
        fitRank: 76,
        costRank: 1,
        qualityRank: 70,
      },
    ];
  }

  return [
    {
      title: "General physician or family clinic nearby",
      query: "general physician clinic",
      note: "Best first stop for mild symptoms, basic examination, and deciding whether a specialist is actually needed.",
      level: "routine",
      radius: distanceLabel("Closest clinics"),
      tier: "Primary care",
      specialty: "General Physician",
      cost: "Rs. 300-Rs. 1,500",
      fitRank: 96,
      costRank: 1,
      qualityRank: 78,
    },
    {
      title: `${specialty} OPD if symptoms keep recurring`,
      query: `${specialty} doctor clinic`,
      note: "Use this if the symptom pattern is repeated, unusual, or not improving after a primary-care visit.",
      level: "routine",
      radius: distanceLabel("Nearby specialist OPD"),
      tier: "Specialist OPD",
      specialty,
      cost: specialistCostRange(),
      fitRank: 84,
      costRank: 3,
      qualityRank: 88,
    },
    {
      title: "Low-cost clinic or government PHC",
      query: "government primary health centre clinic",
      note: "Useful when cost is the main concern and symptoms are mild. Check timings and reviews on Maps.",
      level: "routine",
      radius: distanceLabel("Public clinic search"),
      tier: "Budget clinic",
      specialty: "Primary Care",
      cost: "Rs. 0-Rs. 500",
      fitRank: 74,
      costRank: 0,
      qualityRank: 62,
    },
  ];
}

function distanceLabel(base) {
  const preference = distancePreference.value;
  if (preference === "wide") return `${base} · wider area`;
  if (preference === "balanced") return `${base} · balanced`;
  return `${base} · nearest first`;
}

function emergencyQuery(assessment) {
  if (assessment.category.id === "neuro") return "stroke emergency hospital";
  if (assessment.category.id === "heart") return "cardiac emergency hospital";
  if (assessment.category.id === "bone") return "trauma emergency hospital";
  if (assessment.category.id === "mental") return "psychiatric emergency hospital";
  return "emergency hospital";
}

function specialistCostRange() {
  return "Rs. 700-Rs. 3,500";
}

function emergencyCostRange() {
  return "Rs. 5,000-Rs. 1,00,000+";
}

function normalizedPlace() {
  const raw = byId("location").value.trim();
  if (raw.startsWith("Current location:")) {
    const parts = raw.replace("Current location:", "").split(",").map((part) => Number(part.trim()));
    if (parts.length === 2 && parts.every((part) => Number.isFinite(part))) {
      return { label: raw, coords: { lat: parts[0], lng: parts[1] } };
    }
  }
  if (!raw) return { label: "India" };
  if (/^\d{6}$/.test(raw)) return { label: `${raw}, India` };
  if (/\bindia\b/i.test(raw)) return { label: raw };
  return { label: `${raw}, India` };
}

function setSearchLocation(value) {
  const cleanValue = value.trim() || "near me";
  byId("location").value = cleanValue;
  if (addressInput) addressInput.value = cleanValue;
}

function applyManualAddress() {
  setSearchLocation(addressInput.value);
  if (state.lastAssessment) renderResults(state.lastAssessment);
}

function isIndiaPlace(place) {
  const address = `${place.formatted_address || ""} ${place.vicinity || ""}`.toLowerCase();
  return (
    address.includes("india") ||
    address.includes("telangana") ||
    address.includes("andhra pradesh") ||
    address.includes("maharashtra") ||
    address.includes("karnataka") ||
    address.includes("tamil nadu") ||
    address.includes("delhi") ||
    address.includes("west bengal") ||
    address.includes("kerala") ||
    address.includes("uttar pradesh") ||
    address.includes("gujarat") ||
    address.includes("rajasthan")
  );
}

function isClearlyOutsideIndia(place) {
  const address = `${place.formatted_address || ""} ${place.vicinity || ""}`.toLowerCase();
  return (
    address.includes("usa") ||
    address.includes("united states") ||
    address.includes("canada") ||
    address.includes("united kingdom") ||
    address.includes("australia")
  );
}

function googleMapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function googleMapsDirectionsUrl(query) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

function assessmentSnapshot() {
  return {
    categoryId: state.categoryId,
    selectedSymptoms: [...state.selectedSymptoms],
    selectedQuestions: [...state.selectedQuestions],
    severity: severity.value,
    onset: byId("onset").value,
    ageGroup: byId("ageGroup").value,
    location: byId("location").value,
    budget: byId("budget").value,
    distancePreference: distancePreference.value,
    mapsApiKey: mapsApiKey.value,
    symptomText: symptomInput.value,
  };
}

function providerTier(provider) {
  if (provider.level === "emergency" && provider.costHigh >= 80000) return "Corporate tertiary hospital";
  if (provider.level === "emergency") return "Emergency hospital";
  if (provider.level === "soon") return "Specialist OPD / urgent care";
  if (provider.costLow <= 500) return "Budget clinic";
  return "Clinic / general physician";
}

function restoreSnapshot() {
  const raw = localStorage.getItem("carematch:lastAssessment");
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    state.categoryId = saved.categoryId || "neuro";
    state.selectedSymptoms = new Set(saved.selectedSymptoms || []);
    state.selectedQuestions = new Set(saved.selectedQuestions || []);
    severity.value = saved.severity || "4";
    severityValue.textContent = severity.value;
    byId("onset").value = saved.onset || "days";
    byId("ageGroup").value = saved.ageGroup || "adult";
    setSearchLocation(saved.location || "near me");
    byId("budget").value = saved.budget || "balanced";
    distancePreference.value = saved.distancePreference || "nearby";
    syncDistanceBar();
    mapsApiKey.value = saved.mapsApiKey || localStorage.getItem("carematch:mapsApiKey") || "";
    symptomInput.value = saved.symptomText || saved.notes || "";
    if (symptomInput.value) {
      analysisPanel.classList.remove("hidden");
      suggestedSymptomsField.classList.remove("hidden");
      dynamicQuestions.classList.remove("hidden");
    }
  } catch {
    localStorage.removeItem("carematch:lastAssessment");
  }
}

function wireEvents() {
  byId("analyzeBtn").addEventListener("click", async () => {
    const button = byId("analyzeBtn");
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Understanding symptoms...";
    let intake = null;
    try {
      intake = await fetchMedicalIntake(symptomInput.value.trim());
    } catch {
      intake = null;
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
    startGuidedQa(intake);
    showScreen("questions");
  });

  byId("backToSymptomsBtn").addEventListener("click", () => {
    showScreen("symptoms");
  });

  symptomInput.addEventListener("input", () => {
    if (symptomInput.value.trim().length >= 10 && analysisPanel.classList.contains("hidden")) {
      startGuidedQa();
    }
  });

  categoryReview.addEventListener("change", (event) => {
    state.categoryId = event.target.value;
    state.selectedSymptoms.clear();
    state.selectedQuestions.clear();
    renderGuidedQuestions();
  });

  symptomOptions.addEventListener("change", (event) => {
    if (event.target.name !== "symptom") return;
    event.target.checked ? state.selectedSymptoms.add(event.target.value) : state.selectedSymptoms.delete(event.target.value);
  });

  dynamicQuestions.addEventListener("change", (event) => {
    if (event.target.name !== "question") return;
    event.target.checked ? state.selectedQuestions.add(event.target.value) : state.selectedQuestions.delete(event.target.value);
  });

  severity.addEventListener("input", () => {
    severityValue.textContent = severity.value;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (analysisPanel.classList.contains("hidden")) {
      let intake = null;
      try {
        intake = await fetchMedicalIntake(symptomInput.value.trim());
      } catch {
        intake = null;
      }
      startGuidedQa(intake);
    }
    inferHiddenRoutingDefaults();
    renderResults(assess());
    showScreen("results");
  });

  sortProviders.addEventListener("change", () => {
    if (state.lastAssessment) renderResults(state.lastAssessment);
  });

  distancePreference.addEventListener("change", () => {
    syncDistanceBar();
    if (state.lastAssessment) renderResults(state.lastAssessment);
  });

  distanceRange.addEventListener("input", setDistancePreferenceFromBar);

  applyAddressBtn.addEventListener("click", applyManualAddress);

  addressInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    applyManualAddress();
  });

  addressInput.addEventListener("change", applyManualAddress);

  byId("useLocationBtn").addEventListener("click", () => {
    if (!navigator.geolocation) {
      setSearchLocation("near me");
      if (state.lastAssessment) renderResults(state.lastAssessment);
      return;
    }

    setSearchLocation("Detecting current location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);
        setSearchLocation(`Current location: ${lat}, ${lng}`);
        if (state.lastAssessment) renderResults(state.lastAssessment);
      },
      () => {
        setSearchLocation("near me");
        if (state.lastAssessment) renderResults(state.lastAssessment);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 600000 },
    );
  });

  byId("sampleNeuroBtn").addEventListener("click", () => {
    state.categoryId = "neuro";
    state.selectedSymptoms = new Set(["paralysis", "cramps", "mood"]);
    state.selectedQuestions = new Set(["oneSide"]);
    severity.value = "6";
    severityValue.textContent = "6";
    byId("onset").value = "hours";
    byId("ageGroup").value = "adult";
    byId("budget").value = "balanced";
    distancePreference.value = "nearby";
    syncDistanceBar();
    setSearchLocation("Ameerpet, Hyderabad");
    symptomInput.value = "Sudden slight paralysis, cramps, and mood swings.";
    renderCategories();
    renderGuidedQuestions();
    inferHiddenRoutingDefaults();
    renderResults(assess());
    showScreen("results");
  });

  byId("resetBtn").addEventListener("click", () => {
    localStorage.removeItem("carematch:lastAssessment");
    state.categoryId = "neuro";
    state.selectedSymptoms.clear();
    state.selectedQuestions.clear();
    form.reset();
    setSearchLocation("near me");
    severity.value = "4";
    severityValue.textContent = "4";
    distancePreference.value = "nearby";
    syncDistanceBar();
    renderCategories();
    symptomInput.value = "";
    analysisPanel.classList.add("hidden");
    suggestedSymptomsField.classList.add("hidden");
    dynamicQuestions.classList.add("hidden");
    results.classList.add("hidden");
    emptyState.classList.remove("hidden");
    showScreen("symptoms");
  });

  byId("printBtn").addEventListener("click", () => window.print());
}

restoreSnapshot();
mapsApiKey.value =
  mapsApiKey.value || window.CAREMATCH_CONFIG?.mapsApiKey || localStorage.getItem("carematch:mapsApiKey") || "";
syncDistanceBar();
renderCategories();
if (symptomInput.value) renderGuidedQuestions();
wireEvents();
