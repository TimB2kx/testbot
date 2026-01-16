import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ChatMessage, UserProfile } from '@/lib/api'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading?: boolean
  userProfile: UserProfile
}

export function MessageList({ messages, isLoading, userProfile }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-amber-700">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-lg">
            <span className="text-4xl">🌻</span>
          </div>
          <p className="text-xl font-medium">Hallo {userProfile.name}! 👋</p>
          <p className="text-lg text-amber-600">
            Schreib mir eine Nachricht und ich helfe dir gerne!
          </p>
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
          {/* Avatar */}
          <div
            className={cn(
              'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-2xl shadow-md',
              message.role === 'user'
                ? userProfile.gender === 'female'
                  ? 'bg-gradient-to-br from-pink-200 to-pink-300'
                  : 'bg-gradient-to-br from-blue-200 to-blue-300'
                : 'bg-gradient-to-br from-yellow-300 to-orange-400'
            )}
          >
            {message.role === 'user' ? (
              userProfile.gender === 'female' ? '👧' : '👦'
            ) : (
              '🌻'
            )}
          </div>

          {/* Message bubble */}
          <div className="flex flex-col gap-1">
            {/* Name label */}
            <span className={cn(
              'text-xs font-medium px-1',
              message.role === 'user' ? 'text-right text-amber-600' : 'text-amber-700'
            )}>
              {message.role === 'user' ? userProfile.name : 'Frau Sonnenschein'}
            </span>

            <div
              className={cn(
                'rounded-2xl px-4 py-3 text-base shadow-sm',
                message.role === 'user'
                  ? userProfile.gender === 'female'
                    ? 'bg-gradient-to-br from-pink-400 to-pink-500 text-white rounded-tr-sm'
                    : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-tr-sm'
                  : 'bg-white border-2 border-amber-200 text-amber-900 rounded-tl-sm'
              )}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <time className={cn(
                'text-xs mt-2 block opacity-70',
                message.role === 'user' ? 'text-white' : 'text-amber-600'
              )}>
                {message.timestamp.toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex gap-3 max-w-[85%]">
          <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-300 to-orange-400 text-2xl shadow-md">
            🌻
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium px-1 text-amber-700">
              Frau Sonnenschein
            </span>
            <div className="rounded-2xl rounded-tl-sm px-4 py-4 bg-white border-2 border-amber-200 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
