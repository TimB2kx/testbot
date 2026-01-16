import { useState } from 'react'
import { PasswordGate } from '@/components/PasswordGate'
import { Onboarding } from '@/components/Onboarding'
import { ChatWindow } from '@/components/ChatWindow'
import { getUserProfile, UserProfile } from '@/lib/api'

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(getUserProfile)

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile)
  }

  return (
    <PasswordGate>
      {userProfile ? (
        <ChatWindow userProfile={userProfile} />
      ) : (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
    </PasswordGate>
  )
}

export default App
