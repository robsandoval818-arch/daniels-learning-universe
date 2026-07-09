// ─────────────────────────────────────────────────────────────────────────
// READ-ALOUD NARRATION
// A thin wrapper around the browser's built-in Web Speech API. No audio
// files, no third-party service, no network call — works offline and
// costs nothing. Designed for a pre/early reader: slightly slower rate,
// slightly warmer pitch, and it always cancels any in-flight speech before
// starting new speech so lines never pile up or overlap.
// ─────────────────────────────────────────────────────────────────────────

let cachedVoice: SpeechSynthesisVoice | null | undefined

function pickVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null
  if (cachedVoice !== undefined) return cachedVoice

  const voices = window.speechSynthesis.getVoices()
  const preferred =
    voices.find((v) => v.lang.startsWith('en') && /samantha|female|google us english/i.test(v.name)) ??
    voices.find((v) => v.lang.startsWith('en')) ??
    voices[0] ??
    null

  cachedVoice = preferred
  return preferred
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

if (isSpeechSupported()) {
  // Voice list loads asynchronously in some browsers — refresh our cached
  // pick once it's actually populated.
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = undefined
  }
}

export function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (!isSpeechSupported() || !text.trim()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = opts?.rate ?? 0.92
  utterance.pitch = opts?.pitch ?? 1.05
  const voice = pickVoice()
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}
