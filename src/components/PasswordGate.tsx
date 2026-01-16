import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, AlertCircle } from 'lucide-react'

const CORRECT_PASSWORD = '!Ds121212'
const AUTH_STORAGE_KEY = 'testbot-authenticated'

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
        setError('Falsches Passwort')
        setPassword('')
      }
      setIsLoading(false)
    }, 300)
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">STS Testbot</CardTitle>
          <CardDescription>
            Bitte gib das Passwort ein, um fortzufahren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? 'border-destructive' : ''}
                disabled={isLoading}
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !password}>
              {isLoading ? 'Prüfe...' : 'Entsperren'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
