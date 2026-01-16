import { PasswordGate } from '@/components/PasswordGate'
import { ChatWindow } from '@/components/ChatWindow'

function App() {
  return (
    <PasswordGate>
      <ChatWindow />
    </PasswordGate>
  )
}

export default App
