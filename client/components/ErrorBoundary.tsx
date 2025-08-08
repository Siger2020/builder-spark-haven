import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Check if it's a Radix UI related error
    if (error.message?.includes('TooltipProvider') ||
        error.stack?.includes('TooltipProvider') ||
        error.stack?.includes('@radix-ui/react-tooltip')) {
      console.warn('Tooltip-related error detected, attempting recovery...');
    }

    // Check if it's a Select component error (common in production)
    if (error.stack?.includes('Select') ||
        error.message?.includes('Select') ||
        error.stack?.includes('SelectTrigger') ||
        error.stack?.includes('SelectValue') ||
        error.stack?.includes('SelectContent')) {
      console.warn('Select component error detected, likely due to Radix UI component mismatch');
    }

    // Log component stack for debugging
    if (errorInfo.componentStack) {
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.handleReset} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-center text-gray-900 mb-2">
              حدث ��طأ غير متوقع
            </h1>
            <p className="text-gray-600 text-center mb-6">
              نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                المحاولة مرة أخرى
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                إعادة تحميل الصفحة
              </button>
            </div>
            {this.state.error && (
              <details className="mt-4 text-xs text-gray-500">
                <summary className="cursor-pointer">تفاصيل الخطأ</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
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
