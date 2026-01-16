import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserProfile, saveUserProfile } from '@/lib/api'

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState('')
  const [, setGender] = useState<'male' | 'female' | null>(null)
  const [step, setStep] = useState<'name' | 'gender'>('name')

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setStep('gender')
    }
  }

  const handleGenderSelect = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender)
    const profile: UserProfile = {
      name: name.trim(),
      gender: selectedGender
    }
    saveUserProfile(profile)
    onComplete(profile)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md border-2 border-amber-200 shadow-xl">
        <CardHeader className="text-center pb-2">
          {/* Frau Sonnenschein Avatar */}
          <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-lg">
            <span className="text-5xl">🌻</span>
          </div>
          <CardTitle className="text-2xl text-amber-800">
            Hallo! Ich bin Frau Sonnenschein
          </CardTitle>
          <CardDescription className="text-base text-amber-700">
            {step === 'name'
              ? 'Wie heißt du denn?'
              : `Schön dich kennenzulernen, ${name}!`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {step === 'name' ? (
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <Input
                type="text"
                placeholder="Dein Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg h-14 text-center border-2 border-amber-300 focus:border-amber-500 rounded-xl"
                autoFocus
                maxLength={30}
              />
              <Button
                type="submit"
                className="w-full h-14 text-lg rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                disabled={!name.trim()}
              >
                Weiter 👋
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-amber-700 text-lg mb-6">
                Bist du ein Junge oder ein Mädchen?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleGenderSelect('male')}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-3 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-6xl">👦</span>
                  <span className="text-lg font-semibold text-blue-700">Junge</span>
                </button>
                <button
                  onClick={() => handleGenderSelect('female')}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-3 border-pink-300 bg-pink-50 hover:bg-pink-100 hover:border-pink-400 transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-6xl">👧</span>
                  <span className="text-lg font-semibold text-pink-700">Mädchen</span>
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
