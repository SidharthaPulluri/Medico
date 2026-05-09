function createCareMatchTesterFeedbackForm() {
  const form = FormApp.create("CareMatch India Tester Feedback");
  form.setDescription(
    "CareMatch India is a non-diagnosis doctor-routing prototype. Please use fictional or minor symptom examples only. Do not enter private medical details."
  );
  form.setCollectEmail(false);
  form.setAllowResponseEdits(true);
  form.setConfirmationMessage("Thank you. Your feedback will be used to improve routing safety, provider ranking, and usability.");

  form.addTextItem()
    .setTitle("What symptom text did you enter?")
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("What language/style did you use?")
    .setChoiceValues(["English", "Telugu words in English letters", "Hindi words in English letters", "Mixed language", "Typos/misspellings", "Other"])
    .setRequired(true);

  form.addTextItem()
    .setTitle("What city, pincode, or address did you search near?")
    .setRequired(true);

  form.addTextItem()
    .setTitle("What doctor type did CareMatch recommend?")
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Did the recommended doctor type feel correct?")
    .setChoiceValues(["Yes", "No", "Unsure"])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("If the doctor type felt wrong, what did you expect instead?");

  form.addMultipleChoiceItem()
    .setTitle("Did the provider list show nearby options?")
    .setChoiceValues(["Yes", "No", "Somewhat", "I did not check"])
    .setRequired(true);

  form.addScaleItem()
    .setTitle("How trustworthy did the first provider result feel?")
    .setBounds(1, 5)
    .setLabels("Not trustworthy", "Very trustworthy")
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Was the disclaimer clear?")
    .setChoiceValues(["Yes", "No", "I did not notice it"])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("What felt confusing, unsafe, or scam-like?");

  form.addMultipleChoiceItem()
    .setTitle("Would you use this before deciding which doctor to visit?")
    .setChoiceValues(["Yes", "Maybe", "No"])
    .setRequired(true);

  form.addTextItem()
    .setTitle("Optional: your city");

  form.addMultipleChoiceItem()
    .setTitle("Optional: age range")
    .setChoiceValues(["Under 18", "18-24", "25-34", "35-44", "45-60", "60+"]);

  form.addParagraphTextItem()
    .setTitle("Any other feedback?");

  Logger.log("Edit URL: " + form.getEditUrl());
  Logger.log("Public form URL: " + form.getPublishedUrl());
}
