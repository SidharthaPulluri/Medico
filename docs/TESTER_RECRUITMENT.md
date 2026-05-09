# Tester Recruitment Plan

Goal: get realistic Indian users to try CareMatch, enter messy symptom text, search around their own area, and report whether the doctor route and provider cards feel trustworthy.

## Who To Recruit

Start with 30 testers:

- 15 general users in India, mixed age and language comfort.
- 5 parents or caregivers.
- 5 people from tier-2/tier-3 cities.
- 3 clinicians or medical students for safety review.
- 2 product/UX testers for usability.

Do not ask testers to enter private medical history. Ask them to use fictional or recent minor symptoms only.

## Channels

Fast paid/user-testing channels:

- MyFirstUser: startup-focused user tests with structured feedback.
- Voturn: peer feedback and tester community.
- Trymata, Userfeel, Userbrain, BetaTesting, Beta Family: broader usability panels.
- Oprimes: India/Asia human-in-the-loop testing option.

Free or low-cost channels:

- r/StartUpIndia: ask for product feedback with a clear disclaimer.
- Indian student founder/tech WhatsApp and Discord groups.
- Local colleges: pharmacy, nursing, physiotherapy, medical students for safety feedback.
- Family/friends-of-friends in different Indian cities, especially people who are not fluent in English.
- Health communities such as HealthCircle only if the post is framed as usability feedback, not medical advice.

## Screening Message

CareMatch is a prototype that helps people decide what type of doctor to visit for non-emergency symptoms. It is not a diagnosis app. We need testers in India to try messy symptom inputs, local language written in English, and nearby doctor search.

You will be asked to:

- Enter 3 fictional or minor symptom examples.
- Try your city/pincode/address.
- Check whether the recommended specialty and provider list feel useful.
- Submit a 3-minute feedback form.

Please do not enter sensitive personal medical details.

## Feedback Form Questions

1. What symptom text did you enter?
2. What language/style did you use? Example: English, Telugu in English letters, Hindi in English letters, typos.
3. What city/pincode/address did you search near?
4. Which doctor type did CareMatch recommend?
5. Did that recommendation feel correct? Yes / No / Unsure.
6. If wrong, what doctor would you expect?
7. Did the provider list show nearby options?
8. Did the first result feel trustworthy?
9. Did you understand the disclaimer?
10. What felt confusing or scam-like?
11. Would you use this before booking a doctor appointment?
12. Optional: age range, city, phone language preference.

## Outreach Post

I’m building CareMatch India, a non-diagnosis care-routing prototype. You type symptoms in normal messy language, including typos or Indian language words written in English, and it suggests what kind of doctor to visit plus nearby options.

I need honest testers, especially from India. Please do not enter private medical details. Use fictional/minor examples like “tooth pain gum swelling”, “kadupu noppi loose motions”, or “back pain cannot bend”.

Test link: [add live link]
Feedback form: [add form link]

I’m mainly checking:

- Did it understand your symptom wording?
- Did it choose the right doctor type?
- Were nearby provider results actually nearby?
- Did anything feel unsafe, confusing, or untrustworthy?

## Success Criteria

Before calling the routing usable:

- At least 100 submitted symptom tests.
- At least 80% of users say the specialty route is correct or reasonable.
- At least 90% say the disclaimer is clear.
- Fewer than 5% report a scary/urgent symptom being routed as routine.
- At least 20 tests include Indian language written in English letters.
- At least 20 tests are from outside Hyderabad/Bengaluru/Mumbai/Delhi.

## Review Cadence

Run this loop weekly:

1. Export feedback into CSV.
2. Tag failures as symptom understanding, specialty route, severity, provider distance, UI trust, or copy.
3. Add the failed symptom text to `tests/manual_cases_template.csv`.
4. Re-run benchmark and focused live Maps QA.
5. Ship only changes that keep emergency recall at 100%.
