import './App.css'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { AuthProvider } from './context/AuthProvider'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </AppErrorBoundary>
  )
}

export default App
