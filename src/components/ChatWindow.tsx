import { useState, useCallback } from 'react'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { ChatMessage, UserProfile, sendMessage, getOrCreateSessionId, clearSession, clearUserProfile } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { RefreshCw, LogOut } from 'lucide-react'

interface ChatWindowProps {
  userProfile: UserProfile
}

export function ChatWindow({ userProfile }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(getOrCreateSessionId)
  const [error, setError] = useState<string | null>(null)

  const handleSend = useCallback(async (content: string) => {
    setError(null)

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await sendMessage(sessionId, content)

      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  const handleNewSession = useCallback(() => {
    clearSession()
    const newSessionId = crypto.randomUUID()
    localStorage.setItem('frau-sonnenschein-session-id', newSessionId)
    setSessionId(newSessionId)
    setMessages([])
    setError(null)
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('frau-sonnenschein-authenticated')
    localStorage.removeItem('frau-sonnenschein-session-id')
    clearUserProfile()
    window.location.reload()
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="border-b-2 border-amber-200 bg-white/80 backdrop-blur shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-md">
              <span className="text-2xl">🌻</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-amber-800">Frau Sonnenschein</h1>
              <p className="text-sm text-amber-600">
                Deine freundliche Lernhelferin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleNewSession}
              title="Neue Unterhaltung"
              className="h-12 px-4 text-amber-700 hover:bg-amber-100 hover:text-amber-800 rounded-xl"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Neu</span>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleLogout}
              title="Abmelden"
              className="h-12 px-4 text-amber-700 hover:bg-amber-100 hover:text-amber-800 rounded-xl"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-100 border-b-2 border-red-200 px-4 py-3">
          <p className="text-sm text-red-700 text-center max-w-4xl mx-auto font-medium">
            😕 {error}
          </p>
        </div>
      )}

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} userProfile={userProfile} />

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={isLoading} />
    </div>
  )
}
