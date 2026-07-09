import { useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'
import { speak, stopSpeaking } from '../lib/speech'

/** Returns a function that speaks `text` immediately, respecting the
 * parent-controlled Narration setting. Use inside event handlers (e.g. a
 * "🔊 read to me" replay button). */
export function useSpeakOnDemand() {
  const narrationOn = useGameStore((s) => s.settings.narrationOn)
  return (text: string) => {
    if (narrationOn) speak(text)
  }
}

/** Automatically speaks `text` whenever it changes, respecting the
 * Narration setting. Cleans up (stops speech) on unmount / change. */
export function useAutoNarrate(text: string | null | undefined) {
  const narrationOn = useGameStore((s) => s.settings.narrationOn)
  useEffect(() => {
    if (narrationOn && text) speak(text)
    return () => stopSpeaking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, narrationOn])
}
