import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIX = 'agrilynx:v1:'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

/** localStorage-backed state that never throws (private mode, quota, corrupt JSON). */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial))
  const initialRef = useRef(initial)

  useEffect(() => {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      /* storage unavailable or full: keep working in memory */
    }
  }, [key, value])

  const reset = useCallback(() => setValue(initialRef.current), [])
  return [value, setValue, reset] as const
}
