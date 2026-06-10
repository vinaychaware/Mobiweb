import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('🔴 React Error Boundary caught:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0b0f19',
          color: '#f3f4f6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'monospace'
        }}>
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '800px',
            width: '100%'
          }}>
            <h1 style={{ color: '#f87171', fontSize: '1.5rem', marginBottom: '1rem' }}>
              ⚠️ Application Error
            </h1>
            <p style={{ color: '#fca5a5', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {this.state.error?.message || 'Unknown error'}
            </p>
            <pre style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#fcd34d',
              overflow: 'auto',
              maxHeight: '300px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {this.state.error?.stack}
            </pre>
            {this.state.info && (
              <pre style={{
                background: 'rgba(0,0,0,0.4)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: '#86efac',
                overflow: 'auto',
                maxHeight: '200px',
                whiteSpace: 'pre-wrap',
                marginTop: '1rem'
              }}>
                Component Stack:{this.state.info.componentStack}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
