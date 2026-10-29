import { createSeedData } from '@/data/seed'
import type { WorkspaceData } from '@/types'

const DATA_KEY = 'kanbo-data-v14'
const SESSION_KEY = 'kanbo-session'

export function loadData(): WorkspaceData {
  try {
    const saved = localStorage.getItem(DATA_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    localStorage.removeItem(DATA_KEY)
  }
  return createSeedData()
}

export function saveData(data: WorkspaceData) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data))
}

export function loadSession() {
  return localStorage.getItem(SESSION_KEY)
}

export function saveSession(userId: string | null) {
  if (userId) {
    localStorage.setItem(SESSION_KEY, userId)
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}
