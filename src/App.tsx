import AppRoutes from './routes/AppRoutes'
import ErrorBoundary from './components/ErrorBoundary'
import OfflineBanner from './components/OfflineBanner'

function App() {
  return (
    <ErrorBoundary>
      <OfflineBanner />
      <div className="app-container">
        <AppRoutes />
      </div>
    </ErrorBoundary>
  )
}

export default App
