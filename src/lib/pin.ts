// Lightweight, dependency-free PIN hashing. This is NOT bank-grade
// security — it exists only to keep a 5-year-old out of the parent
// dashboard on a shared family device, not to protect sensitive data.
export function hashPin(pin: string): string {
  let hash = 5381
  for (let i = 0; i < pin.length; i++) {
    hash = (hash * 33) ^ pin.charCodeAt(i)
  }
  return (hash >>> 0).toString(16)
}

export function verifyPin(pin: string, hash: string | null): boolean {
  if (!hash) return true // no PIN set yet — allow access, prompt to create one
  return hashPin(pin) === hash
}
