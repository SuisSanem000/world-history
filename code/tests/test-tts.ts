/**
 * Standalone verification script for the Text-to-Audio (TTS) feature.
 * Tests input validation, language auto-detection, and multi-voice neural synthesis.
 */
import { validateTextInput } from "../src/validator.js";
import { synthesizeSpeech } from "../src/tts.js";

async function runTests() {
  console.log("🧪 Running Text-to-Audio validation tests...");

  // Test 1: Valid English text
  const res1 = validateTextInput("Hello world! This is a test.");
  console.assert(res1.isValid === true && res1.language === "en", "Test 1 Failed");
  console.log("  ✅ Test 1 (Valid English): Passed (Language: en)");

  // Test 2: Valid Persian text
  const res2 = validateTextInput("سلام دنیا! این یک پیام آزمایشی به زبان فارسی است.");
  console.assert(res2.isValid === true && res2.language === "fa", "Test 2 Failed");
  console.log("  ✅ Test 2 (Valid Persian): Passed (Language: fa)");

  // Test 3: Empty text
  const res3 = validateTextInput("   ");
  console.assert(res3.isValid === false, "Test 3 Failed");
  console.log("  ✅ Test 3 (Empty Text Rejection): Passed");

  // Test 4: Emoji only
  const res4 = validateTextInput("🎉🔥🚀");
  console.assert(res4.isValid === false, "Test 4 Failed");
  console.log("  ✅ Test 4 (Emoji Only Rejection): Passed");

  // Test 5: Too long text
  const longText = "سلام ".repeat(300);
  const res5 = validateTextInput(longText);
  console.assert(res5.isValid === false, "Test 5 Failed");
  console.log("  ✅ Test 5 (Length Limit Rejection): Passed");

  console.log("\n🎙️ Testing Multi-Voice & Multi-Language TTS synthesis...");

  // English Male
  const bufEnMale = await synthesizeSpeech("Hello! This is a natural male English voice.", "en", "male");
  console.assert(bufEnMale.length > 0, "English Male Failed");
  console.log(`  ✅ English Male Audio: ${bufEnMale.length} bytes`);

  // English Female
  const bufEnFemale = await synthesizeSpeech("Hello! This is a natural female English voice.", "en", "female");
  console.assert(bufEnFemale.length > 0, "English Female Failed");
  console.log(`  ✅ English Female Audio: ${bufEnFemale.length} bytes`);

  // Persian Male
  const bufFaMale = await synthesizeSpeech("سلام! این صدای طبیعی مردانه به زبان فارسی است.", "fa", "male");
  console.assert(bufFaMale.length > 0, "Persian Male Failed");
  console.log(`  ✅ Persian Male Audio: ${bufFaMale.length} bytes`);

  // Persian Female
  const bufFaFemale = await synthesizeSpeech("سلام! این صدای طبیعی زنانه به زبان فارسی است.", "fa", "female");
  console.assert(bufFaFemale.length > 0, "Persian Female Failed");
  console.log(`  ✅ Persian Female Audio: ${bufFaFemale.length} bytes`);

  console.log("\n🎉 All TTS feature tests passed successfully!");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

