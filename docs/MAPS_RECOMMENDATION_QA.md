# Google Maps Recommendation QA

CareMatch should rank live provider cards by the user's route, location, and distance setting. The safest rule is:

- Closest: sort primarily by Google driving distance.
- Balanced: combine route fit, rating/reviews, open status, and distance.
- Wider area: allow better-rated/specialist options farther away.

## Current Live Checks

Run against the local app with Google Places mode enabled.

| Symptoms | Address | Expected route | Observed top result behavior |
| --- | --- | --- | --- |
| kadupu noppi loose motions vomiting | 504272 | Gastroenterology | Geocoded to Dwarakapur, Telangana 504272. Closest result was a government hospital at 9.3 km, followed by gastro/liver hospitals around 31 km. |
| tooth ace severe gum pain | Guntur Andhra Pradesh | Dentist | Returned dentists first, starting with Suraksha Dental Clinic at 0.1 km. |
| ear pain fever blocked ear | Ameerpet Hyderabad | ENT | Returned ENT route with closest-first driving distance ordering after tightening the tie-break. |

## What Changed

- Typed address/pincode is geocoded before provider search.
- Live search is biased around the geocoded coordinate with a radius from the distance bar.
- Results use Google Distance Matrix driving distance when available.
- Closest mode now uses strict distance ordering except for near-identical distances.
- Provider cards show distance as a visible tag.
- Place IDs are preserved in Google Maps links.
- Ranking now scores specialty match, place type, open status, rating, and review count.
- Strong local symptom rules cannot be overwritten by a vague General Medicine LLM fallback.

## Manual QA Matrix

Use these before sharing the site with testers:

| Route | Symptoms | Location |
| --- | --- | --- |
| Dentist | tooth ace gum swelling | Guntur Andhra Pradesh |
| ENT | ear pain fever blocked ear | Ameerpet Hyderabad |
| Gastroenterology | kadupu noppi loose motions vomiting | 504272 |
| Pulmonology | dry cough fever wheezing | Madhapur Hyderabad |
| Orthopedics | lower back pain cannot bend cannot walk | Vijayawada |
| General Physician | fever body pains weakness | 500072 |

For each case, check:

- Specialty route is reasonable.
- Closest mode is monotonically distance-ordered.
- Balanced mode does not choose an obviously bad far result.
- Open Google Maps opens the exact place.
- Directions uses the exact place, not just a text search.
- The result never implies diagnosis or guaranteed availability.
