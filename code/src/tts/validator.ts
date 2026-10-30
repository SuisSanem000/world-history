/**
 * Input Validation & Language Detection Module.
 * Validates user text input (English & Persian) and detects language prior to TTS synthesis.
 */

export type SupportedLanguage = "en" | "fa";

export interface ValidationResult {
  isValid: boolean;
  language?: SupportedLanguage;
  error?: string;
}

export const DEFAULT_MAX_TEXT_LENGTH = 1000;

// Unicode regex for Persian/Arabic letters (including Persian specific: گ چ پ ژ ی)
const PERSIAN_REGEX = /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u06CC]/;
const ENGLISH_REGEX = /[a-zA-Z]/;

/**
 * Validates incoming text to ensure it is suitable for English or Persian TTS.
 *
 * @param text The input string to validate
 * @param maxTextLength Maximum allowed character length (defaults to 1000)
 * @returns ValidationResult with isValid status, detected language, and error message if invalid
 */
export function validateTextInput(
  text: string | undefined,
  maxTextLength: number = DEFAULT_MAX_TEXT_LENGTH
): ValidationResult {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      error: "⚠️ Please provide a non-empty text.\n⚠️ لطفاً یک متن غیر خالی وارد کنید.",
    };
  }

  const trimmed = text.trim();

  // Length check (max characters allowed)
  if (trimmed.length > maxTextLength) {
    return {
      isValid: false,
      error:
        `⚠️ Text too long. Maximum allowed length is ${maxTextLength} characters (received ${trimmed.length} characters).\n` +
        `⚠️ متن بیش از حد طولانی است. حداکثر طول مجاز ${maxTextLength} کاراکتر است.`,
    };
  }

  const hasPersian = PERSIAN_REGEX.test(trimmed);
  const hasEnglish = ENGLISH_REGEX.test(trimmed);

  // Check if text has neither English nor Persian (e.g. only emojis, symbols, numbers)
  if (!hasPersian && !hasEnglish) {
    return {
      isValid: false,
      error:
        "⚠️ Only English and Persian (فارسی) text is supported.\n" +
        "⚠️ فقط متون انگلیسی و فارسی پشتیبانی می‌شوند.",
    };
  }

  // If both or Persian detected, prioritize Persian if Persian characters exist
  const language: SupportedLanguage = hasPersian ? "fa" : "en";

  return {
    isValid: true,
    language,
  };
}

