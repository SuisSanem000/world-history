# Text-to-Audio (TTS) Technical Architecture

> Concise, accurate reference for the AI Assistant explaining how the Text-to-Speech pipeline works and how to adapt it in the new project.

---

## 1. Pipeline Architecture

```
Raw Text Input (English 🇬🇧 or Persian 🇮🇷)
        │
        ▼
┌────────────────────────────────────────────────────────┐
│ 1. Input Validator & Language Detector (src/validator.ts) │
│    - Trims & rejects empty / whitespace-only strings   │
│    - Enforces max length (default: 1000 characters)    │
│    - Rejects symbol/emoji-only inputs                  │
│    - Auto-detects Persian ('fa') vs English ('en')     │
└──────────────────────────┬─────────────────────────────┘
                           │ { isValid: true, language: 'en' | 'fa' }
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. Dual-Engine Speech Synthesizer (src/tts.ts)         │
│    - Primary: Microsoft Edge Neural TTS (node-edge-tts)│
│      • Generates temporary MP3 in ./temp               │
│      • Reads into memory Buffer & immediately unlinks  │
│    - Fallback: Google Translate TTS (google-tts-api)   │
│      • Triggered automatically if Edge TTS fails       │
│      • <= 200 chars: getAudioBase64()                  │
│      • > 200 chars: getAllAudioBase64() + concat       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
             MP3 Audio Buffer (Promise<Buffer>)
```

---

## 2. Neural Voice Matrix (`src/tts.ts`)

`VOICE_MAP` maps each `(language, gender)` pair to a Microsoft Edge Neural Voice identifier:

| Language | Code | Male Voice ID | Female Voice ID |
| :--- | :--- | :--- | :--- |
| **English (US)** | `en` | `en-US-GuyNeural` | `en-US-JennyNeural` |
| **Persian (Farsi)** | `fa` | `fa-IR-FaridNeural` | `fa-IR-DilaraNeural` |

### How to Add More Languages or Voices
To support additional languages (e.g., Arabic, Spanish, French, German, Turkish):
1. Extend `TtsLanguage` in `src/tts.ts` and `SupportedLanguage` in `src/validator.ts`.
2. Add the corresponding Microsoft Edge Neural Voice IDs to `VOICE_MAP` in `src/tts.ts`.
3. Add character range detection in `src/validator.ts`.

---

## 3. Key Implementation Details & Edge Cases

1. **Why Intermediate Temp Files (`./temp`) Are Used**:
   - `node-edge-tts` (`tts.ttsPromise(text, filePath)`) streams audio from Edge's WebSocket service directly to a file path on disk.
   - `synthesizeSpeech()` generates a collision-free filename (`tts_${Date.now()}_${crypto.randomBytes(4).toString("hex")}.mp3`), reads the file into a Node `Buffer`, and immediately deletes the file (`fs.unlink(tempFilePath).catch(() => {})`) in both success and error paths.
   - **Serverless / Read-Only Filesystem Note**: If the new project runs on AWS Lambda, Vercel Serverless, or read-only containers, change `const TEMP_DIR = path.resolve("./temp")` in `src/tts.ts` to `os.tmpdir()`.

2. **Why Google TTS Fallback Splits at 200 Characters**:
   - Google Translate's free TTS endpoint limits single requests to 200 characters.
   - For strings $\le 200$ chars, `googleTTS.getAudioBase64()` is used (single request).
   - For strings $> 200$ chars, `googleTTS.getAllAudioBase64()` splits text on punctuation (`" ,.?!;\n"`), fetches base64 chunks, and merges them via `Buffer.concat(buffers)`.
   - *Note*: Google TTS fallback does not support male/female voice toggling (returns standard voice for `lang`), whereas the primary Edge TTS engine supports full Male/Female neural voices.

3. **Language Detection Priority (`src/validator.ts`)**:
   - Persian characters are matched via `/[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u06CC]/`.
   - English characters are matched via `/[a-zA-Z]/`.
   - If a string contains both Persian and English words, `language` resolves to `"fa"` because Persian neural voices (`fa-IR-FaridNeural` / `fa-IR-DilaraNeural`) naturally pronounce embedded English words, whereas English voices cannot pronounce Persian script.

