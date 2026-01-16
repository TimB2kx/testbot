const N8N_WEBHOOK_URL = '/api/chat'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatRequest {
  sessionId: string
  message: string
}

export interface ChatResponse {
  response: string
  sessionId: string
}

export async function sendMessage(sessionId: string, message: string): Promise<string> {
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      message,
    } as ChatRequest),
  })

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`)
  }

  const data = await response.json() as ChatResponse
  return data.response
}

export function getOrCreateSessionId(): string {
  const storageKey = 'frau-sonnenschein-session-id'
  let sessionId = localStorage.getItem(storageKey)

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(storageKey, sessionId)
  }

  return sessionId
}

export function clearSession(): void {
  localStorage.removeItem('frau-sonnenschein-session-id')
}

// User Profile
export interface UserProfile {
  name: string
  gender: 'male' | 'female'
}

const PROFILE_STORAGE_KEY = 'frau-sonnenschein-profile'

export function getUserProfile(): UserProfile | null {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as UserProfile
  } catch {
    return null
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

export function clearUserProfile(): void {
  localStorage.removeItem(PROFILE_STORAGE_KEY)
}
