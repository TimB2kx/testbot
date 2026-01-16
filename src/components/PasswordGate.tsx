import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

const CORRECT_PASSWORD = '!Ds121212'
const AUTH_STORAGE_KEY = 'frau-sonnenschein-authenticated'

interface PasswordGateProps {
  children: React.ReactNode
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  })
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate brief delay for UX
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true')
        setIsAuthenticated(true)
      } else {
        setError('Falsches Passwort 🔒')
        setPassword('')
      }
      setIsLoading(false)
    }, 300)
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md border-2 border-amber-200 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-lg">
            <span className="text-4xl">🌻</span>
          </div>
          <CardTitle className="text-2xl text-amber-800">Frau Sonnenschein</CardTitle>
          <CardDescription className="text-base text-amber-600">
            Bitte gib das Passwort ein, um fortzufahren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="🔑 Passwort eingeben..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`h-14 text-lg text-center rounded-xl border-2 ${
                  error ? 'border-red-400' : 'border-amber-300'
                } focus:border-amber-500`}
                disabled={isLoading}
                autoFocus
              />
              {error && (
                <div className="flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg py-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-14 text-lg rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md"
              disabled={isLoading || !password}
            >
              {isLoading ? '⏳ Prüfe...' : '🚀 Los geht\'s!'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
