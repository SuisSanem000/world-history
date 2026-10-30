/**
 * Text-to-Speech (TTS) Engine Module.
 * Converts validated English and Persian text into natural spoken MP3 audio buffers
 * supporting both Male and Female neural voices using 100% free Edge TTS (with Google TTS fallback).
 */
import { EdgeTTS } from "node-edge-tts";
import * as googleTTS from "google-tts-api";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export type VoiceGender = "male" | "female";
export type TtsLanguage = "en" | "fa";

// Map language & gender to high-quality Microsoft Edge neural voices
export const VOICE_MAP: Record<TtsLanguage, Record<VoiceGender, string>> = {
  en: {
    male: "en-US-GuyNeural",
    female: "en-US-JennyNeural",
  },
  fa: {
    male: "fa-IR-FaridNeural",
    female: "fa-IR-DilaraNeural",
  },
};

const TEMP_DIR = path.resolve("./temp");

/**
 * Ensures the temporary directory exists for intermediate audio file generation.
 */
async function ensureTempDir(): Promise<void> {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch {
    // Directory already exists or created
  }
}

/**
 * Synthesizes speech from English or Persian text and returns an MP3 audio Buffer.
 *
 * @param text The text to synthesize
 * @param language 'en' (English) or 'fa' (Persian)
 * @param gender 'male' or 'female' voice
 * @returns Promise<Buffer> MP3 audio buffer
 */
export async function synthesizeSpeech(
  text: string,
  language: TtsLanguage = "en",
  gender: VoiceGender = "male"
): Promise<Buffer> {
  const trimmed = text.trim();
  const voice = VOICE_MAP[language]?.[gender] || VOICE_MAP.en.male;

  await ensureTempDir();
  const tempFileName = `tts_${Date.now()}_${crypto.randomBytes(4).toString("hex")}.mp3`;
  const tempFilePath = path.join(TEMP_DIR, tempFileName);

  try {
    // Primary Engine: Microsoft Edge TTS Neural Voice
    const tts = new EdgeTTS({ voice });
    await tts.ttsPromise(trimmed, tempFilePath);

    const buffer = await fs.readFile(tempFilePath);

    // Clean up temporary file
    await fs.unlink(tempFilePath).catch(() => {});

    return buffer;
  } catch (edgeError) {
    console.warn("Edge TTS failed, falling back to Google TTS API:", edgeError);

    // Clean up any leftover file
    await fs.unlink(tempFilePath).catch(() => {});

    // Fallback Engine: Google TTS API
    if (trimmed.length <= 200) {
      const base64Audio = await googleTTS.getAudioBase64(trimmed, {
        lang: language,
        slow: false,
        host: "https://translate.google.com",
        timeout: 10000,
      });
      return Buffer.from(base64Audio, "base64");
    }

    const audioChunks = await googleTTS.getAllAudioBase64(trimmed, {
      lang: language,
      slow: false,
      host: "https://translate.google.com",
      timeout: 15000,
      splitPunct: " ,.?!;\n",
    });

    const buffers = audioChunks.map((chunk) =>
      Buffer.from(chunk.base64, "base64")
    );

    return Buffer.concat(buffers);
  }
}

