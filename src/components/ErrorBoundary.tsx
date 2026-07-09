import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Daniel's Learning Universe crashed:", error, info)
  }

  handleReload = () => {
    try {
      window.localStorage.removeItem('dlu-progress-v1')
    } catch {
      // ignore — storage may be blocked, which is fine, we're reloading anyway
    }
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            background: '#0a0a12',
            color: '#fff',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</p>
          <h1 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            Oops, something bumped the spaceship!
          </h1>
          <p style={{ opacity: 0.65, marginBottom: '1.5rem', maxWidth: 380, lineHeight: 1.5 }}>
            Try reloading. If this keeps happening, check that Safari allows cookies/website data
            for this site (Settings → Safari → Advanced), since the game needs that to save progress.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '999px',
              background: '#facc15',
              color: '#1a1a1a',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
