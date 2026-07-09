import type { StateStorage } from 'zustand/middleware'

// Some browsers (notably iOS Safari with "Block All Cookies" enabled, or
// Private/Lockdown modes) throw synchronously when localStorage is touched
// at all — even just to check availability. If zustand's persist middleware
// hits that during store creation, the whole React tree fails to mount and
// the user sees a blank white screen with no visible error.
//
// This wrapper probes localStorage once, and falls back to an in-memory
// store (progress just won't survive a reload) if it's unavailable, so the
// game always renders no matter how locked-down the device is.

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__dlu_storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

function createMemoryStorage(): StateStorage {
  const mem = new Map<string, string>()
  return {
    getItem: (name) => mem.get(name) ?? null,
    setItem: (name, value) => {
      mem.set(name, value)
    },
    removeItem: (name) => {
      mem.delete(name)
    },
  }
}

function createLocalStorageWrapper(): StateStorage {
  return {
    getItem: (name) => {
      try {
        return window.localStorage.getItem(name)
      } catch {
        return null
      }
    },
    setItem: (name, value) => {
      try {
        window.localStorage.setItem(name, value)
      } catch {
        // Silently ignore — progress just won't persist this session.
      }
    },
    removeItem: (name) => {
      try {
        window.localStorage.removeItem(name)
      } catch {
        // ignore
      }
    },
  }
}

export const safeStorage: StateStorage = isLocalStorageAvailable()
  ? createLocalStorageWrapper()
  : createMemoryStorage()
