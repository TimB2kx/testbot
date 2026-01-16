import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/lib/api'
import { Bot, User } from 'lucide-react'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading?: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <Bot className="h-12 w-12 mx-auto opacity-50" />
          <p>Starte eine Unterhaltung!</p>
          <p className="text-sm">Der Bot erinnert sich an den Kontext.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            'flex gap-3 max-w-[85%]',
            message.role === 'user' ? 'ml-auto flex-row-reverse' : ''
          )}
        >
          <div
            className={cn(
              'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            )}
          >
            {message.role === 'user' ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </div>
          <div
            className={cn(
              'rounded-2xl px-4 py-2 text-sm',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                : 'bg-muted rounded-tl-sm'
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            <time className={cn(
              'text-xs mt-1 block',
              message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}>
              {message.timestamp.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3 max-w-[85%]">
          <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-muted">
            <Bot className="h-4 w-4" />
          </div>
          <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-muted">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
