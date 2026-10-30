/**
 * Text-to-Audio (TTS) Feature Barrel & Convenience Pipeline.
 * Exports validation, language detection, and speech synthesis functions.
 */
import { synthesizeSpeech, TtsLanguage, VoiceGender, VOICE_MAP } from "./tts.js";
import {
  validateTextInput,
  SupportedLanguage,
  ValidationResult,
  DEFAULT_MAX_TEXT_LENGTH,
} from "./validator.js";

export {
  synthesizeSpeech,
  VOICE_MAP,
  validateTextInput,
  DEFAULT_MAX_TEXT_LENGTH,
  type TtsLanguage,
  type VoiceGender,
  type SupportedLanguage,
  type ValidationResult,
};

export interface TextToAudioResult {
  audioBuffer: Buffer;
  language: SupportedLanguage;
  gender: VoiceGender;
}

/**
 * End-to-end helper: validates input text, auto-detects language ('en' | 'fa'),
 * and synthesizes an MP3 audio Buffer. Throws an Error if validation fails.
 */
export async function convertTextToAudio(
  text: string,
  gender: VoiceGender = "male",
  maxTextLength: number = DEFAULT_MAX_TEXT_LENGTH
): Promise<TextToAudioResult> {
  const validation = validateTextInput(text, maxTextLength);
  if (!validation.isValid || !validation.language) {
    throw new Error(validation.error || "Invalid text input.");
  }

  const audioBuffer = await synthesizeSpeech(text, validation.language, gender);
  return {
    audioBuffer,
    language: validation.language,
    gender,
  };
}

