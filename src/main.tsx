import { Component, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught error in Rusty.Lub application:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0c0d10',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'monospace'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: '#151922',
            border: '1px solid #ff2a4d',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ color: '#ff2a4d', margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>
              ⚠️ RUSTY.LUB SYSTEM ERROR / ОШИБКА ЗАГРУЗКИ
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              Произошла непредвиденная ошибка при инициализации интерфейса. Нажмите кнопку ниже для сброса поврежденного локального кеша и перезагрузки.
            </p>
            {this.state.error && (
              <pre style={{
                backgroundColor: '#07090f',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#ef4444',
                overflowX: 'auto',
                marginBottom: '16px'
              }}>
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#cd412b',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              🔄 СБРОСИТЬ КЕШ И ПЕРЕЗАГРУЗИТЬ (RELOAD)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

