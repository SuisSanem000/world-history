# AI Agent Guidelines — Text-to-Audio (TTS) Feature Handoff

> **Coordinator Router (<100 lines)**: Instructions for the AI Assistant in the new project to adopt and integrate this proven, 100% free Text-to-Speech (TTS) implementation.

## 1. Feature Overview
A framework-agnostic TypeScript module that converts **English (`en`)** and **Persian (`fa`)** text into natural spoken **MP3 `Buffer`s** using **100% free** engines (zero API keys, zero cost):
- **Primary Engine**: Microsoft Edge Neural TTS (`node-edge-tts`) supporting Male & Female neural voices.
- **Fallback Engine**: Google Translate TTS (`google-tts-api`) with automatic chunking for texts $> 200$ chars.

## 2. Source of Truth Files
- **TTS Synthesis Engine**: `src/tts.ts` (`synthesizeSpeech`, `VOICE_MAP`, `TtsLanguage`, `VoiceGender`)
- **Validator & Language Detector**: `src/validator.ts` (`validateTextInput`, `DEFAULT_MAX_TEXT_LENGTH`)
- **Unified Entry / Helper**: `src/index.ts` (`convertTextToAudio` + barrel exports)
- **Verification Suite**: `tests/test-tts.ts` (Tests validation + all 4 voice combinations)
- **Technical Spec**: `docs/TTS_ARCHITECTURE.md` (Detailed pipeline, voice IDs, and edge cases)
- **Deployment Reference (Optional)**: `docs/DEPLOYMENT_SUGGESTION.md` (Advisory hosting & CI/CD approach for the AI to evaluate)

## 3. Quick Integration Steps for the AI Assistant
1. **Install Required Packages**:
   ```bash
   npm install node-edge-tts google-tts-api
   ```
2. **Copy Core Files**:
   Copy `src/tts.ts` and `src/validator.ts` (and optionally `src/index.ts`) into your new project's source directory.
3. **Use in Application Code**:
   ```ts
   import { validateTextInput, synthesizeSpeech } from "./tts-module/index.js";

   const check = validateTextInput(userInput); // Auto-detects 'en' or 'fa', max 1000 chars
   if (!check.isValid) throw new Error(check.error);

   // Returns a standard Node.js MP3 Buffer (ready for HTTP response, file save, WebSocket, etc.)
   const mp3Buffer = await synthesizeSpeech(userInput, check.language, "female");
   ```
4. **Ignore Temp Directory**:
   Add `temp/` to `.gitignore` (`node-edge-tts` writes brief intermediate `.mp3` files to `./temp` before unlinking them).

## 4. Golden Rules for Modifying or Extending
1. **100% Free Only**: Keep `node-edge-tts` as primary and `google-tts-api` as fallback; never introduce paid API keys.
2. **Validate Before Synthesizing**: Always run `validateTextInput()` prior to `synthesizeSpeech()` to reject empty, emoji-only, or oversized strings.
3. **Temp File Cleanup**: Always unlink intermediate files in `./temp` inside both `try` and `catch` blocks so disk space never leaks.
4. **Verify**: Run `npx tsc --noEmit` and `npx tsx tests/test-tts.ts` after integrating.

