import { useState, useCallback, useEffect } from 'react'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { ChatMessage, sendMessage, getOrCreateSessionId, clearSession } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Bot, RefreshCw, LogOut } from 'lucide-react'

export function ChatWindow() {
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
    localStorage.setItem('testbot-session-id', newSessionId)
    setSessionId(newSessionId)
    setMessages([])
    setError(null)
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('testbot-authenticated')
    localStorage.removeItem('testbot-session-id')
    window.location.reload()
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">STS Testbot</h1>
              <p className="text-xs text-muted-foreground">
                AI Assistant mit Gedächtnis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewSession}
              title="Neue Session starten"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Neu
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Abmelden"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2">
          <p className="text-sm text-destructive text-center max-w-4xl mx-auto">
            {error}
          </p>
        </div>
      )}

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={isLoading} />
    </div>
  )
}
