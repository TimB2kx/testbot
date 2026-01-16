import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface MessageInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = message.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t-2 border-amber-200 bg-white/80 backdrop-blur p-4"
    >
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Schreibe eine Nachricht... ✏️"
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-2xl border-2 border-amber-300 bg-white px-5 py-4 text-base shadow-sm placeholder:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:border-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={disabled || !message.trim()}
          className="h-14 w-14 rounded-2xl shrink-0 bg-amber-500 hover:bg-amber-600 text-white shadow-md"
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>
      <p className="text-sm text-amber-600 text-center mt-3">
        Drücke Enter zum Senden 📨
      </p>
    </form>
  )
}
