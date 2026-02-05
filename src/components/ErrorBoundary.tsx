import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you could send to error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            padding: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              textAlign: 'center',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-grid)',
              borderRadius: '16px',
              padding: '3rem',
            }}
          >
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-error)' }}>
              Something went wrong
            </h1>
            <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  background: 'transparent',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-grid)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Go Home
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  background: 'var(--color-bg)',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                }}
              >
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  Error Details (Dev Only)
                </summary>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
