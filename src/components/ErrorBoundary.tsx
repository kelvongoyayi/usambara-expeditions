import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 bg-red-50 text-red-900 rounded-md">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <details className="text-sm whitespace-pre-wrap">
            <summary className="cursor-pointer mb-2">Show error details</summary>
            <p className="mb-2"><strong>Error:</strong> {this.state.error?.toString()}</p>
            <p className="mb-2"><strong>Stack:</strong> <pre>{this.state.error?.stack}</pre></p>
            {this.state.errorInfo && (
              <p><strong>Component Stack:</strong> <pre>{this.state.errorInfo.componentStack}</pre></p>
            )}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 